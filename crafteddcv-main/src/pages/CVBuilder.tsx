import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, ArrowLeft, ArrowRight, User, GraduationCap, Briefcase, FolderOpen, Wrench, Sparkles, Loader2, Download, Eye, FileText, Lightbulb, CheckCircle2, Circle, Upload, AlignLeft, Save, Target } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAIGeneration } from "@/hooks/useAIGeneration";
import { useCareerAI } from "@/hooks/useCareerAI";
import { usePDFExport } from "@/hooks/usePDFExport";
import { useATSAnalysis } from "@/hooks/useATSAnalysis";
import ATSScoreCard from "@/components/ATSScoreCard";
import CareerStudioDialog from "@/components/CareerStudioDialog";
import { templateComponents, templateNames, TemplateId, CVFormData, Education, Experience, Project, coverPageComponents } from "@/components/cv-templates";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CVImportDialog } from "@/components/CVImportDialog";
import { useCVDrafts } from "@/hooks/useCVDrafts";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
const steps = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Education", icon: GraduationCap },
  { id: 3, title: "Experience", icon: Briefcase },
  { id: 4, title: "Projects", icon: FolderOpen },
  { id: 5, title: "Skills", icon: Wrench },
  { id: 6, title: "Summary", icon: AlignLeft },
];

const builderTips: Record<number, string[]> = {
  1: [
    "Use a professional email address",
    "Include your LinkedIn profile for more visibility",
    "Keep your location concise (City, State)",
  ],
  2: [
    "List education in reverse chronological order",
    "Include GPA if it's 3.5 or higher",
    "Add relevant coursework for entry-level roles",
  ],
  3: [
    "Use action verbs to start each bullet point",
    "Quantify achievements with numbers when possible",
    "Focus on accomplishments, not just duties",
  ],
  4: [
    "Include live links to your projects",
    "Highlight technologies that match the job",
    "Describe the impact or purpose of each project",
  ],
  5: [
    "Match skills to job descriptions",
    "Include both technical and soft skills",
    "Prioritize most relevant skills first",
  ],
  6: [
    "Keep your summary under 3-4 sentences",
    "AI will personalize based on your complete profile",
    "Highlight your unique value proposition",
  ],
};

