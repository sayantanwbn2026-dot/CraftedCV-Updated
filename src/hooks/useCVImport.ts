import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { CVFormData, Education, Experience, Project } from "@/components/cv-templates/types";

interface ImportedCVData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  summary: string;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
  }>;
  experience: Array<{
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string;
    link: string;
  }>;
  skills: string;
}

export function useCVImport() {
  const [isImporting, setIsImporting] = useState(false);

  const importFromFile = async (file: File): Promise<CVFormData | null> => {
    setIsImporting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please sign in to import a CV");
        return null;
      }

      // Validate file type
      const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "text/plain"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a PDF, JPG, PNG, or TXT file");
        return null;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return null;
      }

      // Convert file to base64
      const base64Content = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Remove data URL prefix
          const base64 = result.split(",")[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const { data, error } = await supabase.functions.invoke("import-cv", {
        body: {
          fileContent: base64Content,
          fileType: file.type,
        },
      });

      if (error) {
        console.error("Import error:", error);
        toast.error(error.message || "Failed to import CV");
        return null;
      }

      const formData = transformToFormData(data as ImportedCVData);
      toast.success("CV imported successfully!");
      return formData;
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Failed to import CV. Please try again.");
      return null;
    } finally {
      setIsImporting(false);
    }
  };

  const importFromText = async (text: string): Promise<CVFormData | null> => {
    setIsImporting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please sign in to import a CV");
        return null;
      }

      if (!text.trim()) {
        toast.error("Please paste your CV text");
        return null;
      }

      const { data, error } = await supabase.functions.invoke("import-cv", {
        body: {
          textContent: text,
        },
      });

      if (error) {
        console.error("Import error:", error);
        toast.error(error.message || "Failed to import CV");
        return null;
      }

      const formData = transformToFormData(data as ImportedCVData);
      toast.success("CV imported successfully!");
      return formData;
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Failed to import CV. Please try again.");
      return null;
    } finally {
      setIsImporting(false);
    }
  };

  return { importFromFile, importFromText, isImporting };
}

function transformToFormData(data: ImportedCVData): CVFormData {
  // Transform education entries with IDs
  const education: Education[] = data.education?.length > 0
    ? data.education.map((edu, index) => ({
        id: `imported-edu-${index}-${Date.now()}`,
        institution: edu.institution || "",
        degree: edu.degree || "",
        field: edu.field || "",
        startDate: edu.startDate || "",
        endDate: edu.endDate || "",
      }))
    : [{ id: "1", institution: "", degree: "", field: "", startDate: "", endDate: "" }];

  // Transform experience entries with IDs
  const experience: Experience[] = data.experience?.map((exp, index) => ({
    id: `imported-exp-${index}-${Date.now()}`,
    company: exp.company || "",
    position: exp.position || "",
    location: exp.location || "",
    startDate: exp.startDate || "",
    endDate: exp.endDate === "Present" ? "" : (exp.endDate || ""),
    description: exp.description || "",
  })) || [];

  // Transform project entries with IDs
  const projects: Project[] = data.projects?.map((proj, index) => ({
    id: `imported-proj-${index}-${Date.now()}`,
    name: proj.name || "",
    description: proj.description || "",
    technologies: proj.technologies || "",
    link: proj.link || "",
  })) || [];

  return {
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    email: data.email || "",
    phone: data.phone || "",
    location: data.location || "",
    linkedin: data.linkedin || "",
    portfolio: data.portfolio || "",
    summary: data.summary || "",
    education,
    experience,
    projects,
    skills: data.skills || "",
  };
}
