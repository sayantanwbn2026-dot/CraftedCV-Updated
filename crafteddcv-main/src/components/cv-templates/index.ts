import ModernMinimalTemplate from "./ModernMinimalTemplate";
import ProfessionalClassicTemplate from "./ProfessionalClassicTemplate";
import CreativeBoldTemplate from "./CreativeBoldTemplate";
import ExecutiveEliteTemplate from "./ExecutiveEliteTemplate";
import TechFocusedTemplate from "./TechFocusedTemplate";
import AcademicScholarTemplate from "./AcademicScholarTemplate";
import StartupDynamicTemplate from "./StartupDynamicTemplate";
import HealthcareProTemplate from "./HealthcareProTemplate";
import CleanGridTemplate from "./CleanGridTemplate";
import CorporateFormalTemplate from "./CorporateFormalTemplate";
import MinimalistProTemplate from "./MinimalistProTemplate";
import BoldImpactTemplate from "./BoldImpactTemplate";
import DataDrivenTemplate from "./DataDrivenTemplate";
import ResearchPaperTemplate from "./ResearchPaperTemplate";
import ClinicalPrecisionTemplate from "./ClinicalPrecisionTemplate";
import LeadershipSuiteTemplate from "./LeadershipSuiteTemplate";
import SwissDesignTemplate from "./SwissDesignTemplate";
import GovernmentServiceTemplate from "./GovernmentServiceTemplate";
import LegalProfessionalTemplate from "./LegalProfessionalTemplate";
import MarketingCreativeTemplate from "./MarketingCreativeTemplate";
import EngineeringBlueprintTemplate from "./EngineeringBlueprintTemplate";
import FinanceAnalystTemplate from "./FinanceAnalystTemplate";
import ConsultingEliteTemplate from "./ConsultingEliteTemplate";
import EducationProfessionalTemplate from "./EducationProfessionalTemplate";
import { TemplateId, CVFormData } from "./types";

export { default as ContactIcon } from "./ContactIcon";
export * from "./types";
export { coverPageComponents } from "./cover-pages";

export const templateComponents: Record<TemplateId, React.ComponentType<{ formData: CVFormData }>> = {
  "modern-minimal": ModernMinimalTemplate,
  "professional-classic": ProfessionalClassicTemplate,
  "creative-bold": CreativeBoldTemplate,
  "executive-elite": ExecutiveEliteTemplate,
  "tech-focused": TechFocusedTemplate,
  "academic-scholar": AcademicScholarTemplate,
  "startup-dynamic": StartupDynamicTemplate,
  "healthcare-pro": HealthcareProTemplate,
  "clean-grid": CleanGridTemplate,
  "corporate-formal": CorporateFormalTemplate,
  "minimalist-pro": MinimalistProTemplate,
  "bold-impact": BoldImpactTemplate,
  "data-driven": DataDrivenTemplate,
  "research-paper": ResearchPaperTemplate,
  "clinical-precision": ClinicalPrecisionTemplate,
  "leadership-suite": LeadershipSuiteTemplate,
  "swiss-design": SwissDesignTemplate,
  "government-service": GovernmentServiceTemplate,
  "legal-professional": LegalProfessionalTemplate,
  "marketing-creative": MarketingCreativeTemplate,
  "engineering-blueprint": EngineeringBlueprintTemplate,
  "finance-analyst": FinanceAnalystTemplate,
  "consulting-elite": ConsultingEliteTemplate,
  "education-professional": EducationProfessionalTemplate,
};

export const templateNames: Record<TemplateId, string> = {
  "modern-minimal": "Modern Minimal",
  "professional-classic": "Professional Classic",
  "creative-bold": "Creative Bold",
  "executive-elite": "Executive Elite",
  "tech-focused": "Tech Focused",
  "academic-scholar": "Academic Scholar",
  "startup-dynamic": "Startup Dynamic",
  "healthcare-pro": "Healthcare Pro",
  "clean-grid": "Clean Grid",
  "corporate-formal": "Corporate Formal",
  "minimalist-pro": "Minimalist Pro",
  "bold-impact": "Bold Impact",
  "data-driven": "Data Driven",
  "research-paper": "Research Paper",
  "clinical-precision": "Clinical Precision",
  "leadership-suite": "Leadership Suite",
  "swiss-design": "Swiss Design",
  "government-service": "Government Service",
  "legal-professional": "Legal Professional",
  "marketing-creative": "Marketing Creative",
  "engineering-blueprint": "Engineering Blueprint",
  "finance-analyst": "Finance Analyst",
  "consulting-elite": "Consulting Elite",
  "education-professional": "Education Professional",
};

export {
  ModernMinimalTemplate,
  ProfessionalClassicTemplate,
  CreativeBoldTemplate,
  ExecutiveEliteTemplate,
  TechFocusedTemplate,
  AcademicScholarTemplate,
  StartupDynamicTemplate,
  HealthcareProTemplate,
  CleanGridTemplate,
  CorporateFormalTemplate,
  MinimalistProTemplate,
  BoldImpactTemplate,
  DataDrivenTemplate,
  ResearchPaperTemplate,
  ClinicalPrecisionTemplate,
  LeadershipSuiteTemplate,
  SwissDesignTemplate,
  GovernmentServiceTemplate,
  LegalProfessionalTemplate,
  MarketingCreativeTemplate,
  EngineeringBlueprintTemplate,
  FinanceAnalystTemplate,
  ConsultingEliteTemplate,
  EducationProfessionalTemplate,
};
