import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Eye, Star, X, ArrowRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { templateComponents } from "@/components/cv-templates";
import type { CVFormData } from "@/components/cv-templates/types";

type TemplateCategory = "Creative" | "Corporate" | "Executive" | "Tech" | "Academic" | "Healthcare";

interface Template {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  isPro: boolean;
  isPopular: boolean;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const templates: Template[] = [
  // Creative
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    description: "Clean and simple design perfect for tech and creative roles",
    category: "Creative",
    isPro: false,
    isPopular: true,
    colors: { primary: "bg-primary", secondary: "bg-primary/20", accent: "bg-primary/80" },
  },
  {
    id: "creative-bold",
    name: "Creative Bold",
    description: "Stand out with a unique design for design and marketing roles",
    category: "Creative",
    isPro: false,
    isPopular: false,
    colors: { primary: "bg-primary/90", secondary: "bg-primary/25", accent: "bg-primary" },
  },
  {
    id: "startup-dynamic",
    name: "Startup Dynamic",
    description: "Energetic design for startup and entrepreneurial roles",
    category: "Creative",
    isPro: false,
    isPopular: true,
    colors: { primary: "bg-primary/90", secondary: "bg-primary/20", accent: "bg-primary" },
  },
  {
    id: "bold-impact",
    name: "Bold Impact",
    description: "High-contrast design that makes a strong visual statement",
    category: "Creative",
    isPro: false,
    isPopular: false,
    colors: { primary: "bg-primary", secondary: "bg-primary/15", accent: "bg-primary/90" },
  },
  {
    id: "swiss-design",
    name: "Swiss Design",
    description: "Grid-based typography inspired by Swiss design principles",
    category: "Creative",
    isPro: false,
    isPopular: true,
    colors: { primary: "bg-primary", secondary: "bg-primary/10", accent: "bg-primary/80" },
  },
  // Corporate
  {
    id: "professional-classic",
    name: "Professional Classic",
    description: "Traditional layout ideal for corporate and finance positions",
    category: "Corporate",
    isPro: false,
    isPopular: true,
    colors: { primary: "bg-primary", secondary: "bg-primary/15", accent: "bg-primary/70" },
  },
  {
    id: "corporate-formal",
    name: "Corporate Formal",
    description: "Formal serif design for traditional business environments",
    category: "Corporate",
    isPro: false,
    isPopular: false,
    colors: { primary: "bg-primary", secondary: "bg-primary/10", accent: "bg-primary/75" },
  },
  {
    id: "clean-grid",
    name: "Clean Grid",
    description: "Organized grid layout for structured presentations",
    category: "Corporate",
    isPro: false,
    isPopular: false,
    colors: { primary: "bg-primary/85", secondary: "bg-primary/15", accent: "bg-primary" },
  },
  // Executive
  {
    id: "executive-elite",
    name: "Executive Elite",
    description: "Sophisticated template for senior management positions",
    category: "Executive",
    isPro: false,
    isPopular: true,
    colors: { primary: "bg-primary", secondary: "bg-primary/10", accent: "bg-primary/80" },
  },
  {
    id: "leadership-suite",
    name: "Leadership Suite",
    description: "Premium design for C-level and executive leadership roles",
    category: "Executive",
    isPro: false,
    isPopular: true,
    colors: { primary: "bg-primary", secondary: "bg-primary/15", accent: "bg-primary/85" },
  },
  {
    id: "minimalist-pro",
    name: "Minimalist Pro",
    description: "Ultra-clean design for discerning professionals",
    category: "Executive",
    isPro: false,
    isPopular: false,
    colors: { primary: "bg-primary/80", secondary: "bg-primary/10", accent: "bg-primary" },
  },
  // Tech
  {
    id: "tech-focused",
    name: "Tech Focused",
    description: "Optimized for developers and IT professionals",
    category: "Tech",
    isPro: false,
    isPopular: false,
    colors: { primary: "bg-primary/80", secondary: "bg-primary/20", accent: "bg-primary" },
  },
  {
    id: "data-driven",
    name: "Data Driven",
    description: "Developer-style layout with code-inspired aesthetics",
    category: "Tech",
    isPro: false,
    isPopular: true,
    colors: { primary: "bg-primary/90", secondary: "bg-primary/25", accent: "bg-primary" },
  },
  // Academic
  {
    id: "academic-scholar",
    name: "Academic Scholar",
    description: "Perfect for researchers, professors, and academic positions",
    category: "Academic",
    isPro: false,
    isPopular: false,
    colors: { primary: "bg-primary", secondary: "bg-primary/15", accent: "bg-primary/70" },
  },
  {
    id: "research-paper",
    name: "Research Paper",
    description: "Academic paper style for scholarly professionals",
    category: "Academic",
    isPro: false,
    isPopular: false,
    colors: { primary: "bg-primary", secondary: "bg-primary/10", accent: "bg-primary/75" },
  },
  // Healthcare
  {
    id: "healthcare-pro",
    name: "Healthcare Pro",
    description: "Clean and professional for medical and healthcare careers",
    category: "Healthcare",
    isPro: false,
    isPopular: false,
    colors: { primary: "bg-primary", secondary: "bg-primary/15", accent: "bg-primary/80" },
  },
  {
    id: "clinical-precision",
    name: "Clinical Precision",
    description: "Medical-themed design for healthcare professionals",
    category: "Healthcare",
    isPro: false,
    isPopular: false,
    colors: { primary: "bg-primary", secondary: "bg-primary/20", accent: "bg-primary/85" },
  },
  // New templates
  {
    id: "government-service",
    name: "Government Service",
    description: "Structured formal layout for government and public sector roles",
    category: "Corporate",
    isPro: false,
    isPopular: false,
    colors: { primary: "bg-primary", secondary: "bg-primary/10", accent: "bg-primary/70" },
  },
  {
    id: "legal-professional",
    name: "Legal Professional",
    description: "Traditional serif design for legal and compliance positions",
    category: "Corporate",
    isPro: false,
    isPopular: true,
    colors: { primary: "bg-primary", secondary: "bg-primary/15", accent: "bg-primary/80" },
  },
  {
    id: "marketing-creative",
    name: "Marketing Creative",
    description: "Dynamic sidebar layout for marketing and brand roles",
    category: "Creative",
    isPro: false,
    isPopular: true,
    colors: { primary: "bg-primary/90", secondary: "bg-primary/20", accent: "bg-primary" },
  },
  {
    id: "engineering-blueprint",
    name: "Engineering Blueprint",
    description: "Technical monospace layout for engineering professionals",
    category: "Tech",
    isPro: false,
    isPopular: false,
    colors: { primary: "bg-primary/80", secondary: "bg-primary/15", accent: "bg-primary" },
  },
  {
    id: "finance-analyst",
    name: "Finance Analyst",
    description: "Clean data-focused design for finance and analytics roles",
    category: "Corporate",
    isPro: false,
    isPopular: true,
    colors: { primary: "bg-primary", secondary: "bg-primary/10", accent: "bg-primary/75" },
  },
  {
    id: "consulting-elite",
    name: "Consulting Elite",
    description: "Premium serif design for management consulting professionals",
    category: "Executive",
    isPro: false,
    isPopular: true,
    colors: { primary: "bg-primary", secondary: "bg-primary/10", accent: "bg-primary/85" },
  },
  {
    id: "education-professional",
    name: "Education Professional",
    description: "Teaching-focused layout for educators and academic staff",
    category: "Academic",
    isPro: false,
    isPopular: false,
    colors: { primary: "bg-primary", secondary: "bg-primary/15", accent: "bg-primary/70" },
  },
];

