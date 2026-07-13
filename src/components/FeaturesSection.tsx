import { Sparkles, Target, FileCheck, FileText, MessageSquare, Download } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const features = [
  {
    icon: Target,
    title: "AI Job Match Studio",
    description: "Paste any job description and get a real match score, matched vs. missing keywords, and a one-click summary tailored to that exact role.",
    stat: "0-100",
    statLabel: "Match Score"
  },
  {
    icon: FileText,
    title: "AI Cover Letters",
    description: "A tailored, human-sounding cover letter generated from your actual CV and the job description — with tone control and PDF export.",
    stat: "30s",
    statLabel: "To Generate"
  },
  {
    icon: MessageSquare,
    title: "AI Interview Prep",
    description: "Predicts the questions you're most likely to face for the role, with personalized talking points drawn from your own experience.",
    stat: "8+",
    statLabel: "Questions"
  },
  {
    icon: Sparkles,
    title: "AI Content Engine",
    description: "Summaries, achievement bullets, project descriptions, and skill suggestions — plus PDF import that parses your old CV instantly.",
    stat: "AI",
    statLabel: "Gemini Powered"
  },
  {
    icon: FileCheck,
    title: "Live ATS Checker",
    description: "Instant ATS compatibility scoring with strengths, weaknesses, and actionable fixes — before a recruiter ever sees your CV.",
    stat: "98%",
    statLabel: "Pass Rate"
  },
  {
    icon: Download,
    title: "24 Templates + PDF Export",
    description: "ATS-engineered templates with single-column parsing and semantic structure. Export pixel-perfect, print-ready PDFs in one click.",
    stat: "24",
    statLabel: "Templates"
  },
];

const FeaturesSection = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation({ threshold: 0.05 });

  return (
    <section className="py-24 bg-background relative overflow-hidden noise-overlay">
      {/* Grid background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      {/* Subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, hsl(0 0% 15%) 0%, transparent 70%)' }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div 
          ref={headerRef}
          className={`text-center max-w-2xl mx-auto mb-16 scroll-animate ${headerVisible ? 'visible' : ''}`}
        >
          <span className="inline-block font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 border border-border px-4 py-2 rounded-full">
            Features
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-foreground mt-6 mb-4 tracking-tight">
            Everything You Need to Get Hired
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-foreground/30 to-transparent mx-auto" />
        </div>

        {/* Features Grid */}
        <div 
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group p-8 rounded-xl bg-card/50 border border-border/50 hover:border-foreground/20 hover-lift scroll-animate ${gridVisible ? 'visible' : ''} stagger-${index + 1}`}
            >
              {/* Icon and stat */}
              <div className="flex items-start justify-between mb-6">
                <div className="infographic-circle w-12 h-12 group-hover:shadow-glow transition-all duration-300">
                  <feature.icon className="h-5 w-5 text-foreground/70 group-hover:text-foreground transition-colors" />
                </div>
                <div className="text-right">
                  <span className="text-2xl font-mono text-foreground">{feature.stat}</span>
                  <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">{feature.statLabel}</span>
                </div>
              </div>
              
              <h3 className="text-lg font-medium text-foreground mb-3 group-hover:text-foreground/90 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              
              {/* Bottom line */}
              <div className="mt-6 h-px bg-gradient-to-r from-foreground/10 via-foreground/20 to-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
