import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { CVFormData } from "@/components/cv-templates/types";

export interface JobMatchResult {
  matchScore: number;
  verdict: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  tailoredSummary: string;
  suggestions: string[];
}

export interface InterviewQuestion {
  question: string;
  category: string;
  hint: string;
  focusArea?: string;
}

export type CareerAITool = "job_match" | "cover_letter" | "interview_prep" | "suggest_skills";

export interface CareerAIContextOptions {
  uploadedCvName?: string;
  uploadedCvContext?: string;
  saveHistory?: boolean;
}

interface CoverLetterOptions extends CareerAIContextOptions {
  tone?: "professional" | "enthusiastic" | "formal";
  company?: string;
  role?: string;
}

export function useCareerAI() {
  const [loadingTool, setLoadingTool] = useState<CareerAITool | null>(null);

  const invoke = async <T,>(
    tool: CareerAITool,
    cv: CVFormData,
    jobDescription: string,
    options: Record<string, string | boolean | undefined> = {}
  ): Promise<T | null> => {
    setLoadingTool(tool);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        toast.error("Please sign in to use AI features");
        return null;
      }

      const { data, error } = await supabase.functions.invoke("career-ai", {
        body: { tool, cv, jobDescription, options },
      });

      if (error) {
        console.error(`career-ai ${tool} error:`, error);
        if (error.message?.includes("401") || error.message?.includes("Authentication")) {
          toast.error("Session expired. Please sign in again.");
        } else {
          toast.error("AI request failed. Please try again.");
        }
        return null;
      }

      if (data?.error) {
        toast.error(data.error);
        return null;
      }

      return data as T;
    } catch (err) {
      console.error(`career-ai ${tool} unexpected error:`, err);
      toast.error("An unexpected error occurred.");
      return null;
    } finally {
      setLoadingTool(null);
    }
  };

  const analyzeJobMatch = (cv: CVFormData, jobDescription: string, options: CareerAIContextOptions = {}) =>
    invoke<JobMatchResult>("job_match", cv, jobDescription, {
      uploadedCvName: options.uploadedCvName,
      uploadedCvContext: options.uploadedCvContext,
      saveHistory: options.saveHistory,
    });

  const generateCoverLetter = async (cv: CVFormData, jobDescription: string, options: CoverLetterOptions = {}) => {
    const result = await invoke<{ letter: string }>("cover_letter", cv, jobDescription, {
      tone: options.tone,
      company: options.company,
      role: options.role,
      uploadedCvName: options.uploadedCvName,
      uploadedCvContext: options.uploadedCvContext,
      saveHistory: options.saveHistory,
    });
    return result?.letter ?? null;
  };

  const generateInterviewPrep = async (cv: CVFormData, jobDescription: string, options: CareerAIContextOptions = {}) => {
    const result = await invoke<{ questions: InterviewQuestion[] }>("interview_prep", cv, jobDescription, {
      uploadedCvName: options.uploadedCvName,
      uploadedCvContext: options.uploadedCvContext,
      saveHistory: options.saveHistory,
    });
    return Array.isArray(result?.questions) ? result.questions : null;
  };

  const suggestSkills = async (
    cv: CVFormData,
    jobDescription?: string,
    targetJobTitle?: string,
    options: CareerAIContextOptions = {}
  ) => {
    const result = await invoke<{ skills: string[] }>("suggest_skills", cv, jobDescription || "", {
      targetJobTitle,
      uploadedCvName: options.uploadedCvName,
      uploadedCvContext: options.uploadedCvContext,
      saveHistory: options.saveHistory,
    });
    return Array.isArray(result?.skills) ? result.skills : null;
  };

  return {
    analyzeJobMatch,
    generateCoverLetter,
    generateInterviewPrep,
    suggestSkills,
    loadingTool,
    isLoading: loadingTool !== null,
  };
}
