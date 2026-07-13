import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { CVFormData } from "@/components/cv-templates/types";

export interface CVDraft {
  id: string;
  user_id: string;
  name: string;
  template_id: string;
  form_data: CVFormData;
  created_at: string;
  updated_at: string;
}

export const useCVDrafts = () => {
  const [drafts, setDrafts] = useState<CVDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchDrafts = async () => {
    if (!user) {
      setDrafts([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("cv_drafts")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      
      setDrafts(data?.map(d => ({
        ...d,
        form_data: d.form_data as unknown as CVFormData
      })) || []);
    } catch (error: any) {
      console.error("Error fetching CV drafts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, [user]);

  const saveDraft = async (
    name: string,
    templateId: string,
    formData: CVFormData,
    existingId?: string
  ): Promise<string | null> => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your CV",
        variant: "destructive",
      });
      return null;
    }

    try {
      if (existingId) {
        const { error } = await supabase
          .from("cv_drafts")
          .update({
            name,
            template_id: templateId,
            form_data: JSON.parse(JSON.stringify(formData)),
          })
          .eq("id", existingId);

        if (error) throw error;

        toast({
          title: "CV Updated",
          description: `"${name}" has been saved`,
        });

        await fetchDrafts();
        return existingId;
      } else {
        const { data, error } = await supabase
          .from("cv_drafts")
          .insert({
            user_id: user.id,
            name,
            template_id: templateId,
            form_data: JSON.parse(JSON.stringify(formData)),
          })
          .select()
          .single();

        if (error) throw error;

        toast({
          title: "CV Saved",
          description: `"${name}" has been created`,
        });

        await fetchDrafts();
        return data.id;
      }
    } catch (error: any) {
      console.error("Error saving CV draft:", error);
      toast({
        title: "Error",
        description: "Failed to save CV",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteDraft = async (id: string) => {
    try {
      const { error } = await supabase
        .from("cv_drafts")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "CV Deleted",
        description: "Your CV has been removed",
      });

      await fetchDrafts();
    } catch (error: any) {
      console.error("Error deleting CV draft:", error);
      toast({
        title: "Error",
        description: "Failed to delete CV",
        variant: "destructive",
      });
    }
  };

  const renameDraft = async (id: string, newName: string) => {
    try {
      const { error } = await supabase
        .from("cv_drafts")
        .update({ name: newName })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "CV Renamed",
        description: `Renamed to "${newName}"`,
      });

      await fetchDrafts();
    } catch (error: any) {
      console.error("Error renaming CV draft:", error);
      toast({
        title: "Error",
        description: "Failed to rename CV",
        variant: "destructive",
      });
    }
  };

  const duplicateDraft = async (id: string) => {
    if (!user) return;

    try {
      const source = drafts.find((d) => d.id === id);
      if (!source) return;

      const { error } = await supabase
        .from("cv_drafts")
        .insert({
          user_id: user.id,
          name: `${source.name} (Copy)`,
          template_id: source.template_id,
          form_data: JSON.parse(JSON.stringify(source.form_data)),
        });

      if (error) throw error;

      toast({
        title: "CV Duplicated",
        description: `Created a copy of "${source.name}"`,
      });

      await fetchDrafts();
    } catch (error: any) {
      console.error("Error duplicating CV draft:", error);
      toast({
        title: "Error",
        description: "Failed to duplicate CV",
        variant: "destructive",
      });
    }
  };

  return {
    drafts,
    loading,
    saveDraft,
    deleteDraft,
    renameDraft,
    duplicateDraft,
    refetch: fetchDrafts,
  };
};
