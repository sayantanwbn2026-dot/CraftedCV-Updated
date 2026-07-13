import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sparkles, Target, FileText, MessageSquare, Loader2, CheckCircle2,
  XCircle, Copy, Download, Wand2, ArrowUpRight, Wrench, Plus,
  Upload, History, Eye, Trash2, FileDown,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCareerAI, JobMatchResult, InterviewQuestion } from "@/hooks/useCareerAI";
import { usePDFExport } from "@/hooks/usePDFExport";
import { useCVImport } from "@/hooks/useCVImport";
import type { CVFormData } from "@/components/cv-templates/types";
import type { Json } from "@/integrations/supabase/types";

interface CareerStudioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: CVFormData;
  jobDescription: string;
  onJobDescriptionChange: (value: string) => void;
  onApplySummary: (summary: string) => void;
}

type HistoryTool = "job_match" | "cover_letter" | "interview_prep" | "suggest_skills";

interface CareerHistoryRow {
  id: string;
  tool: HistoryTool;
  title: string;
  job_description: string | null;
  uploaded_cv_name: string | null;
  result: Json;
  created_at: string;
}

const scoreColor = (score: number) => (score >= 75 ? "text-primary" : score >= 50 ? "text-foreground" : "text-destructive");
const scoreRing = (score: number) => (score >= 75 ? "border-primary/40 bg-primary/5" : score >= 50 ? "border-foreground/30 bg-foreground/5" : "border-destructive/40 bg-destructive/5");

const toCvContext = (cv: CVFormData) => `NAME: ${cv.firstName} ${cv.lastName}
EMAIL: ${cv.email}
PHONE: ${cv.phone}
LOCATION: ${cv.location}
SUMMARY: ${cv.summary}
SKILLS: ${cv.skills}
EXPERIENCE:
${cv.experience.map((exp) => `- ${exp.position} at ${exp.company}: ${exp.description}`).join("\n") || "None"}
EDUCATION:
${cv.education.map((edu) => `- ${edu.degree} in ${edu.field} from ${edu.institution}`).join("\n") || "None"}
PROJECTS:
${cv.projects.map((project) => `- ${project.name} (${project.technologies}): ${project.description}`).join("\n") || "None"}`;

const toolLabel: Record<HistoryTool, string> = {
  job_match: "Job Match",
  cover_letter: "Cover Letter",
  interview_prep: "Interview Prep",
  suggest_skills: "Skills",
};