const categories: (TemplateCategory | "All")[] = ["All", "Creative", "Corporate", "Executive", "Tech", "Academic", "Healthcare"];

const sampleFormData: CVFormData = {
  firstName: "Alexandra",
  lastName: "Mitchell",
  email: "alexandra.mitchell@email.com",
  phone: "+1 (555) 234-5678",
  location: "San Francisco, CA",
  linkedin: "linkedin.com/in/alexandra-mitchell",
  portfolio: "alexandramitchell.dev",
  summary:
    "Results-driven professional with 8+ years of experience delivering high-impact solutions in dynamic environments. Proven track record of leading cross-functional teams, driving strategic initiatives, and exceeding performance targets. Adept at translating complex requirements into actionable plans with measurable outcomes.",
  education: [
    {
      id: "1",
      institution: "Stanford University",
      degree: "Master of Science",
      field: "Computer Science",
      startDate: "2014-09",
      endDate: "2016-06",
    },
    {
      id: "2",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      field: "Information Systems",
      startDate: "2010-09",
      endDate: "2014-05",
    },
  ],
  experience: [
    {
      id: "1",
      company: "TechCorp Global",
      position: "Senior Product Manager",
      location: "San Francisco, CA",
      startDate: "2020-03",
      endDate: "",
      description:
        "Led product strategy for a $50M SaaS platform, driving 40% YoY growth. Managed a team of 12 engineers and designers. Launched 3 major product lines that collectively acquired 10,000+ new customers within 6 months.",
    },
    {
      id: "2",
      company: "InnovateTech Inc.",
      position: "Product Manager",
      location: "New York, NY",
      startDate: "2017-06",
      endDate: "2020-02",
      description:
        "Spearheaded agile transformation across 4 development teams, reducing time-to-market by 35%. Collaborated with stakeholders to define roadmap priorities and OKRs. Delivered 15 product features on schedule within 2.5 years.",
    },
    {
      id: "3",
      company: "StartupXYZ",
      position: "Associate Product Manager",
      location: "Austin, TX",
      startDate: "2016-07",
      endDate: "2017-05",
      description:
        "Conducted user research and competitive analysis to inform product decisions. Authored detailed PRDs and user stories for engineering teams.",
    },
  ],
  projects: [
    {
      id: "1",
      name: "AI-Powered Analytics Dashboard",
      description:
        "Built an end-to-end analytics dashboard leveraging machine learning to provide real-time business insights, adopted by 500+ enterprise clients.",
      technologies: "React, Python, TensorFlow, PostgreSQL",
      link: "github.com/amitchell/analytics-dashboard",
    },
    {
      id: "2",
      name: "Mobile Commerce Platform",
      description:
        "Designed and launched a mobile-first e-commerce platform processing $2M+ in monthly transactions.",
      technologies: "React Native, Node.js, Stripe API",
      link: "github.com/amitchell/mobile-commerce",
    },
  ],
  skills:
    "Product Strategy, Agile/Scrum, Data Analysis, SQL, Python, React, Stakeholder Management, UX Research, A/B Testing, Roadmap Planning, OKRs, Jira, Figma, Tableau",
};

