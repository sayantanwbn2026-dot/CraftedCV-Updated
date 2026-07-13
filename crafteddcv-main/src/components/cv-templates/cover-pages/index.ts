import ModernMinimalCover from "./ModernMinimalCover";
import ProfessionalClassicCover from "./ProfessionalClassicCover";
import CreativeBoldCover from "./CreativeBoldCover";
import ExecutiveEliteCover from "./ExecutiveEliteCover";
import TechFocusedCover from "./TechFocusedCover";
import AcademicScholarCover from "./AcademicScholarCover";
import StartupDynamicCover from "./StartupDynamicCover";
import HealthcareProCover from "./HealthcareProCover";
import CleanGridCover from "./CleanGridCover";
import CorporateFormalCover from "./CorporateFormalCover";
import MinimalistProCover from "./MinimalistProCover";
import BoldImpactCover from "./BoldImpactCover";
import DataDrivenCover from "./DataDrivenCover";
import ResearchPaperCover from "./ResearchPaperCover";
import ClinicalPrecisionCover from "./ClinicalPrecisionCover";
import LeadershipSuiteCover from "./LeadershipSuiteCover";
import SwissDesignCover from "./SwissDesignCover";
import GovernmentServiceCover from "./GovernmentServiceCover";
import LegalProfessionalCover from "./LegalProfessionalCover";
import MarketingCreativeCover from "./MarketingCreativeCover";
import EngineeringBlueprintCover from "./EngineeringBlueprintCover";
import FinanceAnalystCover from "./FinanceAnalystCover";
import ConsultingEliteCover from "./ConsultingEliteCover";
import EducationProfessionalCover from "./EducationProfessionalCover";
import { TemplateId, CVFormData } from "../types";

export const coverPageComponents: Record<TemplateId, React.ComponentType<{ formData: CVFormData }>> = {
  "modern-minimal": ModernMinimalCover,
  "professional-classic": ProfessionalClassicCover,
  "creative-bold": CreativeBoldCover,
  "executive-elite": ExecutiveEliteCover,
  "tech-focused": TechFocusedCover,
  "academic-scholar": AcademicScholarCover,
  "startup-dynamic": StartupDynamicCover,
  "healthcare-pro": HealthcareProCover,
  "clean-grid": CleanGridCover,
  "corporate-formal": CorporateFormalCover,
  "minimalist-pro": MinimalistProCover,
  "bold-impact": BoldImpactCover,
  "data-driven": DataDrivenCover,
  "research-paper": ResearchPaperCover,
  "clinical-precision": ClinicalPrecisionCover,
  "leadership-suite": LeadershipSuiteCover,
  "swiss-design": SwissDesignCover,
  "government-service": GovernmentServiceCover,
  "legal-professional": LegalProfessionalCover,
  "marketing-creative": MarketingCreativeCover,
  "engineering-blueprint": EngineeringBlueprintCover,
  "finance-analyst": FinanceAnalystCover,
  "consulting-elite": ConsultingEliteCover,
  "education-professional": EducationProfessionalCover,
};

export {
  ModernMinimalCover,
  ProfessionalClassicCover,
  CreativeBoldCover,
  ExecutiveEliteCover,
  TechFocusedCover,
  AcademicScholarCover,
  StartupDynamicCover,
  HealthcareProCover,
  CleanGridCover,
  CorporateFormalCover,
  MinimalistProCover,
  BoldImpactCover,
  DataDrivenCover,
  ResearchPaperCover,
  ClinicalPrecisionCover,
  LeadershipSuiteCover,
  SwissDesignCover,
  GovernmentServiceCover,
  LegalProfessionalCover,
  MarketingCreativeCover,
  EngineeringBlueprintCover,
  FinanceAnalystCover,
  ConsultingEliteCover,
  EducationProfessionalCover,
};