const CareerStudioDialog = ({ open, onOpenChange, formData, jobDescription, onJobDescriptionChange, onApplySummary }: CareerStudioDialogProps) => {
  const { analyzeJobMatch, generateCoverLetter, generateInterviewPrep, suggestSkills, loadingTool } = useCareerAI();
  const { importFromFile, importFromText, isImporting } = useCVImport();
  const { exportToPDF, isExporting } = usePDFExport();

  const [matchResult, setMatchResult] = useState<JobMatchResult | null>(null);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[] | null>(null);
  const [suggestedSkills, setSuggestedSkills] = useState<string[] | null>(null);
  const [tone, setTone] = useState<"professional" | "enthusiastic" | "formal">("professional");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [uploadedCvName, setUploadedCvName] = useState<string | undefined>();
  const [uploadedCvContext, setUploadedCvContext] = useState<string | undefined>();
  const [pastedCvText, setPastedCvText] = useState("");
  const [historyRows, setHistoryRows] = useState<CareerHistoryRow[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const candidateName = `${formData.firstName || ""} ${formData.lastName || ""}`.trim() || "Candidate";
  const sharedAIOptions = useMemo(() => ({ uploadedCvName, uploadedCvContext, saveHistory: true }), [uploadedCvName, uploadedCvContext]);

  const loadHistory = async () => {
    setHistoryLoading(true);
    const { data, error } = await supabase
      .from("career_studio_generations")
      .select("id, tool, title, job_description, uploaded_cv_name, result, created_at")
      .order("created_at", { ascending: false })
      .limit(25);
    if (error) console.error("career history load error:", error);
    else setHistoryRows((data || []) as CareerHistoryRow[]);
    setHistoryLoading(false);
  };

  useEffect(() => { if (open) void loadHistory(); }, [open]);

  const handleUploadCV = async (file: File) => {
    const parsed = await importFromFile(file);
    if (!parsed) return;
    setUploadedCvName(file.name);
    setUploadedCvContext(toCvContext(parsed));
    toast.success("CV knowledge added to Career Studio");
  };

  const handleUsePastedCV = async () => {
    if (!pastedCvText.trim()) return toast.error("Paste CV text first");
    const parsed = await importFromText(pastedCvText);
    setUploadedCvName("Pasted CV text");
    setUploadedCvContext(parsed ? toCvContext(parsed) : pastedCvText.slice(0, 12000));
    toast.success("CV text added to Career Studio");
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return toast.error("Paste a job description first");
    const result = await analyzeJobMatch(formData, jobDescription, sharedAIOptions);
    if (result) { setMatchResult(result); await loadHistory(); }
  };

  const handleCoverLetter = async () => {
    const letter = await generateCoverLetter(formData, jobDescription, { tone, company, role, ...sharedAIOptions });
    if (letter) { setCoverLetter(letter); await loadHistory(); }
  };

  const handleInterviewPrep = async () => {
    const result = await generateInterviewPrep(formData, jobDescription, sharedAIOptions);
    if (result) { setQuestions(result); await loadHistory(); }
  };

  const handleSuggestSkills = async () => {
    const result = await suggestSkills(formData, jobDescription, undefined, sharedAIOptions);
    if (result) { setSuggestedSkills(result); await loadHistory(); }
  };

  const exportQuestionsDoc = () => {
    if (!questions?.length) return;
    const rows = questions.map((q, i) => `<h3>${i + 1}. ${q.question}</h3><p><strong>Category:</strong> ${q.category}${q.focusArea ? ` · ${q.focusArea}` : ""}</p><p><strong>Your angle:</strong> ${q.hint}</p>`).join("");
    const blob = new Blob([`<!doctype html><html><head><meta charset="utf-8"><title>Interview Prep</title></head><body><h1>${candidateName} — Interview Prep</h1>${rows}</body></html>`], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${candidateName.replace(/\s+/g, "-")}-Interview-Prep.doc`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadHistory = (row: CareerHistoryRow) => {
    if (row.job_description) onJobDescriptionChange(row.job_description);
    const result = row.result as Record<string, unknown>;
    if (row.tool === "job_match") setMatchResult(result as unknown as JobMatchResult);
    if (row.tool === "cover_letter") setCoverLetter(typeof result.letter === "string" ? result.letter : null);
    if (row.tool === "interview_prep") setQuestions(Array.isArray(result.questions) ? result.questions as InterviewQuestion[] : null);
    if (row.tool === "suggest_skills") setSuggestedSkills(Array.isArray(result.skills) ? result.skills as string[] : null);
    toast.success(`${toolLabel[row.tool]} loaded`);
  };

  const handleDeleteHistory = async (id: string) => {
    const { error } = await supabase.from("career_studio_generations").delete().eq("id", id);
    if (error) toast.error("Could not delete history item");
    else { setHistoryRows((rows) => rows.filter((row) => row.id !== id)); toast.success("History item deleted"); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl"><Sparkles className="h-5 w-5" />AI Career Studio</DialogTitle>
          <DialogDescription>Target a job with analysis, interview prep, skills, saved history, and optional uploaded CV knowledge.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-2">
            <Label htmlFor="studio-jd" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Job Description</Label>
            <Textarea id="studio-jd" placeholder="Paste the full job description here..." rows={6} value={jobDescription} onChange={(e) => onJobDescriptionChange(e.target.value)} className="text-sm" />
          </div>
          <div className="space-y-3 border border-border rounded-xl p-4 bg-card">
            <div className="flex items-center justify-between gap-3">
              <div>
                <Label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">CV Knowledge</Label>
                <p className="text-xs text-muted-foreground mt-1">{uploadedCvName ? `Using: ${uploadedCvName}` : "Upload or paste a CV for deeper matching."}</p>
              </div>
              {uploadedCvName && <CheckCircle2 className="h-5 w-5 text-primary" />}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isImporting}>{isImporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}Upload CV</Button>
              {uploadedCvName && <Button variant="ghost" size="sm" onClick={() => { setUploadedCvName(undefined); setUploadedCvContext(undefined); }}>Clear</Button>}
              <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.txt" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) void handleUploadCV(file); e.currentTarget.value = ""; }} />
            </div>
            <Textarea value={pastedCvText} onChange={(e) => setPastedCvText(e.target.value)} placeholder="Or paste CV text here..." rows={3} className="text-xs" />
            <Button variant="secondary" size="sm" onClick={handleUsePastedCV} disabled={isImporting || !pastedCvText.trim()}>Use Pasted CV</Button>
          </div>
        </div>

        <Tabs defaultValue="match" className="w-full mt-2">
          <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 flex-nowrap">
            <TabsTrigger value="match" className="gap-1.5 text-xs sm:text-sm"><Target className="h-3.5 w-3.5" />Job Match</TabsTrigger>
            <TabsTrigger value="letter" className="gap-1.5 text-xs sm:text-sm"><FileText className="h-3.5 w-3.5" />Cover Letter</TabsTrigger>
            <TabsTrigger value="interview" className="gap-1.5 text-xs sm:text-sm"><MessageSquare className="h-3.5 w-3.5" />Interview Prep</TabsTrigger>
            <TabsTrigger value="skills" className="gap-1.5 text-xs sm:text-sm"><Wrench className="h-3.5 w-3.5" />Skills</TabsTrigger>
            <TabsTrigger value="history" className="gap-1.5 text-xs sm:text-sm"><History className="h-3.5 w-3.5" />History</TabsTrigger>
          </TabsList>

          <TabsContent value="match" className="mt-4 space-y-4">
            {!matchResult ? <div className="text-center py-8 border-2 border-dashed border-border rounded-xl"><Target className="h-10 w-10 text-muted-foreground mx-auto mb-3" /><p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">Score this CV against the role using builder data and uploaded CV knowledge.</p><Button onClick={handleAnalyze} disabled={loadingTool === "job_match"}>{loadingTool === "job_match" ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analyzing...</> : <><Target className="h-4 w-4 mr-2" />Analyze Match</>}</Button></div> : <div className="space-y-5">
              <div className="flex flex-col sm:flex-row items-center gap-4 p-5 bg-card border border-border rounded-2xl"><div className={`shrink-0 flex items-center justify-center w-24 h-24 rounded-full border-4 ${scoreRing(matchResult.matchScore)}`}><span className={`text-3xl font-bold ${scoreColor(matchResult.matchScore)}`}>{matchResult.matchScore}</span></div><div className="text-center sm:text-left"><p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1">Match Score</p><p className="text-sm text-foreground">{matchResult.verdict}</p></div></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="p-4 bg-card border border-border rounded-xl"><h4 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3"><CheckCircle2 className="h-4 w-4 text-primary" />Matched Keywords</h4><div className="flex flex-wrap gap-1.5">{matchResult.matchedKeywords.map((kw, i) => <span key={i} className="px-2.5 py-1 bg-primary/10 text-foreground rounded-full text-xs">{kw}</span>)}</div></div><div className="p-4 bg-card border border-border rounded-xl"><h4 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3"><XCircle className="h-4 w-4 text-destructive" />Missing Keywords</h4><div className="flex flex-wrap gap-1.5">{matchResult.missingKeywords.map((kw, i) => <span key={i} className="px-2.5 py-1 border border-border text-muted-foreground rounded-full text-xs">{kw}</span>)}</div></div></div>
              {matchResult.tailoredSummary && <div className="p-4 bg-card border border-border rounded-xl space-y-3"><h4 className="flex items-center gap-2 text-sm font-semibold text-foreground"><Wand2 className="h-4 w-4 text-primary" />Tailored Summary</h4><p className="text-sm text-muted-foreground leading-relaxed">{matchResult.tailoredSummary}</p><Button size="sm" onClick={() => { onApplySummary(matchResult.tailoredSummary); toast.success("Tailored summary applied to your CV"); }}><ArrowUpRight className="h-4 w-4 mr-1" />Apply to CV</Button></div>}
              {matchResult.suggestions?.length > 0 && <div className="p-4 bg-card border border-border rounded-xl"><h4 className="text-sm font-semibold text-foreground mb-3">How to Improve Fit</h4><ul className="space-y-2">{matchResult.suggestions.map((s, i) => <li key={i} className="text-sm text-muted-foreground flex items-start gap-2"><span className="text-primary mt-0.5">•</span>{s}</li>)}</ul></div>}
              <Button variant="outline" onClick={handleAnalyze} disabled={loadingTool === "job_match"} className="w-full">Re-analyze Match</Button>
            </div>}
          </TabsContent>

          <TabsContent value="letter" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3"><div className="space-y-1.5"><Label className="text-xs">Company</Label><Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Corp" /></div><div className="space-y-1.5"><Label className="text-xs">Role</Label><Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Frontend Engineer" /></div><div className="space-y-1.5"><Label className="text-xs">Tone</Label><Select value={tone} onValueChange={(v) => setTone(v as typeof tone)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="professional">Professional</SelectItem><SelectItem value="enthusiastic">Enthusiastic</SelectItem><SelectItem value="formal">Formal</SelectItem></SelectContent></Select></div></div>
            <Button onClick={handleCoverLetter} disabled={loadingTool === "cover_letter"} className="w-full sm:w-auto">{loadingTool === "cover_letter" ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Writing...</> : <><Sparkles className="h-4 w-4 mr-2" />{coverLetter ? "Regenerate Letter" : "Generate Cover Letter"}</>}</Button>
            {coverLetter && <div className="space-y-3"><div className="flex items-center gap-2 flex-wrap"><Button variant="outline" size="sm" onClick={async () => { await navigator.clipboard.writeText(coverLetter); toast.success("Cover letter copied"); }}><Copy className="h-4 w-4 mr-1" />Copy</Button><Button variant="outline" size="sm" onClick={() => exportToPDF("cover-letter-preview", `${candidateName.replace(/\s+/g, "-")}-Cover-Letter.pdf`)} disabled={isExporting}>{isExporting ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Download className="h-4 w-4 mr-1" />}PDF</Button></div><div className="overflow-x-auto rounded-xl border border-border"><div id="cover-letter-preview" className="bg-white text-gray-900 p-10 sm:p-12" style={{ minWidth: "210mm", fontFamily: "Georgia, 'Times New Roman', serif" }}><p className="text-lg font-semibold mb-1">{candidateName}</p><p className="text-sm text-gray-500 mb-8">{[formData.email, formData.phone, formData.location].filter(Boolean).join("  ·  ")}</p>{coverLetter.split(/\n{2,}/).map((para, i) => <p key={i} className="text-[15px] leading-relaxed mb-4 whitespace-pre-line">{para}</p>)}</div></div></div>}
          </TabsContent>

          <TabsContent value="interview" className="mt-4 space-y-4">
            {!questions ? <div className="text-center py-8 border-2 border-dashed border-border rounded-xl"><MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3" /><p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">Generate behavioral, role-specific, and technical questions grounded in the CV.</p><Button onClick={handleInterviewPrep} disabled={loadingTool === "interview_prep"}>{loadingTool === "interview_prep" ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Preparing...</> : <><MessageSquare className="h-4 w-4 mr-2" />Generate Interview Prep</>}</Button></div> : <div className="space-y-3"><div className="flex flex-wrap gap-2"><Button variant="outline" size="sm" onClick={() => exportToPDF("interview-prep-preview", `${candidateName.replace(/\s+/g, "-")}-Interview-Prep.pdf`)} disabled={isExporting}>{isExporting ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <FileDown className="h-4 w-4 mr-1" />}Export PDF</Button><Button variant="outline" size="sm" onClick={exportQuestionsDoc}><Download className="h-4 w-4 mr-1" />Export DOC</Button></div><div id="interview-prep-preview" className="space-y-3 bg-background p-2">{questions.map((q, i) => <div key={i} className="p-4 bg-card border border-border rounded-xl"><div className="flex items-start justify-between gap-3 mb-2"><p className="text-sm font-medium text-foreground">{i + 1}. {q.question}</p><span className="shrink-0 px-2 py-0.5 border border-border rounded-full font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{q.category}</span></div>{q.focusArea && <p className="text-xs text-muted-foreground mb-2">Focus: {q.focusArea}</p>}<p className="text-sm text-muted-foreground leading-relaxed"><span className="text-primary font-medium">Your angle: </span>{q.hint}</p></div>)}</div><Button variant="outline" onClick={handleInterviewPrep} disabled={loadingTool === "interview_prep"} className="w-full">Regenerate Questions</Button></div>}
          </TabsContent>

          <TabsContent value="skills" className="mt-4 space-y-4">
            {!suggestedSkills ? <div className="text-center py-8 border-2 border-dashed border-border rounded-xl"><Wrench className="h-10 w-10 text-muted-foreground mx-auto mb-3" /><p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">Identify role keywords and CV-supported skills worth highlighting.</p><Button onClick={handleSuggestSkills} disabled={loadingTool === "suggest_skills"}>{loadingTool === "suggest_skills" ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Finding...</> : <><Wrench className="h-4 w-4 mr-2" />Suggest Skills</>}</Button></div> : <div className="space-y-4"><div className="p-4 bg-card border border-border rounded-xl"><h4 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3"><Sparkles className="h-4 w-4 text-primary" />Recommended Skills</h4><div className="flex flex-wrap gap-2">{suggestedSkills.map((skill, i) => <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm"><Plus className="h-3 w-3" />{skill}</span>)}</div></div><Button variant="outline" onClick={handleSuggestSkills} disabled={loadingTool === "suggest_skills"} className="w-full">Regenerate Skills</Button></div>}
          </TabsContent>

          <TabsContent value="history" className="mt-4 space-y-3">
            {historyLoading ? <div className="py-8 text-center text-muted-foreground"><Loader2 className="h-5 w-5 mx-auto mb-2 animate-spin" />Loading saved generations...</div> : historyRows.length === 0 ? <div className="py-8 text-center border border-dashed border-border rounded-xl text-sm text-muted-foreground">Generated outputs will appear here.</div> : historyRows.map((row) => <div key={row.id} className="p-4 bg-card border border-border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2 mb-1"><span className="font-mono text-[10px] uppercase tracking-wider text-primary">{toolLabel[row.tool]}</span>{row.uploaded_cv_name && <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">CV: {row.uploaded_cv_name}</span>}</div><p className="text-sm font-medium text-foreground truncate">{row.title}</p><p className="text-xs text-muted-foreground">{new Date(row.created_at).toLocaleString()}</p></div><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => handleLoadHistory(row)}><Eye className="h-4 w-4 mr-1" />View</Button><Button variant="ghost" size="icon" onClick={() => handleDeleteHistory(row.id)} aria-label="Delete history item"><Trash2 className="h-4 w-4" /></Button></div></div>)}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CareerStudioDialog;