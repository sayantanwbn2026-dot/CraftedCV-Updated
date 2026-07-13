import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Github, Linkedin, Mail, Code2, Brain, Palette } from "lucide-react";

const team = [
  {
    name: "Sayantan Mukherjee",
    role: "Full-Stack Developer & Project Lead",
    icon: Code2,
    responsibilities: [
      "System Architecture & Database Design",
      "AI Integration & Edge Functions",
      "CV Builder Core Engine",
      "Backend API Development",
    ],
    description:
      "Spearheaded the overall architecture of CraftedCV, designing the data pipelines, Supabase backend, and AI-powered content generation system. Led the team through planning sprints and technical decision-making.",
    initials: "SM",
  },
  {
    name: "Hrishit Mukherjee",
    role: "Frontend Engineer & UI Systems",
    icon: Palette,
    responsibilities: [
      "Design System & UI Components",
      "CV Template Engineering",
      "Animation & Motion Design",
      "ATS Score Visualisation",
    ],
    description:
      "Crafted the monochrome design language and built all 24 CV templates with strict ATS-compliance requirements. Responsible for the scroll animations, template preview dialog, and overall visual cohesion.",
    initials: "HM",
  },
  {
    name: "Prattoy Ghosh",
    role: "AI & Integrations Engineer",
    icon: Brain,
    responsibilities: [
      "ATS Analysis Algorithm",
      "AI Prompt Engineering",
      "PDF Export Pipeline",
      "CV Import & Parsing",
    ],
    description:
      "Built the ATS scoring engine and prompt-tuned the AI models for tailored CV content generation. Developed the PDF export pipeline and CV import/parsing system that allows users to migrate existing resumes.",
    initials: "PG",
  },
];

const timeline = [
  {
    phase: "01",
    title: "Research & Planning",
    duration: "Week 1–2",
    description:
      "Conducted market research on ATS systems, resume best practices, and AI content generation. Defined project scope, user stories, and technical stack.",
  },
  {
    phase: "02",
    title: "Architecture & Design",
    duration: "Week 3–4",
    description:
      "Designed the database schema, API contracts, and component hierarchy. Established the monochrome design system and built the initial UI foundation.",
  },
  {
    phase: "03",
    title: "Core Development",
    duration: "Week 5–9",
    description:
      "Built the CV Builder with multi-step form, AI generation hooks, 24 ATS-optimised templates, and the Supabase backend for authentication and draft saving.",
  },
  {
    phase: "04",
    title: "AI & ATS Integration",
    duration: "Week 10–12",
    description:
      "Integrated Gemini AI for professional summary generation, engineered ATS scoring algorithms, and fine-tuned prompts for role-specific tailoring.",
  },
  {
    phase: "05",
    title: "Polish & Launch",
    duration: "Week 13–14",
    description:
      "Added PDF export, CV import parsing, template preview dialogs, scroll animations, and conducted end-to-end testing across all features.",
  },
];

const stats = [
  { value: "24", label: "ATS Templates" },
  { value: "6", label: "Core Features" },
  { value: "3", label: "Engineers" },
  { value: "14", label: "Weeks Built" },
];