// Unique layout configurations for each template
const getTemplateLayout = (templateId: string) => {
  const layouts: Record<string, React.ReactNode> = {
    // Creative - Modern Minimal: Clean single column with lots of whitespace
    "modern-minimal": (
      <div className="h-full flex flex-col p-4">
        <div className="text-center mb-4">
          <div className="h-3 bg-foreground/80 rounded w-1/2 mx-auto mb-1" />
          <div className="h-1.5 bg-muted rounded w-1/3 mx-auto" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="h-1 bg-foreground/20 rounded w-full" />
          <div className="space-y-1">
            <div className="h-1 bg-muted rounded w-full" />
            <div className="h-1 bg-muted rounded w-4/5" />
          </div>
          <div className="h-1 bg-foreground/20 rounded w-full mt-4" />
          <div className="space-y-1">
            <div className="h-1 bg-muted rounded w-full" />
            <div className="h-1 bg-muted rounded w-3/4" />
          </div>
        </div>
      </div>
    ),
    // Creative Bold: Asymmetric with bold header block
    "creative-bold": (
      <div className="h-full flex flex-col">
        <div className="bg-foreground/90 p-3 mb-3">
          <div className="h-3 bg-background rounded w-2/3 mb-1" />
          <div className="h-1.5 bg-background/60 rounded w-1/2" />
        </div>
        <div className="flex-1 px-3 space-y-3">
          <div className="flex gap-2">
            <div className="w-1 bg-foreground/80 rounded" />
            <div className="flex-1 space-y-1">
              <div className="h-2 bg-foreground/30 rounded w-1/3" />
              <div className="h-1 bg-muted rounded w-full" />
              <div className="h-1 bg-muted rounded w-5/6" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-1 bg-foreground/80 rounded" />
            <div className="flex-1 space-y-1">
              <div className="h-2 bg-foreground/30 rounded w-1/4" />
              <div className="h-1 bg-muted rounded w-full" />
            </div>
          </div>
        </div>
      </div>
    ),
    // Startup Dynamic: Cards/blocks layout
    "startup-dynamic": (
      <div className="h-full p-3 space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-foreground/80" />
          <div className="flex-1">
            <div className="h-2.5 bg-foreground/70 rounded w-1/2 mb-1" />
            <div className="h-1.5 bg-muted rounded w-2/3" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-muted/50 rounded p-2 space-y-1">
            <div className="h-1.5 bg-foreground/30 rounded w-1/2" />
            <div className="h-1 bg-muted rounded w-full" />
          </div>
          <div className="bg-muted/50 rounded p-2 space-y-1">
            <div className="h-1.5 bg-foreground/30 rounded w-1/2" />
            <div className="h-1 bg-muted rounded w-full" />
          </div>
        </div>
        <div className="bg-muted/30 rounded p-2 space-y-1">
          <div className="h-1.5 bg-foreground/30 rounded w-1/4" />
          <div className="h-1 bg-muted rounded w-full" />
          <div className="h-1 bg-muted rounded w-4/5" />
        </div>
      </div>
    ),
    // Bold Impact: High contrast with strong visual hierarchy
    "bold-impact": (
      <div className="h-full flex flex-col">
        <div className="bg-foreground p-4 text-center">
          <div className="h-4 bg-background rounded w-3/4 mx-auto mb-1" />
          <div className="h-2 bg-background/50 rounded w-1/2 mx-auto" />
        </div>
        <div className="flex-1 p-3 space-y-3">
          <div className="border-l-4 border-foreground pl-2 space-y-1">
            <div className="h-2 bg-foreground/40 rounded w-1/3" />
            <div className="h-1 bg-muted rounded w-full" />
          </div>
          <div className="border-l-4 border-foreground pl-2 space-y-1">
            <div className="h-2 bg-foreground/40 rounded w-1/4" />
            <div className="h-1 bg-muted rounded w-full" />
          </div>
        </div>
      </div>
    ),
    // Swiss Design: Grid-based with strict alignment
    "swiss-design": (
      <div className="h-full p-3 grid grid-cols-3 gap-2">
        <div className="col-span-3 mb-2">
          <div className="h-4 bg-foreground rounded w-1/2 mb-1" />
          <div className="h-1 bg-foreground/30 rounded w-full" />
        </div>
        <div className="col-span-1 space-y-1">
          <div className="h-1.5 bg-foreground/50 rounded" />
          <div className="h-1 bg-muted rounded" />
          <div className="h-1 bg-muted rounded" />
        </div>
        <div className="col-span-2 space-y-1">
          <div className="h-1.5 bg-foreground/50 rounded w-1/3" />
          <div className="h-1 bg-muted rounded w-full" />
          <div className="h-1 bg-muted rounded w-5/6" />
          <div className="h-1 bg-muted rounded w-4/5" />
        </div>
      </div>
    ),
    // Professional Classic: Two-column traditional
    "professional-classic": (
      <div className="h-full flex">
        <div className="w-1/3 bg-muted/30 p-2 space-y-3">
          <div className="w-8 h-8 rounded-full bg-foreground/20 mx-auto" />
          <div className="space-y-1">
            <div className="h-1.5 bg-foreground/30 rounded w-full" />
            <div className="h-1 bg-muted rounded w-full" />
            <div className="h-1 bg-muted rounded w-3/4" />
          </div>
          <div className="space-y-1">
            <div className="h-1.5 bg-foreground/30 rounded w-full" />
            <div className="h-1 bg-muted rounded w-full" />
          </div>
        </div>
        <div className="flex-1 p-2 space-y-2">
          <div className="h-2.5 bg-foreground/70 rounded w-2/3 mb-2" />
          <div className="space-y-1">
            <div className="h-1.5 bg-foreground/30 rounded w-1/3" />
            <div className="h-1 bg-muted rounded w-full" />
            <div className="h-1 bg-muted rounded w-5/6" />
          </div>
          <div className="space-y-1">
            <div className="h-1.5 bg-foreground/30 rounded w-1/4" />
            <div className="h-1 bg-muted rounded w-full" />
          </div>
        </div>
      </div>
    ),
    // Corporate Formal: Serif-style with underlines
    "corporate-formal": (
      <div className="h-full p-3 space-y-3">
        <div className="text-center border-b border-foreground/30 pb-2">
          <div className="h-3.5 bg-foreground/80 rounded w-1/2 mx-auto mb-1" />
          <div className="h-1.5 bg-muted rounded w-1/3 mx-auto" />
        </div>
        <div className="space-y-2">
          <div className="border-b border-foreground/20 pb-1">
            <div className="h-2 bg-foreground/40 rounded w-1/4 mb-1" />
          </div>
          <div className="space-y-1 pl-2">
            <div className="h-1 bg-muted rounded w-full" />
            <div className="h-1 bg-muted rounded w-5/6" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="border-b border-foreground/20 pb-1">
            <div className="h-2 bg-foreground/40 rounded w-1/3 mb-1" />
          </div>
          <div className="space-y-1 pl-2">
            <div className="h-1 bg-muted rounded w-full" />
          </div>
        </div>
      </div>
    ),
    // Clean Grid: Organized boxes
    "clean-grid": (
      <div className="h-full p-2 space-y-2">
        <div className="bg-foreground/10 rounded p-2 flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-foreground/30" />
          <div className="flex-1">
            <div className="h-2 bg-foreground/60 rounded w-1/2 mb-0.5" />
            <div className="h-1 bg-muted rounded w-2/3" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <div className="bg-muted/40 rounded p-1.5 space-y-0.5">
            <div className="h-1.5 bg-foreground/30 rounded w-1/2" />
            <div className="h-1 bg-muted rounded w-full" />
          </div>
          <div className="bg-muted/40 rounded p-1.5 space-y-0.5">
            <div className="h-1.5 bg-foreground/30 rounded w-1/2" />
            <div className="h-1 bg-muted rounded w-full" />
          </div>
          <div className="col-span-2 bg-muted/40 rounded p-1.5 space-y-0.5">
            <div className="h-1.5 bg-foreground/30 rounded w-1/4" />
            <div className="h-1 bg-muted rounded w-full" />
            <div className="h-1 bg-muted rounded w-4/5" />
          </div>
        </div>
      </div>
    ),
    // Executive Elite: Sophisticated with gold accents feel
    "executive-elite": (
      <div className="h-full flex flex-col">
        <div className="border-b-2 border-foreground p-3">
          <div className="h-3.5 bg-foreground rounded w-2/3 mb-1" />
          <div className="h-1.5 bg-foreground/40 rounded w-1/2" />
        </div>
        <div className="flex-1 p-3 space-y-3">
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-foreground mt-1" />
            <div className="flex-1 space-y-1">
              <div className="h-1.5 bg-foreground/30 rounded w-1/3" />
              <div className="h-1 bg-muted rounded w-full" />
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-foreground mt-1" />
            <div className="flex-1 space-y-1">
              <div className="h-1.5 bg-foreground/30 rounded w-1/4" />
              <div className="h-1 bg-muted rounded w-full" />
            </div>
          </div>
        </div>
      </div>
    ),
    // Leadership Suite: Premium with subtle sections
    "leadership-suite": (
      <div className="h-full p-3">
        <div className="flex items-center gap-3 mb-3 pb-2 border-b border-foreground/20">
          <div className="w-10 h-10 rounded-full border-2 border-foreground/50" />
          <div>
            <div className="h-3 bg-foreground/80 rounded w-24 mb-1" />
            <div className="h-1.5 bg-foreground/30 rounded w-16" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="bg-muted/20 rounded p-2 space-y-1">
            <div className="h-1.5 bg-foreground/40 rounded w-1/3" />
            <div className="h-1 bg-muted rounded w-full" />
            <div className="h-1 bg-muted rounded w-3/4" />
          </div>
          <div className="bg-muted/20 rounded p-2 space-y-1">
            <div className="h-1.5 bg-foreground/40 rounded w-1/4" />
            <div className="h-1 bg-muted rounded w-full" />
          </div>
        </div>
      </div>
    ),
    // Minimalist Pro: Ultra clean
    "minimalist-pro": (
      <div className="h-full p-4 flex flex-col justify-center">
        <div className="mb-6">
          <div className="h-4 bg-foreground rounded w-1/3 mb-2" />
          <div className="h-px bg-foreground/30 w-full" />
        </div>
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="h-1 bg-muted rounded w-full" />
            <div className="h-1 bg-muted rounded w-5/6" />
          </div>
          <div className="space-y-1">
            <div className="h-1 bg-muted rounded w-full" />
            <div className="h-1 bg-muted rounded w-4/5" />
          </div>
        </div>
      </div>
    ),
    // Tech Focused: Code-like with monospace feel
    "tech-focused": (
      <div className="h-full p-2 font-mono">
        <div className="bg-foreground/10 rounded p-2 mb-2 space-y-1">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-foreground/50" />
            <div className="h-2 bg-foreground/60 rounded w-1/2" />
          </div>
          <div className="h-1 bg-foreground/20 rounded w-3/4 ml-3" />
        </div>
        <div className="space-y-2 pl-1">
          <div className="flex items-center gap-1">
            <div className="h-1.5 bg-foreground/40 rounded w-2" />
            <div className="h-1.5 bg-foreground/30 rounded w-1/4" />
          </div>
          <div className="h-1 bg-muted rounded w-full ml-3" />
          <div className="h-1 bg-muted rounded w-5/6 ml-3" />
          <div className="flex items-center gap-1 mt-2">
            <div className="h-1.5 bg-foreground/40 rounded w-2" />
            <div className="h-1.5 bg-foreground/30 rounded w-1/3" />
          </div>
          <div className="h-1 bg-muted rounded w-full ml-3" />
        </div>
      </div>
    ),
    // Data Driven: Developer style with stats
    "data-driven": (
      <div className="h-full p-2 space-y-2">
        <div className="flex items-center justify-between pb-2 border-b border-foreground/20">
          <div className="h-2.5 bg-foreground/70 rounded w-1/3" />
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded bg-muted/50" />
            <div className="w-4 h-4 rounded bg-muted/50" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1">
          <div className="bg-foreground/10 rounded p-1 text-center">
            <div className="h-3 bg-foreground/50 rounded w-1/2 mx-auto mb-0.5" />
            <div className="h-1 bg-muted rounded w-3/4 mx-auto" />
          </div>
          <div className="bg-foreground/10 rounded p-1 text-center">
            <div className="h-3 bg-foreground/50 rounded w-1/2 mx-auto mb-0.5" />
            <div className="h-1 bg-muted rounded w-3/4 mx-auto" />
          </div>
          <div className="bg-foreground/10 rounded p-1 text-center">
            <div className="h-3 bg-foreground/50 rounded w-1/2 mx-auto mb-0.5" />
            <div className="h-1 bg-muted rounded w-3/4 mx-auto" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="h-1.5 bg-foreground/30 rounded w-1/4" />
          <div className="h-1 bg-muted rounded w-full" />
          <div className="h-1 bg-muted rounded w-4/5" />
        </div>
      </div>
    ),
    // Academic Scholar: Paper-like with citations style
    "academic-scholar": (
      <div className="h-full p-3 space-y-2">
        <div className="text-center mb-3">
          <div className="h-2.5 bg-foreground/70 rounded w-2/3 mx-auto mb-1" />
          <div className="h-1 bg-muted rounded w-1/2 mx-auto" />
          <div className="h-1 bg-muted rounded w-1/3 mx-auto mt-1" />
        </div>
        <div className="space-y-1 text-justify">
          <div className="h-1.5 bg-foreground/30 rounded w-1/4" />
          <div className="h-1 bg-muted rounded w-full" />
          <div className="h-1 bg-muted rounded w-full" />
          <div className="h-1 bg-muted rounded w-5/6" />
        </div>
        <div className="space-y-1">
          <div className="h-1.5 bg-foreground/30 rounded w-1/3" />
          <div className="h-1 bg-muted rounded w-full" />
          <div className="h-1 bg-muted rounded w-full" />
        </div>
      </div>
    ),
    // Research Paper: Journal article style
    "research-paper": (
      <div className="h-full p-2">
        <div className="border border-foreground/20 p-2 mb-2">
          <div className="h-2.5 bg-foreground/60 rounded w-3/4 mx-auto mb-1" />
          <div className="h-1 bg-muted rounded w-1/2 mx-auto" />
        </div>
        <div className="columns-2 gap-2 space-y-1">
          <div className="h-1 bg-muted rounded w-full" />
          <div className="h-1 bg-muted rounded w-full" />
          <div className="h-1 bg-muted rounded w-4/5" />
          <div className="h-1.5 bg-foreground/30 rounded w-1/2 mt-2" />
          <div className="h-1 bg-muted rounded w-full" />
          <div className="h-1 bg-muted rounded w-full" />
          <div className="h-1 bg-muted rounded w-3/4" />
        </div>
      </div>
    ),
    // Healthcare Pro: Clean medical style
    "healthcare-pro": (
      <div className="h-full p-3">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-foreground/20">
          <div className="w-8 h-8 rounded-full bg-foreground/20 flex items-center justify-center">
            <div className="w-4 h-4 rounded-sm bg-foreground/40" />
          </div>
          <div>
            <div className="h-2.5 bg-foreground/70 rounded w-20 mb-0.5" />
            <div className="h-1.5 bg-foreground/30 rounded w-14" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 rounded bg-muted/50 shrink-0" />
            <div className="flex-1 space-y-1">
              <div className="h-1.5 bg-foreground/30 rounded w-1/2" />
              <div className="h-1 bg-muted rounded w-full" />
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 rounded bg-muted/50 shrink-0" />
            <div className="flex-1 space-y-1">
              <div className="h-1.5 bg-foreground/30 rounded w-1/3" />
              <div className="h-1 bg-muted rounded w-full" />
            </div>
          </div>
        </div>
      </div>
    ),
    // Clinical Precision: Structured medical
    "clinical-precision": (
      <div className="h-full p-2 space-y-2">
        <div className="bg-foreground/10 rounded p-2 flex justify-between items-center">
          <div className="h-2.5 bg-foreground/60 rounded w-1/3" />
          <div className="h-2 bg-foreground/30 rounded w-1/4" />
        </div>
        <div className="border-l-2 border-foreground/40 pl-2 space-y-2">
          <div className="space-y-1">
            <div className="flex justify-between">
              <div className="h-1.5 bg-foreground/40 rounded w-1/3" />
              <div className="h-1.5 bg-muted rounded w-1/4" />
            </div>
            <div className="h-1 bg-muted rounded w-full" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <div className="h-1.5 bg-foreground/40 rounded w-1/4" />
              <div className="h-1.5 bg-muted rounded w-1/4" />
            </div>
            <div className="h-1 bg-muted rounded w-full" />
          </div>
        </div>
      </div>
    ),
    // Government Service: Formal centered with uppercase headers
    "government-service": (
      <div className="h-full p-3 space-y-2">
        <div className="text-center border-b-2 border-foreground pb-2 mb-2">
          <div className="h-3 bg-foreground/80 rounded w-2/3 mx-auto mb-1" />
          <div className="h-1.5 bg-muted rounded w-1/3 mx-auto" />
        </div>
        <div className="space-y-2">
          <div className="border-b border-foreground/30 pb-0.5">
            <div className="h-1.5 bg-foreground/40 rounded w-1/3 mb-0.5" />
          </div>
          <div className="space-y-1 pl-3">
            <div className="h-1 bg-muted rounded w-full" />
            <div className="h-1 bg-muted rounded w-5/6" />
          </div>
          <div className="border-b border-foreground/30 pb-0.5">
            <div className="h-1.5 bg-foreground/40 rounded w-1/4 mb-0.5" />
          </div>
          <div className="space-y-1 pl-3">
            <div className="h-1 bg-muted rounded w-full" />
            <div className="h-1 bg-muted rounded w-4/5" />
          </div>
        </div>
      </div>
    ),
    // Legal Professional: Double-rule header with serif feel
    "legal-professional": (
      <div className="h-full p-3 space-y-2">
        <div className="mb-2">
          <div className="h-3.5 bg-foreground/80 rounded w-1/2 mb-1" />
          <div className="h-px bg-foreground w-full mb-0.5" />
          <div className="h-1 bg-muted rounded w-2/3" />
          <div className="h-0.5 bg-foreground w-full mt-1" />
        </div>
        <div className="space-y-1">
          <div className="h-1.5 bg-foreground/30 rounded w-1/3" />
          <div className="h-1 bg-muted rounded w-full" />
          <div className="h-1 bg-muted rounded w-5/6" />
        </div>
        <div className="space-y-1">
          <div className="h-1.5 bg-foreground/30 rounded w-1/4" />
          <div className="h-1 bg-muted rounded w-full" />
        </div>
      </div>
    ),
    // Marketing Creative: Sidebar layout
    "marketing-creative": (
      <div className="h-full flex">
        <div className="w-[35%] bg-muted/40 p-2 space-y-2">
          <div>
            <div className="h-3 bg-foreground/80 rounded w-full mb-0.5" />
            <div className="h-2.5 bg-foreground/60 rounded w-3/4" />
          </div>
          <div className="w-6 h-0.5 bg-foreground" />
          <div className="space-y-1">
            <div className="h-1 bg-muted rounded w-full" />
            <div className="h-1 bg-muted rounded w-3/4" />
          </div>
          <div className="space-y-1">
            <div className="h-1.5 bg-foreground/30 rounded w-1/2" />
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-foreground rounded-full" />
              <div className="h-1 bg-muted rounded w-3/4" />
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-foreground rounded-full" />
              <div className="h-1 bg-muted rounded w-2/3" />
            </div>
          </div>
        </div>
        <div className="flex-1 p-2 space-y-2">
          <div className="space-y-1">
            <div className="h-1.5 bg-foreground/40 rounded w-1/4" />
            <div className="h-1 bg-muted rounded w-full" />
            <div className="h-1 bg-muted rounded w-4/5" />
          </div>
          <div className="border-l-2 border-foreground pl-2 space-y-1">
            <div className="h-1.5 bg-foreground/30 rounded w-1/3" />
            <div className="h-1 bg-muted rounded w-full" />
          </div>
        </div>
      </div>
    ),
    // Engineering Blueprint: Monospace boxed header
    "engineering-blueprint": (
      <div className="h-full p-2 font-mono space-y-2">
        <div className="border-2 border-foreground p-2 flex justify-between items-start">
          <div className="h-2.5 bg-foreground/70 rounded w-1/2" />
          <div className="space-y-0.5 text-right">
            <div className="h-1 bg-muted rounded w-12" />
            <div className="h-1 bg-muted rounded w-10" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="h-1.5 bg-foreground/40 rounded w-1/3" />
          <div className="border-l-2 border-foreground/40 pl-2 space-y-1">
            <div className="flex items-center gap-1">
              <div className="h-1 bg-foreground/20 rounded w-3" />
              <div className="h-1 bg-muted rounded w-full" />
            </div>
            <div className="h-1 bg-muted rounded w-5/6" />
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          <div className="px-1.5 py-0.5 border border-foreground/30">
            <div className="h-1 bg-muted rounded w-6" />
          </div>
          <div className="px-1.5 py-0.5 border border-foreground/30">
            <div className="h-1 bg-muted rounded w-8" />
          </div>
          <div className="px-1.5 py-0.5 border border-foreground/30">
            <div className="h-1 bg-muted rounded w-5" />
          </div>
        </div>
      </div>
    ),
    // Finance Analyst: Clean with thick section dividers
    "finance-analyst": (
      <div className="h-full p-3 space-y-2">
        <div className="mb-2">
          <div className="h-3 bg-foreground/80 rounded w-1/2 mb-1" />
          <div className="h-px bg-foreground/30 w-full mb-1" />
          <div className="h-1 bg-muted rounded w-2/3" />
        </div>
        <div className="space-y-1">
          <div className="h-1.5 bg-foreground/50 rounded w-1/4 border-b-2 border-foreground" />
          <div className="h-1 bg-muted rounded w-full" />
          <div className="h-1 bg-muted rounded w-5/6" />
        </div>
        <div className="flex gap-3">
          <div className="flex-1 space-y-1">
            <div className="h-1.5 bg-foreground/50 rounded w-1/2 border-b-2 border-foreground" />
            <div className="h-1 bg-muted rounded w-full" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="h-1.5 bg-foreground/50 rounded w-2/3 border-b-2 border-foreground" />
            <div className="grid grid-cols-2 gap-0.5">
              <div className="h-1 bg-muted rounded" />
              <div className="h-1 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    ),
    // Consulting Elite: Centered elegant headers
    "consulting-elite": (
      <div className="h-full p-3 space-y-2">
        <div className="text-center mb-2">
          <div className="h-3 bg-foreground/70 rounded w-1/2 mx-auto mb-1" />
          <div className="flex justify-center items-center gap-1">
            <div className="h-px bg-foreground/30 w-8" />
            <div className="w-1 h-1 rounded-full bg-foreground" />
            <div className="h-px bg-foreground/30 w-8" />
          </div>
        </div>
        <div className="text-center">
          <div className="h-1.5 bg-foreground/30 rounded w-1/3 mx-auto mb-1" />
          <div className="h-px bg-foreground/20 w-full mb-1" />
          <div className="h-1 bg-muted rounded w-3/4 mx-auto italic" />
        </div>
        <div className="text-center">
          <div className="h-1.5 bg-foreground/30 rounded w-1/4 mx-auto mb-1" />
          <div className="h-px bg-foreground/20 w-full mb-1" />
          <div className="h-1 bg-muted rounded w-full" />
          <div className="h-1 bg-muted rounded w-5/6 mx-auto" />
        </div>
      </div>
    ),
    // Education Professional: Bold header with thick bar
    "education-professional": (
      <div className="h-full p-3 space-y-2">
        <div className="mb-2">
          <div className="h-3 bg-foreground/80 rounded w-2/3 mb-1" />
          <div className="h-1 bg-muted rounded w-1/2" />
          <div className="h-1.5 bg-foreground w-full mt-1" />
        </div>
        <div className="space-y-1">
          <div className="h-1.5 bg-foreground/40 rounded w-1/3 border-b border-foreground pb-0.5" />
          <div className="h-1 bg-muted rounded w-full" />
          <div className="h-1 bg-muted rounded w-3/4" />
        </div>
        <div className="space-y-1">
          <div className="h-1.5 bg-foreground/40 rounded w-2/5 border-b border-foreground pb-0.5" />
          <div className="h-1 bg-muted rounded w-full" />
          <div className="h-1 bg-muted rounded w-5/6" />
        </div>
        <div className="flex flex-wrap gap-1">
          <div className="px-1.5 py-0.5 bg-muted/40 border border-foreground/20 rounded">
            <div className="h-1 bg-muted rounded w-6" />
          </div>
          <div className="px-1.5 py-0.5 bg-muted/40 border border-foreground/20 rounded">
            <div className="h-1 bg-muted rounded w-8" />
          </div>
        </div>
      </div>
    ),
  };

  return layouts[templateId] || layouts["modern-minimal"];
};

// Template Preview Dialog
const TemplatePreviewDialog = ({
  template,
  open,
  onClose,
}: {
  template: Template | null;
  open: boolean;
  onClose: () => void;
}) => {
  if (!template) return null;
  const TemplateComponent = templateComponents[template.id as keyof typeof templateComponents];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-5xl w-full h-[90vh] p-0 flex flex-col overflow-hidden gap-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-foreground">{template.name}</h2>
            <Badge variant="outline" className="text-xs">{template.category}</Badge>
            {template.isPopular && (
              <Badge variant="secondary" className="text-xs flex items-center gap-1">
                <Star className="h-3 w-3 fill-current" /> Popular
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" asChild className="gap-1.5 font-mono text-xs uppercase tracking-wider">
              <Link to={`/builder?template=${template.id}`} onClick={onClose}>
                Use Template <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button size="icon" variant="ghost" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </div>

        {/* Preview area — scrollable */}
        <div className="flex-1 overflow-y-auto bg-muted/30 flex justify-center py-8 px-4">
          <div
            className="bg-white shadow-2xl rounded-sm"
            style={{
              width: "210mm",
              minHeight: "297mm",
              transformOrigin: "top center",
            }}
          >
            {TemplateComponent ? (
              <TemplateComponent formData={sampleFormData} />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Preview not available
              </div>
            )}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-6 py-4 border-t border-border bg-background shrink-0 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Previewed with sample data · Your content will replace this
          </p>
          <Button asChild className="gap-1.5 font-mono text-xs uppercase tracking-wider">
            <Link to={`/builder?template=${template.id}`} onClick={onClose}>
              <Check className="h-4 w-4" /> Use This Template
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const TemplateCard = ({
  template,
  onPreview,
}: {
  template: Template;
  onPreview: (template: Template) => void;
}) => {
  return (
    <Card className="group overflow-hidden border-border hover:border-accent transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-0">
        {/* Template Preview */}
        <div className="relative aspect-[3/4] bg-secondary p-4 overflow-hidden">
          {/* CV Mockup */}
          <div className="absolute inset-4 bg-card rounded-lg shadow-md overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-300">
            {getTemplateLayout(template.id)}
          </div>

          {/* Badges */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {template.isPopular && (
              <Badge variant="secondary" className="text-xs flex items-center gap-1">
                <Star className="h-3 w-3 fill-current" /> Popular
              </Badge>
            )}
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <Button
              size="sm"
              variant="secondary"
              className="gap-1"
              onClick={() => onPreview(template)}
            >
              <Eye className="h-4 w-4" /> Preview
            </Button>
            <Button size="sm" asChild className="gap-1 bg-accent hover:bg-accent/90">
              <Link to={`/builder?template=${template.id}`}>
                <Check className="h-4 w-4" /> Use
              </Link>
            </Button>
          </div>
        </div>

        {/* Template Info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-foreground">{template.name}</h3>
            <Badge variant="outline" className="text-xs shrink-0">
              {template.category}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{template.description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const Templates = () => {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | "All">("All");
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const filteredTemplates = selectedCategory === "All" 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <TemplatePreviewDialog
        template={previewTemplate}
        open={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
      />
      
      {/* Hero Section */}
      <section className="pt-28 pb-10 gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 border border-border px-4 py-2 rounded-full">
              Templates
            </span>
            <h1 className="text-3xl sm:text-4xl font-medium text-foreground mb-4 mt-4 tracking-tight animate-fade-in">
              Professional CV Templates
            </h1>
            <p className="text-base text-muted-foreground animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Choose from our collection of {templates.length} ATS-optimized templates designed to help you land your dream job
            </p>
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                className="rounded-full font-mono text-xs uppercase tracking-wider"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} onPreview={setPreviewTemplate} />
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <div className="inline-block bg-card rounded-xl border border-border/50 p-8 max-w-2xl">
              <h2 className="text-xl font-medium text-foreground mb-2 tracking-tight">
                Can't find what you're looking for?
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Our AI can generate a custom template tailored to your industry and preferences.
              </p>
              <Button size="default" asChild className="font-mono text-xs uppercase tracking-wider">
                <Link to="/builder">Create Custom Template</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Templates;
