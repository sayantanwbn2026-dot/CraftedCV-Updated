import { CheckCircle2, AlertCircle, Lightbulb, Target, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ATSAnalysis {
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  tips: string[];
}

interface ATSScoreCardProps {
  analysis: ATSAnalysis | null;
  isAnalyzing: boolean;
  onAnalyze: () => void;
}

const ATSScoreCard = ({ analysis, isAnalyzing, onAnalyze }: ATSScoreCardProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-primary";
    if (score >= 60) return "text-yellow-500";
    return "text-destructive";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-primary/10 border-primary/20";
    if (score >= 60) return "bg-yellow-500/10 border-yellow-500/20";
    return "bg-destructive/10 border-destructive/20";
  };

  if (!analysis) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 text-center">
        <Target className="h-12 w-12 text-primary mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">ATS Score Checker</h3>
        <p className="text-muted-foreground mb-4 text-sm">
          Analyze your CV to see how well it will perform with Applicant Tracking Systems.
        </p>
        <Button onClick={onAnalyze} disabled={isAnalyzing} className="w-full">
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Target className="h-4 w-4 mr-2" />
              Check ATS Score
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
      {/* Score Display */}
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full border-4 ${getScoreBg(analysis.score)}`}>
          <span className={`text-3xl font-bold ${getScoreColor(analysis.score)}`}>
            {analysis.score}
          </span>
        </div>
        <p className="text-muted-foreground mt-2 text-sm">{analysis.summary}</p>
      </div>

      {/* Strengths */}
      {analysis.strengths.length > 0 && (
        <div>
          <h4 className="font-semibold text-foreground flex items-center gap-2 mb-3">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            Strengths
          </h4>
          <ul className="space-y-2">
            {analysis.strengths.map((strength, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Improvements */}
      {analysis.improvements.length > 0 && (
        <div>
          <h4 className="font-semibold text-foreground flex items-center gap-2 mb-3">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            Areas to Improve
          </h4>
          <ul className="space-y-2">
            {analysis.improvements.map((improvement, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-yellow-500 mt-1">•</span>
                {improvement}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tips */}
      {analysis.tips.length > 0 && (
        <div>
          <h4 className="font-semibold text-foreground flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-primary" />
            Pro Tips
          </h4>
          <ul className="space-y-2">
            {analysis.tips.map((tip, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Re-analyze Button */}
      <Button onClick={onAnalyze} variant="outline" disabled={isAnalyzing} className="w-full">
        {isAnalyzing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Analyzing...
          </>
        ) : (
          "Re-analyze CV"
        )}
      </Button>
    </div>
  );
};

export default ATSScoreCard;