const About = () => {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: missionRef, isVisible: missionVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: teamHeaderRef, isVisible: teamHeaderVisible } = useScrollAnimation();
  const { ref: timelineHeaderRef, isVisible: timelineHeaderVisible } = useScrollAnimation();
  const { ref: timelineRef, isVisible: timelineVisible } = useScrollAnimation({ threshold: 0.05 });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        {/* Hero */}
        <section className="py-28 relative overflow-hidden noise-overlay">
          <div className="absolute inset-0 grid-pattern opacity-20" />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, hsl(0 0% 30%) 0%, transparent 70%)" }}
          />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div
              ref={heroRef}
              className={`text-center max-w-3xl mx-auto scroll-animate ${heroVisible ? "visible" : ""}`}
            >
              <span className="inline-block font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6 border border-border px-4 py-2 rounded-full">
                Final Year Group Project
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-medium tracking-tight mb-6 leading-tight">
                <span className="text-gradient block">Built by Students.</span>
                <span className="text-foreground/90">Engineered for Careers.</span>
              </h1>
              <div className="w-20 h-px bg-gradient-to-r from-transparent via-foreground/30 to-transparent mx-auto mb-8" />
              <p className="text-muted-foreground text-lg leading-relaxed">
                CraftedCV is an ambitious final year computer science group project — a full-stack, AI-powered resume
                builder designed to help students and professionals navigate modern ATS hiring systems.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 border-y border-border/50 bg-card/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div
              ref={statsRef}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`text-center scroll-animate ${statsVisible ? "visible" : ""} stagger-${i + 1}`}
                >
                  <span className="text-4xl font-mono font-medium text-foreground block">{stat.value}</span>
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground mt-2 block">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-24 relative overflow-hidden noise-overlay">
          <div className="absolute inset-0 grid-pattern opacity-10" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div
              ref={missionRef}
              className={`max-w-3xl mx-auto scroll-animate ${missionVisible ? "visible" : ""}`}
            >
              <span className="inline-block font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 border border-border px-4 py-2 rounded-full">
                Our Mission
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-foreground mt-6 mb-6 tracking-tight">
                Why We Built This
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  As final-year computer science students, we experienced firsthand how frustrating the job application
                  process can be. Tailoring resumes for every role, passing automated ATS screening systems, and
                  presenting professional content without design expertise — it's a full-time job in itself.
                </p>
                <p>
                  We set out to solve this with CraftedCV: a tool that combines AI-powered content generation, strict
                  ATS optimisation across 24 professional templates, and a clean builder interface anyone can use in
                  under three minutes.
                </p>
                <p>
                  This project represents our collective expertise in full-stack development, AI integration, and
                  systems design — a culmination of everything we've learned across our degree.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-24 bg-card/20 relative overflow-hidden noise-overlay">
          <div className="absolute inset-0 grid-pattern opacity-10" />
          {/* Vertical lines */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-border/50 to-transparent" />
            <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-border/50 to-transparent" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div
              ref={teamHeaderRef}
              className={`text-center max-w-xl mx-auto mb-16 scroll-animate ${teamHeaderVisible ? "visible" : ""}`}
            >
              <span className="inline-block font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 border border-border px-4 py-2 rounded-full">
                The Team
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-foreground mt-6 mb-4 tracking-tight">
                Three Engineers. One Vision.
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-foreground/30 to-transparent mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {team.map((member, index) => (
                <div
                  key={member.name}
                  className={`group p-8 rounded-xl bg-card/50 border border-border/50 hover:border-foreground/20 hover-lift scroll-animate ${teamHeaderVisible ? "visible" : ""} stagger-${index + 1}`}
                >
                  {/* Avatar placeholder */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full bg-card border-2 border-border/70 group-hover:border-foreground/30 transition-colors flex items-center justify-center mx-auto overflow-hidden relative">
                      {/* Placeholder image area */}
                      <div className="absolute inset-0 grid-pattern opacity-30" />
                      <div className="relative z-10 flex flex-col items-center justify-center">
                        <span className="text-xl font-mono font-medium text-foreground/50 group-hover:text-foreground/80 transition-colors">
                          {member.initials}
                        </span>
                      </div>
                    </div>
                    <div className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center">
                      <member.icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-medium text-foreground mb-1">{member.name}</h3>
                    <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{member.role}</p>
                  </div>

                  <div className="h-px bg-border/50 mb-6" />

                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">{member.description}</p>

                  {/* Responsibilities */}
                  <ul className="space-y-2">
                    {member.responsibilities.map((r) => (
                      <li key={r} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <div className="w-1 h-1 rounded-full bg-foreground/30 mt-1.5 flex-shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>

                  {/* Bottom hover line */}
                  <div className="mt-6 h-px bg-gradient-to-r from-foreground/10 via-foreground/20 to-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Development Timeline */}
        <section className="py-24 relative overflow-hidden noise-overlay">
          <div className="absolute inset-0 grid-pattern opacity-10" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div
              ref={timelineHeaderRef}
              className={`text-center max-w-xl mx-auto mb-16 scroll-animate ${timelineHeaderVisible ? "visible" : ""}`}
            >
              <span className="inline-block font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 border border-border px-4 py-2 rounded-full">
                Development Journey
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-foreground mt-6 mb-4 tracking-tight">
                How We Built It
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-foreground/30 to-transparent mx-auto" />
            </div>

            <div
              ref={timelineRef}
              className="max-w-3xl mx-auto relative"
            >
              {/* Vertical timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent" />

              <div className="space-y-8">
                {timeline.map((item, index) => (
                  <div
                    key={item.phase}
                    className={`relative flex gap-8 scroll-animate ${timelineVisible ? "visible" : ""} stagger-${index + 1}`}
                  >
                    {/* Phase dot */}
                    <div className="relative flex-shrink-0 w-16 h-16 rounded-full bg-card border border-border/70 flex items-center justify-center z-10 group-hover:border-foreground/30">
                      <span className="font-mono text-sm text-foreground/70">{item.phase}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-2 pt-3">
                      <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-medium text-foreground">{item.title}</h3>
                        <span className="font-mono text-xs text-muted-foreground border border-border/50 px-2 py-0.5 rounded-full">
                          {item.duration}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="py-16 border-t border-border/50 bg-card/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Technology Stack
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
              {[
                "React 18",
                "TypeScript",
                "Tailwind CSS",
                "Supabase",
                "Gemini AI",
                "Vite",
                "jsPDF",
                "Radix UI",
                "React Query",
                "Edge Functions",
              ].map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-xs uppercase tracking-wider text-muted-foreground border border-border/50 px-3 py-1.5 rounded-full hover:border-foreground/30 hover:text-foreground transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
