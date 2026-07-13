import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { 
  Upload, 
  FileText, 
  Target, 
  CheckCircle, 
  AlertCircle,
  Lightbulb,
  X,
  Loader2
} from "lucide-react";

interface ATSAnalysis {
  score: number;
  summary: string;
  extractedInfo: {
    name: string;
    email: string;
    phone: string;
    skills: string[];
    experienceCount: number;
    educationCount: number;
  };
  strengths: string[];
  improvements: string[];
  tips: string[];
}

const ATSChecker = () => {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  const acceptedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

  const handleFile = useCallback((selectedFile: File) => {
    if (!acceptedTypes.includes(selectedFile.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, or PDF file",
        variant: "destructive",
      });
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    setAnalysis(null);

    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target?.result as string);
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null);
    }
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const analyzeCV = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    try {
      // Check authentication first
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to use the ATS analyzer",
          variant: "destructive",
        });
        setIsAnalyzing(false);
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = (e.target?.result as string).split(",")[1];

        const { data, error } = await supabase.functions.invoke("analyze-uploaded-cv", {
          body: {
            fileContent: base64,
            fileType: file.type,
            fileName: file.name,
          },
        });

        if (error) {
          if (error.message?.includes("401") || error.message?.includes("Authentication")) {
            throw new Error("Session expired. Please sign in again.");
          }
          throw error;
        }
        if (data.error) throw new Error(data.error);

        setAnalysis(data);
        toast({
          title: "Analysis complete",
          description: `Your CV scored ${data.score}/100`,
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => setIsAnalyzing(false), 500);
    }
  };

  const clearFile = () => {
    setFile(null);
    setFilePreview(null);
    setAnalysis(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "from-green-500/20 to-green-500/5";
    if (score >= 60) return "from-yellow-500/20 to-yellow-500/5";
    return "from-red-500/20 to-red-500/5";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-foreground/[0.02] rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-foreground/[0.01] rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-border/50 rounded-full mb-6">
              <Target className="w-3 h-3 text-muted-foreground" />
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                ATS Analyzer
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground mb-4">
              Check Your CV's ATS Score
            </h1>
            <p className="text-muted-foreground font-mono text-sm max-w-xl mx-auto">
              Upload your existing CV and get instant feedback on its ATS compatibility.
              Supports JPG, PNG, and PDF formats.
            </p>
          </div>

          {/* Upload Area */}
          {!analysis && (
            <div className="mb-8">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${
                  isDragOver
                    ? "border-foreground/50 bg-foreground/5"
                    : "border-border/50 hover:border-foreground/30"
                } ${file ? "bg-card/30" : ""}`}
              >
                {file ? (
                  <div className="space-y-4">
                    {filePreview ? (
                      <div className="relative w-48 h-48 mx-auto rounded-lg overflow-hidden border border-border/50">
                        <img
                          src={filePreview}
                          alt="CV Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 mx-auto rounded-lg border border-border/50 flex items-center justify-center bg-card/50">
                        <FileText className="w-10 h-10 text-muted-foreground" />
                      </div>
                    )}

                    <div className="flex items-center justify-center gap-2">
                      <span className="font-mono text-sm text-foreground">{file.name}</span>
                      <button
                        onClick={clearFile}
                        className="p-1 rounded-full hover:bg-foreground/10 transition-colors"
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>

                    <Button
                      onClick={analyzeCV}
                      disabled={isAnalyzing}
                      className="font-mono text-xs uppercase tracking-wider"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Target className="w-4 h-4 mr-2" />
                          Analyze CV
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-border/50 flex items-center justify-center">
                      <Upload className="w-8 h-8 text-muted-foreground" />
                    </div>

                    <p className="text-foreground font-medium mb-2">
                      Drop your CV here or click to upload
                    </p>
                    <p className="font-mono text-xs text-muted-foreground mb-6">
                      Supports JPG, PNG, PDF (max 10MB)
                    </p>

                    <label>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                        className="hidden"
                      />
                      <Button variant="outline" className="font-mono text-xs uppercase tracking-wider cursor-pointer" asChild>
                        <span>Select File</span>
                      </Button>
                    </label>
                  </>
                )}

                {/* Corner Decorations */}
                <div className="absolute top-4 left-4 w-6 h-6 border-l border-t border-border/30" />
                <div className="absolute top-4 right-4 w-6 h-6 border-r border-t border-border/30" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-l border-b border-border/30" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-r border-b border-border/30" />
              </div>
            </div>
          )}

          {/* Analysis Results */}
          {analysis && (
            <div className="space-y-6 animate-fade-in">
              {/* Score Card */}
              <div className={`relative p-8 rounded-lg border border-border/30 bg-gradient-to-br ${getScoreBg(analysis.score)}`}>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-4 border-border/30 flex items-center justify-center bg-background/50">
                      <span className={`text-4xl font-bold ${getScoreColor(analysis.score)}`}>
                        {analysis.score}
                      </span>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-background border border-border/50 rounded-full">
                      <span className="font-mono text-xs text-muted-foreground">/100</span>
                    </div>
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-xl font-medium text-foreground mb-2">ATS Compatibility Score</h2>
                    <p className="text-muted-foreground text-sm">{analysis.summary}</p>
                  </div>

                  <Button
                    onClick={clearFile}
                    variant="outline"
                    className="font-mono text-xs uppercase tracking-wider"
                  >
                    Analyze Another
                  </Button>
                </div>
              </div>

              {/* Extracted Info */}
              {analysis.extractedInfo && (
                <div className="p-6 rounded-lg border border-border/30 bg-card/30">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      Extracted Information
                    </h3>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="p-3 bg-background/50 rounded-lg border border-border/20">
                      <p className="font-mono text-xs text-muted-foreground mb-1">Name</p>
                      <p className="text-foreground text-sm">{analysis.extractedInfo.name}</p>
                    </div>
                    <div className="p-3 bg-background/50 rounded-lg border border-border/20">
                      <p className="font-mono text-xs text-muted-foreground mb-1">Experience</p>
                      <p className="text-foreground text-sm">{analysis.extractedInfo.experienceCount} positions</p>
                    </div>
                    <div className="p-3 bg-background/50 rounded-lg border border-border/20">
                      <p className="font-mono text-xs text-muted-foreground mb-1">Education</p>
                      <p className="text-foreground text-sm">{analysis.extractedInfo.educationCount} entries</p>
                    </div>
                  </div>
                  {analysis.extractedInfo.skills?.length > 0 && (
                    <div className="mt-4">
                      <p className="font-mono text-xs text-muted-foreground mb-2">Skills Detected</p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.extractedInfo.skills.slice(0, 10).map((skill, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-xs bg-foreground/5 border border-border/30 rounded-full text-foreground"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Strengths */}
              <div className="p-6 rounded-lg border border-border/30 bg-card/30">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Strengths
                  </h3>
                </div>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                      <span className="w-1 h-1 mt-2 bg-green-500 rounded-full flex-shrink-0" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div className="p-6 rounded-lg border border-border/30 bg-card/30">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                  <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Areas for Improvement
                  </h3>
                </div>
                <ul className="space-y-2">
                  {analysis.improvements.map((improvement, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                      <span className="w-1 h-1 mt-2 bg-yellow-500 rounded-full flex-shrink-0" />
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tips */}
              <div className="p-6 rounded-lg border border-border/30 bg-card/30">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-4 h-4 text-blue-500" />
                  <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Pro Tips
                  </h3>
                </div>
                <ul className="space-y-2">
                  {analysis.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                      <span className="w-1 h-1 mt-2 bg-blue-500 rounded-full flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ATSChecker;