const CVBuilder = () => {
  const [searchParams] = useSearchParams();
  const templateParam = searchParams.get("template") as TemplateId | null;
  const draftIdParam = searchParams.get("draft");
  
  const { user } = useAuth();
  const { toast } = useToast();
  const { saveDraft, drafts } = useCVDrafts();
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(draftIdParam || null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [targetJobTitle, setTargetJobTitle] = useState("");
  const [includeCoverPage, setIncludeCoverPage] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>(templateParam || "modern-minimal");
  const [showTips, setShowTips] = useState(true);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showCareerStudio, setShowCareerStudio] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const { generateContent, isLoading, loadingType } = useAIGeneration();
  const { suggestSkills, loadingTool } = useCareerAI();
  const { exportToPDF, isExporting } = usePDFExport();
  const { analyzeCV, isAnalyzing, analysis, clearAnalysis } = useATSAnalysis();
  const [formData, setFormData] = useState<CVFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    portfolio: "",
    summary: "",
    education: [{ id: "1", institution: "", degree: "", field: "", startDate: "", endDate: "" }],
    experience: [],
    projects: [],
    skills: "",
  });

  useEffect(() => {
    if (templateParam && templateParam in templateComponents) {
      setSelectedTemplate(templateParam);
    }
  }, [templateParam]);

  // Load existing draft if draft ID is provided
  useEffect(() => {
    if (draftIdParam && drafts.length > 0) {
      const draft = drafts.find(d => d.id === draftIdParam);
      if (draft) {
        setFormData(draft.form_data);
        setSelectedTemplate(draft.template_id as TemplateId);
        setCurrentDraftId(draft.id);
      }
    }
  }, [draftIdParam, drafts]);

  const handleSaveDraft = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your CV draft",
        variant: "destructive",
      });
      return;
    }
    setIsSaving(true);
    const draftName = `${formData.firstName || "Untitled"} ${formData.lastName || "CV"}`.trim();
    const id = await saveDraft(draftName, selectedTemplate, formData, currentDraftId || undefined);
    if (id) setCurrentDraftId(id);
    setIsSaving(false);
  };

  // Calculate section completion status
  const sectionCompletion = useMemo(() => ({
    1: Boolean(formData.firstName && formData.lastName && formData.email),
    2: formData.education.some(e => e.institution && e.degree && e.field),
    3: formData.experience.length > 0 && formData.experience.some(e => e.company && e.position),
    4: formData.projects.length > 0 && formData.projects.some(p => p.name && p.description),
    5: Boolean(formData.skills.trim()),
    6: Boolean(formData.summary.trim()),
  }), [formData]);

  const completedSections = Object.values(sectionCompletion).filter(Boolean).length;
  const completionPercentage = Math.round((completedSections / 6) * 100);

  const updateFormData = (field: keyof CVFormData, value: CVFormData[keyof CVFormData]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImportCV = (importedData: CVFormData) => {
    setFormData(importedData);
    setCurrentStep(1); // Go to first step to review imported data
  };

  const addEducation = () => {
    updateFormData("education", [
      ...formData.education,
      { id: Date.now().toString(), institution: "", degree: "", field: "", startDate: "", endDate: "" },
    ]);
  };

  const removeEducation = (id: string) => {
    updateFormData("education", formData.education.filter((e) => e.id !== id));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    updateFormData(
      "education",
      formData.education.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const addExperience = () => {
    updateFormData("experience", [
      ...formData.experience,
      { id: Date.now().toString(), company: "", position: "", location: "", startDate: "", endDate: "", description: "" },
    ]);
  };

  const removeExperience = (id: string) => {
    updateFormData("experience", formData.experience.filter((e) => e.id !== id));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    updateFormData(
      "experience",
      formData.experience.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const addProject = () => {
    updateFormData("projects", [
      ...formData.projects,
      { id: Date.now().toString(), name: "", description: "", technologies: "", link: "" },
    ]);
  };

  const removeProject = (id: string) => {
    updateFormData("projects", formData.projects.filter((p) => p.id !== id));
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    updateFormData(
      "projects",
      formData.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const nextStep = () => {
    if (currentStep < steps.length) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    setShowPreview(true);
    clearAnalysis();
  };

  const handleAnalyzeATS = async () => {
    await analyzeCV(formData);
  };

  const handleExportPDF = async () => {
    const filename = `${formData.firstName || "My"}-${formData.lastName || "CV"}.pdf`;
    await exportToPDF("cv-preview", filename);
  };

  const handleGenerateSummary = async () => {
    const content = await generateContent("summary", {
      firstName: formData.firstName,
      lastName: formData.lastName,
      skills: formData.skills,
      experience: formData.experience,
      education: formData.education,
      projects: formData.projects,
      targetJobTitle: targetJobTitle || undefined,
    });
    if (content) {
      updateFormData("summary", content);
    }
  };

  const handleGenerateExperience = async (exp: Experience) => {
    const content = await generateContent("experience", {
      position: exp.position,
      company: exp.company,
      location: exp.location,
      description: exp.description,
    });
    if (content) {
      updateExperience(exp.id, "description", content);
    }
  };

  const handleGenerateProject = async (project: Project) => {
    const content = await generateContent("project", {
      name: project.name,
      technologies: project.technologies,
      description: project.description,
    });
    if (content) {
      updateProject(project.id, "description", content);
    }
  };

  const handleSuggestSkills = async () => {
    const skills = await suggestSkills(formData, jobDescription, targetJobTitle || undefined);
    if (skills) {
      const existing = new Set(
        formData.skills.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)
      );
      setSuggestedSkills(skills.filter((s) => !existing.has(s.trim().toLowerCase())));
    }
  };

  const addSuggestedSkill = (skill: string) => {
    const current = formData.skills.trim();
    updateFormData("skills", current ? `${current.replace(/,\s*$/, "")}, ${skill}` : skill);
    setSuggestedSkills((prev) => prev.filter((s) => s !== skill));
  };

  const handleApplyTailoredSummary = (summary: string) => {
    updateFormData("summary", summary);
  };

  const SelectedTemplateComponent = templateComponents[selectedTemplate];
  const SelectedCoverPageComponent = coverPageComponents[selectedTemplate];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          {/* Header with Completion Progress */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Build Your CV</h1>
            <p className="text-muted-foreground mb-4">Fill in your details and we'll create an ATS-optimized resume for you.</p>
            
            {/* Completion Progress Bar */}
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Completion</span>
                <span className="text-foreground font-medium">{completionPercentage}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-foreground transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Template Selector, Import & Tips Toggle */}
          <div className="mb-8 flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
            <Button
              onClick={() => setShowCareerStudio(true)}
              className="flex items-center gap-2 hover:shadow-glow-white"
            >
              <Sparkles className="h-4 w-4" />
              AI Career Studio
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowImportDialog(true)}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Import Existing CV
            </Button>
            
            <div className="flex items-center gap-2">
              <Label htmlFor="template-select" className="text-sm font-medium">
                Template:
              </Label>
              <Select value={selectedTemplate} onValueChange={(value) => setSelectedTemplate(value as TemplateId)}>
                <SelectTrigger id="template-select" className="w-[200px]">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(templateNames) as TemplateId[]).map((id) => (
                    <SelectItem key={id} value={id}>
                      {templateNames[id]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Switch
                id="show-tips"
                checked={showTips}
                onCheckedChange={setShowTips}
              />
              <Label htmlFor="show-tips" className="text-sm font-normal cursor-pointer flex items-center gap-1">
                <Lightbulb className="h-4 w-4" />
                Tips
              </Label>
            </div>
          </div>

          {/* Progress Steps with Completion Indicators */}
          <TooltipProvider>
            <div className="flex items-center justify-between mb-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setCurrentStep(step.id)}
                        className={`flex flex-col items-center gap-2 group transition-all relative ${
                          currentStep === step.id
                            ? "text-primary"
                            : sectionCompletion[step.id as keyof typeof sectionCompletion]
                            ? "text-primary/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        <div
                          className={`w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                            currentStep === step.id
                              ? "border-primary bg-primary text-primary-foreground"
                              : sectionCompletion[step.id as keyof typeof sectionCompletion]
                              ? "border-foreground/50 bg-foreground/10 text-foreground"
                              : "border-border bg-background text-muted-foreground group-hover:border-primary/50"
                          }`}
                        >
                          {sectionCompletion[step.id as keyof typeof sectionCompletion] && currentStep !== step.id ? (
                            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                          ) : (
                            <step.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                          )}
                        </div>
                        <span className="text-xs font-medium hidden sm:block">{step.title}</span>
                        {/* Completion dot indicator */}
                        {sectionCompletion[step.id as keyof typeof sectionCompletion] && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-foreground rounded-full border-2 border-background" />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{sectionCompletion[step.id as keyof typeof sectionCompletion] ? "Completed" : "Incomplete"}</p>
                    </TooltipContent>
                  </Tooltip>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 w-4 sm:w-16 lg:w-24 mx-1 sm:mx-2 transition-colors ${
                        sectionCompletion[step.id as keyof typeof sectionCompletion] ? "bg-foreground/50" : "bg-border"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </TooltipProvider>

          {/* Main Content Grid - Form + Tips */}
          <div className={`grid gap-6 ${showTips ? "lg:grid-cols-3" : "lg:grid-cols-1 max-w-4xl mx-auto"}`}>
            {/* Form Content */}
            <div className={`min-w-0 bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm ${showTips ? "lg:col-span-2" : ""}`}>
              {/* Step 1: Personal Info */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-semibold text-foreground mb-6">Personal Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => updateFormData("firstName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => updateFormData("lastName", e.target.value)}
                      />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="+1 234 567 890"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="New York, NY"
                    value={formData.location}
                    onChange={(e) => updateFormData("location", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input
                      id="linkedin"
                      placeholder="linkedin.com/in/johndoe"
                      value={formData.linkedin}
                      onChange={(e) => updateFormData("linkedin", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="portfolio">Portfolio URL</Label>
                    <Input
                      id="portfolio"
                      placeholder="johndoe.com"
                      value={formData.portfolio}
                      onChange={(e) => updateFormData("portfolio", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Education */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">Education</h2>
                  <Button variant="outline" size="sm" onClick={addEducation}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Education
                  </Button>
                </div>

                {formData.education.map((edu, index) => (
                  <div key={edu.id} className="p-6 border border-border rounded-xl space-y-4 bg-background">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-foreground">Education #{index + 1}</h3>
                      {formData.education.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEducation(edu.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Institution *</Label>
                      <Input
                        placeholder="University of Example"
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Degree *</Label>
                        <Input
                          placeholder="Bachelor's"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Field of Study *</Label>
                        <Input
                          placeholder="Computer Science"
                          value={edu.field}
                          onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          type="month"
                          value={edu.startDate}
                          onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          type="month"
                          value={edu.endDate}
                          onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 3: Experience */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Work Experience</h2>
                    <p className="text-sm text-muted-foreground">Optional - Add your work history</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={addExperience}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Experience
                  </Button>
                </div>

                {formData.experience.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                    <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No work experience added yet</p>
                    <Button variant="outline" onClick={addExperience}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Your First Experience
                    </Button>
                  </div>
                ) : (
                  formData.experience.map((exp, index) => (
                    <div key={exp.id} className="p-6 border border-border rounded-xl space-y-4 bg-background">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-foreground">Experience #{index + 1}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExperience(exp.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Company</Label>
                          <Input
                            placeholder="Company Name"
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Position</Label>
                          <Input
                            placeholder="Software Engineer"
                            value={exp.position}
                            onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          placeholder="San Francisco, CA"
                          value={exp.location}
                          onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Input
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Input
                            type="month"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Description</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleGenerateExperience(exp)}
                            disabled={isLoading || !exp.position || !exp.company}
                            className="text-primary hover:text-primary"
                          >
                            {isLoading && loadingType === "experience" ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <Sparkles className="h-4 w-4 mr-1" />
                            )}
                            AI Generate
                          </Button>
                        </div>
                        <Textarea
                          placeholder="Describe your responsibilities and achievements..."
                          rows={3}
                          value={exp.description}
                          onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Step 4: Projects */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Projects</h2>
                    <p className="text-sm text-muted-foreground">Optional - Showcase your work</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={addProject}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Project
                  </Button>
                </div>

                {formData.projects.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                    <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No projects added yet</p>
                    <Button variant="outline" onClick={addProject}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Your First Project
                    </Button>
                  </div>
                ) : (
                  formData.projects.map((project, index) => (
                    <div key={project.id} className="p-6 border border-border rounded-xl space-y-4 bg-background">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-foreground">Project #{index + 1}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProject(project.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label>Project Name</Label>
                        <Input
                          placeholder="My Awesome Project"
                          value={project.name}
                          onChange={(e) => updateProject(project.id, "name", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Description</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleGenerateProject(project)}
                            disabled={isLoading || !project.name}
                            className="text-primary hover:text-primary"
                          >
                            {isLoading && loadingType === "project" ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <Sparkles className="h-4 w-4 mr-1" />
                            )}
                            AI Generate
                          </Button>
                        </div>
                        <Textarea
                          placeholder="What does this project do?"
                          rows={3}
                          value={project.description}
                          onChange={(e) => updateProject(project.id, "description", e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Technologies Used</Label>
                          <Input
                            placeholder="React, Node.js, MongoDB"
                            value={project.technologies}
                            onChange={(e) => updateProject(project.id, "technologies", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Project Link</Label>
                          <Input
                            placeholder="github.com/project"
                            value={project.link}
                            onChange={(e) => updateProject(project.id, "link", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Step 5: Skills */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">Skills</h2>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSuggestSkills}
                    disabled={loadingTool === "suggest_skills"}
                    className="text-primary hover:text-primary"
                  >
                    {loadingTool === "suggest_skills" ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-1" />
                    )}
                    Suggest Skills
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">Your Skills *</Label>
                  <Textarea
                    id="skills"
                    placeholder="Enter your skills separated by commas (e.g., JavaScript, React, Node.js, Python, Project Management, Communication...)"
                    rows={6}
                    value={formData.skills}
                    onChange={(e) => updateFormData("skills", e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Include both technical and soft skills. Our AI will help optimize them for ATS.
                  </p>
                </div>

                {/* AI Suggested Skills */}
                {suggestedSkills.length > 0 && (
                  <div className="p-4 bg-muted/30 border border-border rounded-xl">
                    <Label className="mb-3 flex items-center gap-2 text-sm">
                      <Sparkles className="h-4 w-4 text-primary" />
                      AI Suggestions — click to add
                    </Label>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {suggestedSkills.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => addSuggestedSkill(skill)}
                          className="inline-flex items-center gap-1 px-3 py-1 border border-border rounded-full text-sm text-muted-foreground hover:text-foreground hover:border-foreground/40 hover:bg-foreground/5 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills Preview */}
                {formData.skills && (
                  <div className="mt-6">
                    <Label className="mb-3 block">Preview</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.split(",").map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 6: Professional Summary */}
            {currentStep === 6 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-semibold text-foreground mb-2">Professional Summary</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Based on your complete profile, our AI can generate a personalized, ATS-optimized summary.
                </p>
                
                {/* Profile Preview for Context */}
                <div className="p-4 bg-muted/30 border border-border rounded-lg mb-6">
                  <h3 className="text-sm font-medium text-foreground mb-3">Your Profile Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <span className="ml-2 text-foreground">{formData.firstName} {formData.lastName}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Education:</span>
                      <span className="ml-2 text-foreground">{formData.education.filter(e => e.degree).length} entries</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Experience:</span>
                      <span className="ml-2 text-foreground">{formData.experience.filter(e => e.position).length} positions</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Projects:</span>
                      <span className="ml-2 text-foreground">{formData.projects.filter(p => p.name).length} projects</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Skills:</span>
                      <span className="ml-2 text-foreground">
                        {formData.skills ? formData.skills.split(",").slice(0, 5).join(", ") + (formData.skills.split(",").length > 5 ? "..." : "") : "None added"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetJobTitle">Target Job Title (optional)</Label>
                  <Input
                    id="targetJobTitle"
                    placeholder="e.g., Senior Frontend Developer, Data Scientist, Product Manager"
                    value={targetJobTitle}
                    onChange={(e) => setTargetJobTitle(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    The AI will tailor your summary for this specific role.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="summary">Your Professional Summary</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateSummary}
                      disabled={isLoading}
                      className="text-primary hover:text-primary"
                    >
                      {isLoading && loadingType === "summary" ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4 mr-1" />
                      )}
                      AI Generate Summary
                    </Button>
                  </div>
                  <Textarea
                    id="summary"
                    placeholder="Brief summary of your professional background and career goals. Click 'AI Generate Summary' to create a personalized, ATS-optimized summary based on all your information..."
                    rows={6}
                    value={formData.summary}
                    onChange={(e) => updateFormData("summary", e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    The AI uses your education, experience, projects, and skills to craft a compelling professional summary optimized for ATS systems.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={currentStep === 1 ? "hidden sm:invisible sm:inline-flex" : ""}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {currentDraftId ? "Update Draft" : "Save Draft"}
                </Button>

                {currentStep < steps.length ? (
                  <Button onClick={nextStep}>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button variant="hero" onClick={handleSubmit}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview & Download
                  </Button>
                )}
              </div>
            </div>
            </div>

            {/* Tips Panel - Builder Exclusive Feature */}
            {showTips && (
              <div className="min-w-0 lg:col-span-1">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm sticky top-24">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="h-5 w-5 text-foreground" />
                    <h3 className="font-semibold text-foreground">Pro Tips</h3>
                  </div>
                  <ul className="space-y-3">
                    {builderTips[currentStep]?.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Circle className="h-2 w-2 mt-1.5 flex-shrink-0 fill-foreground/50 text-foreground/50" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                  
                  {/* Section Status */}
                  <div className="mt-6 pt-4 border-t border-border">
                    <h4 className="text-sm font-medium text-foreground mb-3">Section Status</h4>
                    <div className="space-y-2">
                      {steps.map((step) => (
                        <div key={step.id} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{step.title}</span>
                          {sectionCompletion[step.id as keyof typeof sectionCompletion] ? (
                            <CheckCircle2 className="h-4 w-4 text-foreground" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* CV Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <span className="text-lg sm:text-xl">Your CV Preview</span>
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap w-full sm:w-auto">
                {/* Cover Page Toggle */}
                <div className="flex items-center gap-2">
                  <Switch
                    id="cover-page"
                    checked={includeCoverPage}
                    onCheckedChange={setIncludeCoverPage}
                  />
                  <Label htmlFor="cover-page" className="text-xs sm:text-sm font-normal cursor-pointer flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">Cover Page</span>
                    <span className="sm:hidden">Cover</span>
                  </Label>
                </div>
                
                <Select value={selectedTemplate} onValueChange={(value) => setSelectedTemplate(value as TemplateId)}>
                  <SelectTrigger className="w-[140px] sm:w-[180px] text-xs sm:text-sm">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(templateNames) as TemplateId[]).map((id) => (
                      <SelectItem key={id} value={id}>
                        {templateNames[id]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleExportPDF} disabled={isExporting} size="sm" className="sm:size-default">
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  <span className="hidden sm:inline">Download PDF</span>
                  <span className="sm:hidden">PDF</span>
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* CV Preview - Scrollable on mobile with scale */}
            <div className="lg:col-span-2 overflow-x-auto">
              <div 
                id="cv-preview" 
                className="origin-top-left sm:origin-top"
                style={{ 
                  minWidth: "210mm",
                  transform: "scale(var(--cv-scale, 1))",
                }}
              >
              {/* Cover Page */}
              {includeCoverPage && <SelectedCoverPageComponent formData={formData} />}
              
              {/* CV Template */}
              <SelectedTemplateComponent formData={formData} />
              </div>
            </div>
            <div className="lg:col-span-1 order-first lg:order-last">
              <ATSScoreCard
                analysis={analysis}
                isAnalyzing={isAnalyzing}
                onAnalyze={handleAnalyzeATS}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import CV Dialog */}
      <CVImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        onImport={handleImportCV}
      />

      {/* AI Career Studio */}
      <CareerStudioDialog
        open={showCareerStudio}
        onOpenChange={setShowCareerStudio}
        formData={formData}
        jobDescription={jobDescription}
        onJobDescriptionChange={setJobDescription}
        onApplySummary={handleApplyTailoredSummary}
      />
    </div>
  );
};

export default CVBuilder;
