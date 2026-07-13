import { UserCircle, FileText, Download, Sparkles } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const steps = [
  {
    number: "01",
    icon: UserCircle,
    title: "Input",
    subtitle: "Your Data",
    description: "Enter professional details through our streamlined interface.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Process",
    subtitle: "AI Magic",
    description: "Our engine optimizes content for maximum ATS compatibility.",
  },
  {
    number: "03",
    icon: Download,
    title: "Export",
    subtitle: "Your CV",
    description: "Download your precision-crafted CV in PDF format.",
  },
];

const HowItWorksSection = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: stepsRef, isVisible: stepsVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="py-24 gradient-subtle relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div 
          ref={headerRef}
          className={`text-center max-w-2xl mx-auto mb-16 scroll-animate ${headerVisible ? 'visible' : ''}`}
        >
          <span className="inline-block font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 border border-border px-4 py-2 rounded-full">
            Process
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-foreground mt-6 mb-4 tracking-tight">
            Three Steps to Your Perfect CV
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-foreground/30 to-transparent mx-auto" />
        </div>

        {/* Creative Timeline */}
        <div 
          ref={stepsRef}
          className="max-w-5xl mx-auto"
        >
          {/* Desktop Layout */}
          <div className="hidden lg:block relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-[10%] right-[10%] h-px -translate-y-1/2">
              <div className="w-full h-full bg-gradient-to-r from-border via-foreground/30 to-border" />
              {/* Animated dots on line */}
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 rounded-full bg-foreground/40 animate-pulse" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-foreground/60 animate-pulse" style={{ animationDelay: '0.5s' }} />
              <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 rounded-full bg-foreground/40 animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="grid grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className={`relative scroll-animate ${stepsVisible ? 'visible' : ''} stagger-${index + 1}`}
                >
                  <div className="flex flex-col items-center group">
                    {/* Hexagon-style container */}
                    <div className="relative mb-6">
                      {/* Outer glow ring */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-foreground/10 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Main container */}
                      <div className="relative w-28 h-28 rounded-2xl bg-card border border-border/50 flex items-center justify-center group-hover:border-foreground/30 group-hover:shadow-glow transition-all duration-500 rotate-45 overflow-hidden">
                        <div className="-rotate-45">
                          <step.icon className="h-10 w-10 text-foreground/70 group-hover:text-foreground transition-colors" />
                        </div>
                        
                        {/* Corner accent */}
                        <div className="absolute -top-px -right-px w-6 h-6 bg-gradient-to-br from-foreground/20 to-transparent" />
                      </div>
                      
                      {/* Number badge */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-background border border-border text-xs font-mono text-foreground/70">
                        {step.number}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-center mt-4">
                      <h3 className="text-lg font-medium text-foreground mb-1">
                        {step.title}
                      </h3>
                      <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground/70 block mb-3">
                        {step.subtitle}
                      </span>
                      <p className="text-sm text-muted-foreground leading-relaxed max-w-[220px] mx-auto">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile/Tablet Layout */}
          <div className="lg:hidden space-y-8">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`relative scroll-animate ${stepsVisible ? 'visible' : ''} stagger-${index + 1}`}
              >
                <div className="flex items-start gap-6 group">
                  {/* Icon container */}
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-xl bg-card border border-border/50 flex items-center justify-center group-hover:border-foreground/30 group-hover:shadow-glow transition-all duration-300">
                      <step.icon className="h-7 w-7 text-foreground/70 group-hover:text-foreground transition-colors" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center">
                      <span className="text-[10px] font-mono text-foreground/70">{step.number}</span>
                    </div>
                    
                    {/* Connector line */}
                    {index < steps.length - 1 && (
                      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-border to-transparent" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pt-2">
                    <h3 className="text-base font-medium text-foreground mb-1">
                      {step.title} <span className="text-muted-foreground/60 font-normal">— {step.subtitle}</span>
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
