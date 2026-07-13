import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ATSAnalysis {
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  tips: string[];
}

export const useATSAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);

  const analyzeCV = async (cvData: any): Promise<ATSAnalysis | null> => {
    setIsAnalyzing(true);
    try {
      // Get current session for authentication
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please sign in to analyze your CV");
        return null;
      }

      const { data, error } = await supabase.functions.invoke("analyze-ats-score", {
        body: { cvData },
      });

      if (error) {
        if (error.message?.includes("401") || error.message?.includes("Authentication")) {
          throw new Error("Session expired. Please sign in again.");
        }
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setAnalysis(data);
      return data;
    } catch (error) {
      console.error("ATS analysis error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to analyze CV. Please try again.");
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearAnalysis = () => {
    setAnalysis(null);
  };

  return { analyzeCV, isAnalyzing, analysis, clearAnalysis };
};