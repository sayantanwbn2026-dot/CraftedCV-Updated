import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const templates = [
  { name: "Minimal Pro", style: "Clean single-column" },
  { name: "Executive Elite", style: "Premium serif" },
  { name: "Tech Focused", style: "Engineering layout" },
  { name: "Creative Bold", style: "Bold asymmetric" },
];

const TemplatesPreview = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation();

  return (
    <section className="py-24 bg-background relative overflow-hidden noise-overlay">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-border to-transparent" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-border to-transparent" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div 
          ref={headerRef}
          className={`text-center max-w-2xl mx-auto mb-12 scroll-animate ${headerVisible ? 'visible' : ''}`}
        >
          <span className="inline-block font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 border border-border px-4 py-2 rounded-full">
            Templates
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-foreground mt-6 mb-4 tracking-tight">
            Professional Designs
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-foreground/30 to-transparent mx-auto" />
        </div>

        {/* Templates Grid */}
        <div 
          ref={gridRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {templates.map((template, index) => (
            <div
              key={template.name}
              className={`group cursor-pointer scroll-animate ${gridVisible ? 'visible' : ''} stagger-${index + 1}`}
            >
              <div className="relative bg-card/50 rounded-lg border border-border/50 overflow-hidden hover:border-foreground/20 hover-lift">
                {/* Template Preview */}
                <div className="aspect-[3/4] p-4">
                  <div className="h-full bg-background rounded-md border border-border/50 p-3 space-y-3">
                    {/* Header */}
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-foreground/10 border border-border/50" />
                      <div className="flex-1 space-y-1">
                        <div className="h-1.5 bg-foreground/20 rounded w-3/4" />
                        <div className="h-1 bg-foreground/10 rounded w-1/2" />
                      </div>
                    </div>
                    {/* Content */}
                    <div className="space-y-1.5">
                      <div className="h-1.5 bg-foreground/15 rounded w-1/3" />
                      <div className="h-1 bg-foreground/10 rounded w-full" />
                      <div className="h-1 bg-foreground/10 rounded w-5/6" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-1.5 bg-foreground/15 rounded w-1/4" />
                      <div className="h-1 bg-foreground/10 rounded w-full" />
                      <div className="h-1 bg-foreground/10 rounded w-4/5" />
                    </div>
                  </div>
                </div>
                
                {/* Template Name */}
                <div className="p-4 border-t border-border/50">
                  <h3 className="font-medium text-sm text-foreground text-center group-hover:text-foreground/80 transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-[10px] text-muted-foreground text-center mt-1 font-mono uppercase tracking-wider">
                    {template.style}
                  </p>
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div 
          ref={ctaRef}
          className={`text-center scroll-animate ${ctaVisible ? 'visible' : ''}`}
        >
          <Button size="lg" variant="outline" asChild className="group border-border/50 hover:border-foreground/30 font-mono text-xs uppercase tracking-wider">
            <Link to="/templates">
              View All Templates
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TemplatesPreview;
