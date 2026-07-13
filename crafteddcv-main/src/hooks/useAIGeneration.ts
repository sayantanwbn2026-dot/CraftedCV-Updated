import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type GenerationType = "summary" | "experience" | "project";

export function useAIGeneration() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<string | null>(null);

  const generateContent = async (type: GenerationType, context: Record<string, any>): Promise<string | null> => {
    setIsLoading(true);
    setLoadingType(type);

    try {
      // Get current session for authentication
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please sign in to use AI features");
        return null;
      }

      const { data, error } = await supabase.functions.invoke("generate-cv-content", {
        body: { type, context },
      });

      if (error) {
        console.error("Error generating content:", error);
        if (error.message?.includes("401") || error.message?.includes("Authentication")) {
          toast.error("Session expired. Please sign in again.");
        } else {
          toast.error("Failed to generate content. Please try again.");
        }
        return null;
      }

      if (data?.error) {
        toast.error(data.error);
        return null;
      }

      toast.success("Content generated successfully!");
      return data.content;
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("An unexpected error occurred.");
      return null;
    } finally {
      setIsLoading(false);
      setLoadingType(null);
    }
  };

  return { generateContent, isLoading, loadingType };
}