import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Authentication helper
async function authenticateUser(req: Request): Promise<{ userId: string } | { error: string; status: number }> {
  const authHeader = req.headers.get("Authorization");
  
  if (!authHeader?.startsWith("Bearer ")) {
    return { error: "Authentication required. Please sign in to use AI features.", status: 401 };
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseAnonKey) {
    return { error: "Server configuration error", status: 500 };
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const token = authHeader.replace("Bearer ", "");
  const { data, error } = await supabase.auth.getClaims(token);

  if (error || !data?.claims) {
    return { error: "Invalid or expired session. Please sign in again.", status: 401 };
  }

  return { userId: data.claims.sub as string };
}

// Input validation utilities
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB limit (reduced from 10MB)
const MAX_FILENAME_LENGTH = 255;
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

function validateFileName(fileName: string | undefined): { valid: boolean; sanitized: string; error?: string } {
  if (!fileName || typeof fileName !== "string") {
    return { valid: false, sanitized: "", error: "File name is required" };
  }
  
  // Remove path separators and dangerous characters
  const sanitized = fileName
    .replace(/[\/\\<>:"|?*]/g, "")
    .substring(0, MAX_FILENAME_LENGTH)
    .trim();
  
  if (!sanitized) {
    return { valid: false, sanitized: "", error: "Invalid file name" };
  }
  
  return { valid: true, sanitized };
}

function validateFileType(fileType: string | undefined): { valid: boolean; error?: string } {
  if (!fileType || typeof fileType !== "string") {
    return { valid: false, error: "File type is required" };
  }
  
  if (!ALLOWED_FILE_TYPES.includes(fileType.toLowerCase())) {
    return { valid: false, error: "Unsupported file type. Please upload JPG, PNG, or PDF." };
  }
  
  return { valid: true };
}

function validateBase64Content(content: string | undefined): { valid: boolean; sizeBytes: number; error?: string } {
  if (!content || typeof content !== "string") {
    return { valid: false, sizeBytes: 0, error: "File content is required" };
  }
  
  // Check if it's valid base64
  const base64Regex = /^[A-Za-z0-9+/=]+$/;
  if (!base64Regex.test(content)) {
    return { valid: false, sizeBytes: 0, error: "Invalid file content format" };
  }
  
  // Calculate approximate size (base64 is ~33% larger than original)
  const sizeBytes = Math.ceil((content.length * 3) / 4);
  
  if (sizeBytes > MAX_FILE_SIZE_BYTES) {
    return { valid: false, sizeBytes, error: `File too large. Maximum size is ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB` };
  }
  
  return { valid: true, sizeBytes };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authResult = await authenticateUser(req);
    if ("error" in authResult) {
      return new Response(JSON.stringify({ error: authResult.error }), {
        status: authResult.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Authenticated user: ${authResult.userId}`);

    const body = await req.json();
    const { fileContent, fileType, fileName } = body;

    // Validate file name
    const fileNameValidation = validateFileName(fileName);
    if (!fileNameValidation.valid) {
      return new Response(JSON.stringify({ error: fileNameValidation.error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate file type
    const fileTypeValidation = validateFileType(fileType);
    if (!fileTypeValidation.valid) {
      return new Response(JSON.stringify({ error: fileTypeValidation.error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate file content
    const contentValidation = validateBase64Content(fileContent);
    if (!contentValidation.valid) {
      return new Response(JSON.stringify({ error: contentValidation.error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const isImage = ["image/jpeg", "image/jpg", "image/png"].includes(fileType.toLowerCase());
    const isPDF = fileType.toLowerCase() === "application/pdf";

    const sanitizedFileName = fileNameValidation.sanitized;

    const systemPrompt = `You are an expert ATS (Applicant Tracking System) analyzer and CV/Resume reader. 
Your task is to:
1. Extract and understand the content from the provided CV/resume
2. Analyze it for ATS compatibility
3. Provide detailed feedback

Focus on:
- Keyword optimization and relevance
- Formatting and structure (as visible)
- Completeness of sections
- Action verbs and quantifiable achievements
- Contact information completeness
- Overall professional presentation

Respond ONLY in this exact JSON format:
{
  "score": number (0-100),
  "summary": "Brief 1-2 sentence summary of the CV's ATS compatibility",
  "extractedInfo": {
    "name": "extracted name or 'Not found'",
    "email": "extracted email or 'Not found'",
    "phone": "extracted phone or 'Not found'",
    "skills": ["skill1", "skill2"],
    "experienceCount": number,
    "educationCount": number
  },
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "tips": ["tip1", "tip2", "tip3"]
}`;

    let messages;

    if (isImage) {
      messages = [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `This is a CV/resume image. Please extract all text content, analyze it for ATS compatibility, and provide the JSON response as specified.`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${fileType};base64,${fileContent}`
              }
            }
          ]
        }
      ];
    } else {
      // For PDF, we send the base64 content for text extraction
      messages = [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `This is a CV/resume PDF. The PDF content is provided as base64. Please analyze it for ATS compatibility and provide the JSON response as specified.`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${fileType};base64,${fileContent}`
              }
            }
          ]
        }
      ];
    }

    console.log(`Analyzing uploaded CV: ${sanitizedFileName} (${fileType}, ${Math.round(contentValidation.sizeBytes / 1024)}KB)`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to analyze CV");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Failed to parse response:", content);
      throw new Error("Failed to parse ATS analysis");
    }

    const analysis = JSON.parse(jsonMatch[0]);
    console.log("ATS analysis completed. Score:", analysis.score);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-uploaded-cv:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
