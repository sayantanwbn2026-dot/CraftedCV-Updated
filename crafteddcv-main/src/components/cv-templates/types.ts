export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link: string;
}

export interface CVFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  summary: string;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: string;
}

export interface CVTemplateProps {
  formData: CVFormData;
}

export type TemplateId = 
  | "modern-minimal"
  | "professional-classic"
  | "creative-bold"
  | "executive-elite"
  | "tech-focused"
  | "academic-scholar"
  | "startup-dynamic"
  | "healthcare-pro"
  | "clean-grid"
  | "corporate-formal"
  | "minimalist-pro"
  | "bold-impact"
  | "data-driven"
  | "research-paper"
  | "clinical-precision"
  | "leadership-suite"
  | "swiss-design"
  | "government-service"
  | "legal-professional"
  | "marketing-creative"
  | "engineering-blueprint"
  | "finance-analyst"
  | "consulting-elite"
  | "education-professional";

export type TemplateCategory = "Creative" | "Corporate" | "Executive" | "Tech" | "Academic" | "Healthcare";

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return "";
  const date = new Date(dateStr + "-01");
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};
