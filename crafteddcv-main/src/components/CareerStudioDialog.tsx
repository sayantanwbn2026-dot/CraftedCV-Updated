import { useState } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import { useCareerAI, JobMatchResult, InterviewQuestion } from "@/hooks/useCareerAI";
import { usePDFExport } from "@/hooks/usePDFExport";
import type { CVFormData } from "@/components/cv-templates/types";

interface CareerStudioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: CVFormData;
  jobDescription: string;
  onJobDescriptionChange: (value: string) => void;
  onApplySummary: (summary: string) => void;
}

const scoreColor = (score: number) => {
  if (score >= 75) return "text-primary";
  if (score >= 50) return "text-yellow-500";
  return "text-destructive";
};

const scoreRing = (score: number) => {
  if (score >= 75) return "border-primary/40 bg-primary/5";
  if (score >= 50) return "border-yellow-500/40 bg-yellow-500/5";
  return "border-destructive/40 bg-destructive/5";
};

const CareerStudioDialog = ({
  open,
  onOpenChange,
  formData,
  jobDescription,
  onJobDescriptionChange,
  onApplySummary,
}: CareerStudioDialogProps) => {
  const { analyzeJobMatch, generateCoverLetter, generateInterviewPrep, suggestSkills, loadingTool } = useCareerAI();
  const { exportToPDF, isExporting } = usePDFExport();

  const [matchResult, setMatchResult] = useState<JobMatchResult | null>(null);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[] | null>(null);
  const [suggestedSkills, setSuggestedSkills] = useState<string[] | null>(null);
  const [tone, setTone] = useState<"professional" | "enthusiastic" | "formal">("professional");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");

  const candidateName = `${formData.firstName || ""} ${formData.lastName || ""}`.trim() || "Candidate";

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast.error("Paste a job description first");
      return;
    }
    const result = await analyzeJobMatch(formData, jobDescription);
    if (result) setMatchResult(result);
  };

  const handleCoverLetter = async () => {
    const letter = await generateCoverLetter(formData, jobDescription, { tone, company, role });
    if (letter) setCoverLetter(letter);
  };

  const handleInterviewPrep = async () => {
    const result = await generateInterviewPrep(formData, jobDescription);
    if (result) setQuestions(result);
  };

  const handleSuggestSkills = async () => {
    const result = await suggestSkills(formData, jobDescription);
    if (result) setSuggestedSkills(result);
  };

  const handleCopyLetter = async () => {
    if (!coverLetter) return;
    await navigator.clipboard.writeText(coverLetter);
    toast.success("Cover letter copied to clipboard");
  };

  const handleDownloadLetter = () => {
    exportToPDF("cover-letter-preview", `${candidateName.replace(/\s+/g, "-")}-Cover-Letter.pdf`);
  };

  const handleApplySummary = () => {
    if (!matchResult?.tailoredSummary) return;
    onApplySummary(matchResult.tailoredSummary);
    toast.success("Tailored summary applied to your CV");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Sparkles className="h-5 w-5" />
            AI Career Studio
          </DialogTitle>
          <DialogDescription>
            Target a specific job — match analysis, a tailored cover letter, and interview prep, all grounded in your CV.
          </DialogDescription>
        </DialogHeader>

        {/* Shared job description input */}
        <div className="space-y-2">
          <Label htmlFor="studio-jd" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Job Description
          </Label>
          <Textarea
            id="studio-jd"
            placeholder="Paste the full job description here — the AI uses it across every tab..."
            rows={5}
            value={jobDescription}
            onChange={(e) => onJobDescriptionChange(e.target.value)}
            className="text-sm"
          />
        </div>

        <Tabs defaultValue="match" className="w-full mt-2">
          <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 flex-nowrap">
            <TabsTrigger value="match" className="gap-1.5 text-xs sm:text-sm">
              <Target className="h-3.5 w-3.5" />
              Job Match
            </TabsTrigger>
            <TabsTrigger value="letter" className="gap-1.5 text-xs sm:text-sm">
              <FileText className="h-3.5 w-3.5" />
              Cover Letter
            </TabsTrigger>
            <TabsTrigger value="interview" className="gap-1.5 text-xs sm:text-sm">
              <MessageSquare className="h-3.5 w-3.5" />
              Interview Prep
            </TabsTrigger>
            <TabsTrigger value="skills" className="gap-1.5 text-xs sm:text-sm">
              <Wrench className="h-3.5 w-3.5" />
              Skills
            </TabsTrigger>
          </TabsList>

          {/* ------------------------------ JOB MATCH ------------------------------ */}
          <TabsContent value="match" className="mt-4 space-y-4">
            {!matchResult ? (
              <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
                <Target className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
                  See exactly how your CV scores against this job — matched keywords, gaps, and a one-click tailored summary.
                </p>
                <Button onClick={handleAnalyze} disabled={loadingTool === "job_match"}>
                  {loadingTool === "job_match" ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analyzing match...</>
                  ) : (
                    <><Target className="h-4 w-4 mr-2" />Analyze Match</>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Score */}
                <div className="flex flex-col sm:flex-row items-center gap-4 p-5 bg-card border border-border rounded-2xl">
                  <div className={`shrink-0 flex items-center justify-center w-24 h-24 rounded-full border-4 ${scoreRing(matchResult.matchScore)}`}>
                    <span className={`text-3xl font-bold ${scoreColor(matchResult.matchScore)}`}>
                      {matchResult.matchScore}
                    </span>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1">Match Score</p>
                    <p className="text-sm text-foreground">{matchResult.verdict}</p>
                  </div>
                </div>

                {/* Keywords */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-card border border-border rounded-xl">
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Matched Keywords
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {matchResult.matchedKeywords.map((kw, i) => (
                        <span key={i} className="px-2.5 py-1 bg-primary/10 text-foreground rounded-full text-xs">
                          {kw}
                        </span>
                      ))}
                      {matchResult.matchedKeywords.length === 0 && (
                        <p className="text-xs text-muted-foreground">None detected yet</p>
                      )}
                    </div>
                  </div>
                  <div className="p-4 bg-card border border-border rounded-xl">
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                      <XCircle className="h-4 w-4 text-destructive" />
                      Missing Keywords
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {matchResult.missingKeywords.map((kw, i) => (
                        <span key={i} className="px-2.5 py-1 border border-border text-muted-foreground rounded-full text-xs">
                          {kw}
                        </span>
                      ))}
                      {matchResult.missingKeywords.length === 0 && (
                        <p className="text-xs text-muted-foreground">Nothing important missing 🎉</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tailored summary */}
                {matchResult.tailoredSummary && (
                  <div className="p-4 bg-card border border-border rounded-xl space-y-3">
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Wand2 className="h-4 w-4 text-primary" />
                      Tailored Summary for This Job
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{matchResult.tailoredSummary}</p>
                    <Button size="sm" onClick={handleApplySummary}>
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      Apply to CV
                    </Button>
                  </div>
                )}

                {/* Suggestions */}
                {matchResult.suggestions?.length > 0 && (
                  <div className="p-4 bg-card border border-border rounded-xl">
                    <h4 className="text-sm font-semibold text-foreground mb-3">How to Improve Your Fit</h4>
                    <ul className="space-y-2">
                      {matchResult.suggestions.map((s, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button variant="outline" onClick={handleAnalyze} disabled={loadingTool === "job_match"} className="w-full">
                  {loadingTool === "job_match" ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Re-analyzing...</>
                  ) : (
                    "Re-analyze Match"
                  )}
                </Button>
              </div>
            )}
          </TabsContent>

          {/* ----------------------------- COVER LETTER ---------------------------- */}
          <TabsContent value="letter" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Company (optional)</Label>
                <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Corp" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Role (optional)</Label>
                <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Frontend Engineer" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Tone</Label>
                <Select value={tone} onValueChange={(v) => setTone(v as typeof tone)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleCoverLetter} disabled={loadingTool === "cover_letter"} className="w-full sm:w-auto">
              {loadingTool === "cover_letter" ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Writing your letter...</>
              ) : (
                <><Sparkles className="h-4 w-4 mr-2" />{coverLetter ? "Regenerate Letter" : "Generate Cover Letter"}</>
              )}
            </Button>

            {coverLetter && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Button variant="outline" size="sm" onClick={handleCopyLetter}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownloadLetter} disabled={isExporting}>
                    {isExporting ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Download className="h-4 w-4 mr-1" />}
                    Download PDF
                  </Button>
                </div>
                <div className="overflow-x-auto rounded-xl border border-border">
                  <div
                    id="cover-letter-preview"
                    className="bg-white text-gray-900 p-10 sm:p-12"
                    style={{ minWidth: "210mm", fontFamily: "Georgia, 'Times New Roman', serif" }}
                  >
                    <p className="text-lg font-semibold mb-1">{candidateName}</p>
                    <p className="text-sm text-gray-500 mb-8">
                      {[formData.email, formData.phone, formData.location].filter(Boolean).join("  ·  ")}
                    </p>
                    {coverLetter.split(/\n{2,}/).map((para, i) => (
                      <p key={i} className="text-[15px] leading-relaxed mb-4 whitespace-pre-line">
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* ---------------------------- INTERVIEW PREP --------------------------- */}
          <TabsContent value="interview" className="mt-4 space-y-4">
            {!questions ? (
              <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
                <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
                  AI predicts the questions you're most likely to face for this role — with talking points drawn from your own CV.
                </p>
                <Button onClick={handleInterviewPrep} disabled={loadingTool === "interview_prep"}>
                  {loadingTool === "interview_prep" ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Preparing questions...</>
                  ) : (
                    <><MessageSquare className="h-4 w-4 mr-2" />Generate Interview Prep</>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {questions.map((q, i) => (
                  <div key={i} className="p-4 bg-card border border-border rounded-xl">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="text-sm font-medium text-foreground">{i + 1}. {q.question}</p>
                      <span className="shrink-0 px-2 py-0.5 border border-border rounded-full font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {q.category}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <span className="text-primary font-medium">Your angle: </span>
                      {q.hint}
                    </p>
                  </div>
                ))}
                <Button variant="outline" onClick={handleInterviewPrep} disabled={loadingTool === "interview_prep"} className="w-full">
                  {loadingTool === "interview_prep" ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Regenerating...</>
                  ) : (
                    "Regenerate Questions"
                  )}
                </Button>
              </div>
            )}
          </TabsContent>

          {/* ----------------------------- SKILLS SUGGESTION ---------------------------- */}
          <TabsContent value="skills" className="mt-4 space-y-4">
            {!suggestedSkills ? (
              <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
                <Wrench className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
                  Discover exactly which skills you should highlight for this role, based on your existing background.
                </p>
                <Button onClick={handleSuggestSkills} disabled={loadingTool === "suggest_skills"}>
                  {loadingTool === "suggest_skills" ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Finding skills...</>
                  ) : (
                    <><Wrench className="h-4 w-4 mr-2" />Suggest Skills</>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-card border border-border rounded-xl">
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Recommended Skills to Add
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {suggestedSkills.map((skill, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm">
                        <Plus className="h-3 w-3" />
                        {skill}
                      </span>
                    ))}
                    {suggestedSkills.length === 0 && (
                      <p className="text-sm text-muted-foreground">You already have all the important skills listed!</p>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Consider adding these to the "Skills" section of your CV if you have experience with them.
                  </p>
                </div>
                <Button variant="outline" onClick={handleSuggestSkills} disabled={loadingTool === "suggest_skills"} className="w-full">
                  {loadingTool === "suggest_skills" ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Regenerating...</>
                  ) : (
                    "Regenerate Skills"
                  )}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CareerStudioDialog;
