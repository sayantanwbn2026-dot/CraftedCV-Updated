import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const CTASection = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="py-24 bg-card relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 grid-pattern opacity-10" />
      
      {/* Glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, hsl(0 0% 30%) 0%, transparent 70%)' }} />

      <div 
        ref={ref}
        className={`container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 scroll-animate-scale ${isVisible ? 'visible' : ''}`}
      >
        <div className="max-w-2xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-border bg-background/50 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
              No Cost. No Limits.
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-foreground mb-6 leading-tight tracking-tight">
            Ready to Build Your
            <br />
            <span className="text-gradient">Career Blueprint?</span>
          </h2>

          <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
            Join thousands who have successfully navigated ATS systems and landed interviews at top companies.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="default" asChild className="group hover-lift bg-foreground text-background hover:bg-foreground/90 px-8">
              <Link to="/builder">
                <span className="font-mono text-sm tracking-wide">START NOW</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="group hover-glow border-border/50 hover:border-foreground/30 px-8">
              <Link to="/templates">
                <span className="font-mono text-sm tracking-wide">BROWSE DESIGNS</span>
              </Link>
            </Button>
          </div>

          <p className="mt-8 text-muted-foreground text-xs font-mono uppercase tracking-wider">
            Free forever • Export unlimited PDFs
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
