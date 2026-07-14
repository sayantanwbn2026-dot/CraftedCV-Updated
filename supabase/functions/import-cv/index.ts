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
    return { error: "Authentication required. Please sign in to use import features.", status: 401 };
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

// Input validation
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB limit
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf", "text/plain"];

function validateFileType(fileType: string | undefined): { valid: boolean; error?: string } {
  if (!fileType || typeof fileType !== "string") {
    return { valid: false, error: "File type is required" };
  }
  
  if (!ALLOWED_FILE_TYPES.includes(fileType.toLowerCase())) {
    return { valid: false, error: "Unsupported file type. Please upload PDF, JPG, PNG, or TXT." };
  }
  
  return { valid: true };
}

function validateBase64Content(content: string | undefined): { valid: boolean; sizeBytes: number; error?: string } {
  if (!content || typeof content !== "string") {
    return { valid: false, sizeBytes: 0, error: "File content is required" };
  }
  
  const base64Regex = /^[A-Za-z0-9+/=]+$/;
  if (!base64Regex.test(content)) {
    return { valid: false, sizeBytes: 0, error: "Invalid file content format" };
  }
  
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
    const { fileContent, fileType, textContent } = body;

    // Handle text input directly
    if (textContent && typeof textContent === "string") {
      console.log("Processing text input for CV extraction");
      return await extractFromText(textContent);
    }

    // Handle file upload
    const fileTypeValidation = validateFileType(fileType);
    if (!fileTypeValidation.valid) {
      return new Response(JSON.stringify({ error: fileTypeValidation.error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const contentValidation = validateBase64Content(fileContent);
    if (!contentValidation.valid) {
      return new Response(JSON.stringify({ error: contentValidation.error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const isText = fileType.toLowerCase() === "text/plain";
    
    // For text files, decode and process as text
    if (isText) {
      const decodedText = atob(fileContent);
      return await extractFromText(decodedText);
    }

    // For image/PDF files, use vision model
    const systemPrompt = `You are an expert CV/Resume parser. Your task is to extract all information from the provided CV document and return it in a structured JSON format.

Extract the following information as accurately as possible:
- Personal details: first name, last name, email, phone, location, LinkedIn URL, portfolio URL
- Professional summary
- Education history: institution, degree, field of study, start date, end date
- Work experience: company, position, location, start date, end date, description
- Projects: name, description, technologies used, link
- Skills: comma-separated list

For dates, use YYYY-MM format where possible (e.g., "2020-06" for June 2020).
If information is not found, use empty strings or empty arrays.

Respond ONLY in this exact JSON format:
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "location": "string",
  "linkedin": "string",
  "portfolio": "string",
  "summary": "string",
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "field": "string",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM"
    }
  ],
  "experience": [
    {
      "company": "string",
      "position": "string",
      "location": "string",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM or Present",
      "description": "string"
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "technologies": "string",
      "link": "string"
    }
  ],
  "skills": "comma, separated, skills"
}`;

    const messages = [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Please extract all information from this CV/resume and return it in the specified JSON format."
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

    console.log(`Extracting CV data from ${fileType} file (${Math.round(contentValidation.sizeBytes / 1024)}KB)`);

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GEMINI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemini-flash-lite-latest",
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
      throw new Error("Failed to extract CV data");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Failed to parse response:", content);
      throw new Error("Failed to parse extracted CV data");
    }

    const extractedData = JSON.parse(jsonMatch[0]);
    console.log("CV data extracted successfully");

    return new Response(JSON.stringify(extractedData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in import-cv:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function extractFromText(text: string): Promise<Response> {
  const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const systemPrompt = `You are an expert CV/Resume parser. Your task is to extract all information from the provided CV text and return it in a structured JSON format.

Extract the following information as accurately as possible:
- Personal details: first name, last name, email, phone, location, LinkedIn URL, portfolio URL
- Professional summary
- Education history: institution, degree, field of study, start date, end date
- Work experience: company, position, location, start date, end date, description
- Projects: name, description, technologies used, link
- Skills: comma-separated list

For dates, use YYYY-MM format where possible (e.g., "2020-06" for June 2020).
If information is not found, use empty strings or empty arrays.

Respond ONLY in this exact JSON format:
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "location": "string",
  "linkedin": "string",
  "portfolio": "string",
  "summary": "string",
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "field": "string",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM"
    }
  ],
  "experience": [
    {
      "company": "string",
      "position": "string",
      "location": "string",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM or Present",
      "description": "string"
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "technologies": "string",
      "link": "string"
    }
  ],
  "skills": "comma, separated, skills"
}`;

  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GEMINI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gemini-flash-lite-latest",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Please extract all information from this CV/resume text:\n\n${text}` }
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("AI gateway error:", response.status, errorText);
    throw new Error("Failed to extract CV data");
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "";

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error("Failed to parse response:", content);
    throw new Error("Failed to parse extracted CV data");
  }

  const extractedData = JSON.parse(jsonMatch[0]);
  console.log("CV data extracted from text successfully");

  return new Response(JSON.stringify(extractedData), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
