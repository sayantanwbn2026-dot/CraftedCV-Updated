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
const MAX_ARRAY_LENGTH = 20;

function sanitizeString(text: string | undefined, maxLength: number = MAX_STRING_LENGTH): string {
  if (!text || typeof text !== "string") return "";
  return text
    .replace(/[\r\n]+/g, " ") // Remove newlines to prevent prompt injection
    .replace(/[<>{}]/g, "") // Remove potential markup/code injection chars
    .substring(0, maxLength)
    .trim();
}

function validateAndSanitizeContext(type: string, context: any): { valid: boolean; error?: string; sanitized?: any } {
  if (!context || typeof context !== "object") {
    return { valid: false, error: "Invalid context provided" };
  }

  const sanitized: any = {};

  switch (type) {
    case "summary":
      sanitized.firstName = sanitizeString(context.firstName, MAX_NAME_LENGTH);
      sanitized.lastName = sanitizeString(context.lastName, MAX_NAME_LENGTH);
      sanitized.skills = sanitizeString(context.skills);
      sanitized.targetJobTitle = sanitizeString(context.targetJobTitle, 200);
      
      if (Array.isArray(context.experience)) {
        sanitized.experience = context.experience.slice(0, MAX_ARRAY_LENGTH).map((e: any) => ({
          position: sanitizeString(e?.position, 200),
          company: sanitizeString(e?.company, 200),
          description: sanitizeString(e?.description, 500),
        }));
      }
      
      if (Array.isArray(context.education)) {
        sanitized.education = context.education.slice(0, MAX_ARRAY_LENGTH).map((e: any) => ({
          degree: sanitizeString(e?.degree, 200),
          field: sanitizeString(e?.field, 200),
          institution: sanitizeString(e?.institution, 200),
        }));
      }

      if (Array.isArray(context.projects)) {
        sanitized.projects = context.projects.slice(0, MAX_ARRAY_LENGTH).map((p: any) => ({
          name: sanitizeString(p?.name, 200),
          technologies: sanitizeString(p?.technologies, 300),
          description: sanitizeString(p?.description, 500),
        }));
      }
      break;

    case "experience":
      sanitized.position = sanitizeString(context.position, 200);
      sanitized.company = sanitizeString(context.company, 200);
      sanitized.location = sanitizeString(context.location, 200);
      sanitized.description = sanitizeString(context.description, 2000);
      
      if (!sanitized.position || !sanitized.company) {
        return { valid: false, error: "Position and company are required for experience generation" };
      }
      break;

    case "project":
      sanitized.name = sanitizeString(context.name, 200);
      sanitized.technologies = sanitizeString(context.technologies);
      sanitized.description = sanitizeString(context.description, 2000);
      
      if (!sanitized.name) {
        return { valid: false, error: "Project name is required" };
      }
      break;

    default:
      return { valid: false, error: `Unknown generation type: ${type}` };
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
    const { type, context } = body;

    // Validate type
    if (!type || typeof type !== "string") {
      return new Response(JSON.stringify({ error: "Invalid generation type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate and sanitize context
    const validation = validateAndSanitizeContext(type, context);
    if (!validation.valid) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sanitizedContext = validation.sanitized;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    switch (type) {
      case "summary":
        systemPrompt = `You are an expert CV writer specializing in creating ATS-optimized professional summaries. 
Create compelling, concise professional summaries that highlight key achievements, skills, and career goals.
Keep summaries between 2-4 sentences. Use action-oriented language and include relevant keywords from the candidate's background.
The summary should feel personalized and reflect the candidate's unique combination of skills and experience.`;
        
        const experienceStr = sanitizedContext.experience?.length > 0 
          ? sanitizedContext.experience.map((e: any) => `${e.position} at ${e.company}${e.description ? ` (${e.description.substring(0, 100)}...)` : ""}`).join("; ")
          : "No work experience listed";
        
        const educationStr = sanitizedContext.education?.length > 0
          ? sanitizedContext.education.map((e: any) => `${e.degree} in ${e.field} from ${e.institution}`).join("; ")
          : "No education listed";
        
        const projectsStr = sanitizedContext.projects?.length > 0
          ? sanitizedContext.projects.map((p: any) => `${p.name}${p.technologies ? ` (${p.technologies})` : ""}`).join("; ")
          : "No projects listed";

        const targetJobStr = sanitizedContext.targetJobTitle ? `\nTARGET JOB TITLE: ${sanitizedContext.targetJobTitle}` : "";

        userPrompt = `Generate a highly personalized, ATS-optimized professional summary for a candidate with the following complete profile:

NAME: ${sanitizedContext.firstName} ${sanitizedContext.lastName}
${targetJobStr}
SKILLS: ${sanitizedContext.skills || "Not specified"}

WORK EXPERIENCE: ${experienceStr}

EDUCATION: ${educationStr}

PROJECTS: ${projectsStr}

Create a compelling 2-4 sentence professional summary that:
1. Opens with a strong professional identity statement${sanitizedContext.targetJobTitle ? ` tailored for the "${sanitizedContext.targetJobTitle}" role` : ""}
2. Highlights the most impressive and relevant skills/experience${sanitizedContext.targetJobTitle ? ` for the target role` : ""}
3. Mentions key technical competencies or domain expertise
4. Conveys career focus and value proposition

Write only the summary paragraph, no additional text, titles, or formatting.`;
        break;

      case "experience":
        systemPrompt = `You are an expert CV writer specializing in creating ATS-optimized job descriptions.
Create 3-5 bullet points that highlight achievements, use action verbs, and include quantifiable results where possible.
Each bullet should start with a strong action verb and be concise but impactful.`;
        userPrompt = `Generate professional bullet points for this work experience:
Position: ${sanitizedContext.position}
Company: ${sanitizedContext.company}
Location: ${sanitizedContext.location || "Not specified"}
Current Description: ${sanitizedContext.description || "No description provided"}

Generate 3-5 ATS-friendly bullet points. Each should start with an action verb.
Return only the bullet points, one per line, starting with a hyphen.`;
        break;

      case "project":
        systemPrompt = `You are an expert CV writer specializing in creating compelling project descriptions.
Create concise project descriptions that highlight technical skills, problem-solving, and impact.`;
        userPrompt = `Generate a professional description for this project:
Project Name: ${sanitizedContext.name}
Technologies: ${sanitizedContext.technologies || "Not specified"}
Current Description: ${sanitizedContext.description || "No description provided"}

Write 2-3 sentences that describe the project's purpose, your role, and the impact or results.
Return only the description, no additional text.`;
        break;
    }

    console.log(`Generating content for type: ${type}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
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
      throw new Error("Failed to generate content");
    }

    const data = await response.json();
    const generatedContent = data.choices?.[0]?.message?.content || "";

    console.log(`Successfully generated content for type: ${type}`);

    return new Response(JSON.stringify({ content: generatedContent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-cv-content:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
