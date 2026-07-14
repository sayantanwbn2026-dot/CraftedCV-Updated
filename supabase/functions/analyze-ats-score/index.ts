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

// Input validation and sanitization utilities
const MAX_STRING_LENGTH = 1000;
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 255;
const MAX_ARRAY_LENGTH = 20;

function sanitizeString(text: string | undefined, maxLength: number = MAX_STRING_LENGTH): string {
  if (!text || typeof text !== "string") return "";
  return text
    .replace(/[\r\n]+/g, " ") // Remove newlines to prevent prompt injection
    .replace(/[<>{}]/g, "") // Remove potential markup/code injection chars
    .substring(0, maxLength)
    .trim();
}

function validateEmail(email: string | undefined): string {
  if (!email || typeof email !== "string") return "";
  const sanitized = sanitizeString(email, MAX_EMAIL_LENGTH);
  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(sanitized) ? sanitized : "";
}

function validatePhone(phone: string | undefined): string {
  if (!phone || typeof phone !== "string") return "";
  // Allow only digits, spaces, dashes, parentheses, and plus sign
  return phone.replace(/[^\d\s\-\(\)\+]/g, "").substring(0, 30);
}

function validateUrl(url: string | undefined): string {
  if (!url || typeof url !== "string") return "";
  const sanitized = sanitizeString(url, 500);
  // Basic URL format check
  try {
    new URL(sanitized);
    return sanitized;
  } catch {
    // If not a full URL, check if it's a relative path or username
    if (/^[a-zA-Z0-9\-_.\/]+$/.test(sanitized)) {
      return sanitized;
    }
    return "";
  }
}

function validateAndSanitizeCVData(cvData: any): { valid: boolean; error?: string; sanitized?: any } {
  if (!cvData || typeof cvData !== "object") {
    return { valid: false, error: "Invalid CV data provided" };
  }

  const sanitized: any = {
    firstName: sanitizeString(cvData.firstName, MAX_NAME_LENGTH),
    lastName: sanitizeString(cvData.lastName, MAX_NAME_LENGTH),
    email: validateEmail(cvData.email),
    phone: validatePhone(cvData.phone),
    location: sanitizeString(cvData.location, 200),
    linkedin: validateUrl(cvData.linkedin),
    portfolio: validateUrl(cvData.portfolio),
    summary: sanitizeString(cvData.summary, 2000),
    skills: sanitizeString(cvData.skills, 2000),
  };

  // Validate education array
  if (Array.isArray(cvData.education)) {
    sanitized.education = cvData.education
      .slice(0, MAX_ARRAY_LENGTH)
      .filter((e: any) => e && typeof e === "object")
      .map((e: any) => ({
        institution: sanitizeString(e.institution, 200),
        degree: sanitizeString(e.degree, 200),
        field: sanitizeString(e.field, 200),
      }));
  } else {
    sanitized.education = [];
  }

  // Validate experience array
  if (Array.isArray(cvData.experience)) {
    sanitized.experience = cvData.experience
      .slice(0, MAX_ARRAY_LENGTH)
      .filter((e: any) => e && typeof e === "object")
      .map((e: any) => ({
        position: sanitizeString(e.position, 200),
        company: sanitizeString(e.company, 200),
        location: sanitizeString(e.location, 200),
        description: sanitizeString(e.description, 2000),
      }));
  } else {
    sanitized.experience = [];
  }

  // Validate projects array
  if (Array.isArray(cvData.projects)) {
    sanitized.projects = cvData.projects
      .slice(0, MAX_ARRAY_LENGTH)
      .filter((p: any) => p && typeof p === "object")
      .map((p: any) => ({
        name: sanitizeString(p.name, 200),
        description: sanitizeString(p.description, 2000),
        technologies: sanitizeString(p.technologies),
      }));
  } else {
    sanitized.projects = [];
  }

  return { valid: true, sanitized };
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
    const { cvData } = body;

    // Validate and sanitize input
    const validation = validateAndSanitizeCVData(cvData);
    if (!validation.valid) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sanitizedCVData = validation.sanitized;
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert ATS (Applicant Tracking System) analyzer. Analyze resumes and provide:
1. An overall ATS compatibility score from 0-100
2. Specific feedback on what's good
3. Actionable tips for improvement

Focus on:
- Keyword optimization and relevance
- Formatting and structure
- Completeness of sections
- Action verbs and quantifiable achievements
- Contact information completeness

Respond in JSON format:
{
  "score": number (0-100),
  "summary": "Brief 1-2 sentence summary of the CV's ATS compatibility",
  "strengths": ["strength1", "strength2", ...],
  "improvements": ["improvement1", "improvement2", ...],
  "tips": ["tip1", "tip2", ...]
}`;

    const userPrompt = `Analyze this CV for ATS compatibility:

Name: ${sanitizedCVData.firstName} ${sanitizedCVData.lastName}
Email: ${sanitizedCVData.email || "Not provided"}
Phone: ${sanitizedCVData.phone || "Not provided"}
Location: ${sanitizedCVData.location || "Not provided"}
LinkedIn: ${sanitizedCVData.linkedin || "Not provided"}
Portfolio: ${sanitizedCVData.portfolio || "Not provided"}

Professional Summary:
${sanitizedCVData.summary || "Not provided"}

Skills: ${sanitizedCVData.skills || "Not provided"}

Education:
${sanitizedCVData.education.filter((e: any) => e.institution).map((e: any) => 
  `- ${e.degree} in ${e.field} from ${e.institution}`
).join("\n") || "Not provided"}

Work Experience:
${sanitizedCVData.experience.map((e: any) => 
  `- ${e.position} at ${e.company}${e.location ? ` (${e.location})` : ""}\n  ${e.description || "No description"}`
).join("\n") || "Not provided"}

Projects:
${sanitizedCVData.projects.map((p: any) => 
  `- ${p.name}: ${p.description || "No description"} (Tech: ${p.technologies || "Not specified"})`
).join("\n") || "Not provided"}

Provide a detailed ATS analysis in the JSON format specified.`;

    console.log("Analyzing CV for ATS score...");

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
          { role: "user", content: userPrompt },
        ],
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
      throw new Error("Failed to parse ATS analysis");
    }

    const analysis = JSON.parse(jsonMatch[0]);
    console.log("ATS analysis completed. Score:", analysis.score);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-ats-score:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
