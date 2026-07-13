import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Target } from "lucide-react";

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width - 0.5,
          y: (e.clientY - rect.top) / rect.height - 0.5,
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background noise-overlay"
    >
      {/* Grid pattern background */}
      <div 
        className="absolute inset-0 grid-pattern opacity-30"
        style={{
          transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`,
          transition: 'transform 0.3s ease-out'
        }}
      />

      {/* Parallax geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Large circle - slow parallax */}
        <div 
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full border border-border/30 parallax-slow"
          style={{ 
            transform: `translate(${mousePosition.x * -30}px, ${mousePosition.y * -30 + scrollY * 0.2}px)`,
            transition: 'transform 0.1s linear'
          }} 
        />
        
        {/* Medium circle with glow */}
        <div 
          className="absolute top-1/3 -left-20 w-[400px] h-[400px] rounded-full border border-border/20"
          style={{ 
            transform: `translate(${mousePosition.x * 40}px, ${mousePosition.y * 40 + scrollY * 0.3}px)`,
            boxShadow: '0 0 100px hsl(0 0% 20% / 0.3)',
            transition: 'transform 0.1s linear'
          }} 
        />

        {/* Small accent circles */}
        <div 
          className="absolute top-1/4 right-1/4 w-3 h-3 rounded-full bg-foreground/60"
          style={{ 
            transform: `translate(${mousePosition.x * 60}px, ${mousePosition.y * 60 + scrollY * 0.5}px)`,
            transition: 'transform 0.05s linear'
          }} 
        />
        <div 
          className="absolute bottom-1/3 left-1/3 w-2 h-2 rounded-full bg-foreground/40"
          style={{ 
            transform: `translate(${mousePosition.x * -50}px, ${mousePosition.y * -50 + scrollY * 0.4}px)`,
            transition: 'transform 0.05s linear'
          }} 
        />
        <div 
          className="absolute top-2/3 right-1/3 w-4 h-4 rounded-full border border-foreground/30"
          style={{ 
            transform: `translate(${mousePosition.x * 70}px, ${mousePosition.y * 70 + scrollY * 0.6}px)`,
            transition: 'transform 0.05s linear'
          }} 
        />

        {/* Horizontal lines - fast parallax */}
        <div 
          className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent"
          style={{ 
            transform: `translateY(${scrollY * 0.4}px)`,
            transition: 'transform 0.1s linear'
          }} 
        />
        <div 
          className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent"
          style={{ 
            transform: `translateY(${scrollY * -0.3}px)`,
            transition: 'transform 0.1s linear'
          }} 
        />

        {/* Vertical lines */}
        <div 
          className="absolute top-0 bottom-0 left-1/4 w-px bg-gradient-to-b from-transparent via-foreground/5 to-transparent"
          style={{ 
            transform: `translateX(${mousePosition.x * 20}px)`,
            transition: 'transform 0.2s linear'
          }} 
        />
        <div 
          className="absolute top-0 bottom-0 right-1/4 w-px bg-gradient-to-b from-transparent via-foreground/5 to-transparent"
          style={{ 
            transform: `translateX(${mousePosition.x * -20}px)`,
            transition: 'transform 0.2s linear'
          }} 
        />

        {/* Glow effect following mouse */}
        <div 
          className="absolute w-[500px] h-[500px] rounded-full opacity-20"
          style={{ 
            background: 'radial-gradient(circle, hsl(0 0% 30%) 0%, transparent 70%)',
            left: `calc(50% + ${mousePosition.x * 200}px - 250px)`,
            top: `calc(50% + ${mousePosition.y * 200}px - 250px)`,
            transition: 'left 0.3s ease-out, top 0.3s ease-out'
          }} 
        />
      </div>

      <div 
        className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 relative z-20"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      >
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <div 
            className="flex justify-center mb-12 animate-fade-in"
            style={{ 
              transform: `translateY(${scrollY * -0.08}px)`,
              opacity: Math.max(0, 1 - scrollY * 0.002)
            }}
          >
            <div className="inline-flex items-center gap-3 border border-border bg-card/50 backdrop-blur-sm rounded-full px-5 py-2.5 hover-glow cursor-default group">
              <div className="w-2 h-2 rounded-full bg-foreground animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground transition-colors">
                AI-Powered CV Engine
              </span>
            </div>
          </div>

          {/* Main Heading */}
          <div 
            className="text-center mb-10 animate-fade-in" 
            style={{ 
              animationDelay: "0.1s",
              transform: `translateY(${scrollY * -0.15}px)` 
            }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1] mb-6">
              <span className="text-gradient block hover:opacity-80 transition-opacity cursor-default">
                Engineering Your
              </span>
              <span className="text-foreground/90 block mt-2 hover:text-foreground transition-colors cursor-default">
                Career Blueprint
              </span>
            </h1>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-foreground/30 to-transparent mx-auto mt-8" />
          </div>

          {/* Subheading */}
          <p 
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-12 text-center animate-fade-in leading-relaxed font-light" 
            style={{ 
              animationDelay: "0.2s",
              transform: `translateY(${scrollY * -0.1}px)` 
            }}
          >
            Precision-crafted resumes that pass through ATS systems. Built with AI. Designed for humans.
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in" 
            style={{ 
              animationDelay: "0.3s",
              transform: `translateY(${scrollY * -0.05}px)` 
            }}
          >
            <Button size="lg" variant="default" asChild className="group hover-lift bg-foreground text-background hover:bg-foreground/90 px-8">
              <Link to="/builder">
                <span className="font-mono text-sm tracking-wide">START BUILDING</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="group hover-glow border-border/50 hover:border-foreground/30 px-8">
              <Link to="/templates">
                <span className="font-mono text-sm tracking-wide">VIEW TEMPLATES</span>
              </Link>
            </Button>
          </div>

          {/* Infographic Stats */}
          <div 
            className="flex flex-wrap items-center justify-center gap-12 animate-fade-in" 
            style={{ animationDelay: "0.4s" }}
          >
            <div className="group flex items-center gap-3 cursor-default">
              <div className="infographic-circle w-12 h-12 hover-glow">
                <Target className="h-5 w-5 text-foreground/70 group-hover:text-foreground transition-colors" />
              </div>
              <div>
                <span className="text-lg font-mono text-foreground">98%</span>
                <span className="block text-xs text-muted-foreground uppercase tracking-wider">ATS Pass Rate</span>
              </div>
            </div>
            <div className="group flex items-center gap-3 cursor-default">
              <div className="infographic-circle w-12 h-12 hover-glow">
                <Zap className="h-5 w-5 text-foreground/70 group-hover:text-foreground transition-colors" />
              </div>
              <div>
                <span className="text-lg font-mono text-foreground">3min</span>
                <span className="block text-xs text-muted-foreground uppercase tracking-wider">Avg. Build Time</span>
              </div>
            </div>
            <div className="group flex items-center gap-3 cursor-default">
              <div className="infographic-circle w-12 h-12 hover-glow">
                <Shield className="h-5 w-5 text-foreground/70 group-hover:text-foreground transition-colors" />
              </div>
              <div>
                <span className="text-lg font-mono text-foreground">100%</span>
                <span className="block text-xs text-muted-foreground uppercase tracking-wider">Free Forever</span>
              </div>
            </div>
          </div>
        </div>

        {/* Abstract CV Preview */}
        <div 
          className="mt-24 max-w-3xl mx-auto animate-fade-in" 
          style={{ 
            animationDelay: "0.5s",
            transform: `translateY(${scrollY * 0.1}px) rotateX(${scrollY * 0.02}deg)`,
            opacity: Math.max(0, 1 - scrollY * 0.0015),
            perspective: '1000px'
          }}
        >
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-foreground/5 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative bg-card/80 backdrop-blur-sm rounded-xl border border-border p-8 hover-lift">
              <div className="grid grid-cols-12 gap-6">
                {/* Left column */}
                <div className="col-span-4 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-foreground/10 border border-border mx-auto" />
                  <div className="space-y-2">
                    <div className="h-2 bg-foreground/20 rounded w-full" />
                    <div className="h-2 bg-foreground/10 rounded w-3/4 mx-auto" />
                  </div>
                  <div className="h-px bg-border" />
                  <div className="space-y-2">
                    <div className="h-1.5 bg-foreground/10 rounded w-full" />
                    <div className="h-1.5 bg-foreground/10 rounded w-5/6" />
                    <div className="h-1.5 bg-foreground/10 rounded w-4/6" />
                  </div>
                </div>
                
                {/* Right column */}
                <div className="col-span-8 space-y-6">
                  <div className="space-y-2">
                    <div className="h-2 bg-foreground/30 rounded w-1/3" />
                    <div className="h-1.5 bg-foreground/10 rounded w-full" />
                    <div className="h-1.5 bg-foreground/10 rounded w-5/6" />
                    <div className="h-1.5 bg-foreground/10 rounded w-4/5" />
                  </div>
                  <div className="h-px bg-border" />
                  <div className="space-y-2">
                    <div className="h-2 bg-foreground/30 rounded w-1/4" />
                    <div className="h-1.5 bg-foreground/10 rounded w-full" />
                    <div className="h-1.5 bg-foreground/10 rounded w-11/12" />
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex gap-2 flex-wrap">
                    <div className="h-6 bg-foreground/10 rounded-full px-4 border border-border" />
                    <div className="h-6 bg-foreground/10 rounded-full px-6 border border-border" />
                    <div className="h-6 bg-foreground/10 rounded-full px-5 border border-border" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
