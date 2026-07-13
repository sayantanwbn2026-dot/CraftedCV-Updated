import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { 
  FileText, 
  Download, 
  Eye, 
  Plus,
  Target,
  Zap,
  User
} from "lucide-react";
import Navbar from "@/components/Navbar";
import UserProfileCard from "@/components/dashboard/UserProfileCard";
import CVDraftsSection from "@/components/dashboard/CVDraftsSection";
import { useCVDrafts } from "@/hooks/useCVDrafts";

const Dashboard = () => {
  const { user } = useAuth();
  const { drafts } = useCVDrafts();

  const stats = [
    { 
      label: "CVs Created", 
      value: drafts.length.toString(), 
      icon: FileText,
      trend: drafts.length > 0 ? `${drafts.length} saved` : "+0%",
      description: "Total resumes"
    },
    { 
      label: "Downloads", 
      value: "0", 
      icon: Download,
      trend: "+0%",
      description: "PDF exports"
    },
    { 
      label: "Views", 
      value: "0", 
      icon: Eye,
      trend: "+0%",
      description: "Profile views"
    },
    { 
      label: "ATS Score", 
      value: "—", 
      icon: Target,
      trend: "N/A",
      description: "Average score"
    },
  ];

  const quickActions = [
    { 
      label: "Create New CV", 
      href: "/builder", 
      icon: Plus,
      description: "Start from scratch"
    },
    { 
      label: "Browse Templates", 
      href: "/templates", 
      icon: FileText,
      description: "8 professional designs"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-foreground/[0.02] rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-foreground/[0.01] rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Welcome Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-border/50 rounded-full mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                Dashboard Active
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground mb-3">
              Welcome back
              {user?.email && (
                <span className="text-muted-foreground">, {user.email.split('@')[0]}</span>
              )}
            </h1>
            <p className="text-muted-foreground font-mono text-sm max-w-xl">
              Your career command center. Create, analyze, and optimize your professional profile.
            </p>
          </div>

          {/* Stats Grid - Infographic Style */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="group relative p-6 border border-border/30 rounded-lg bg-card/30 backdrop-blur-sm hover:border-foreground/20 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-foreground/10 rounded-tr-lg" />
                
                {/* Icon */}
                <div className="w-10 h-10 flex items-center justify-center border border-border/50 rounded-lg mb-4 group-hover:border-foreground/30 transition-colors">
                  <stat.icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>

                {/* Value */}
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl font-medium text-foreground tracking-tight">
                    {stat.value}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {stat.trend}
                  </span>
                </div>

                {/* Label */}
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </p>
                
                {/* Description */}
                <p className="text-xs text-muted-foreground/60 mt-1">
                  {stat.description}
                </p>

                {/* Decorative Line */}
                <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-4 h-4 text-muted-foreground" />
              <h2 className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                Quick Actions
              </h2>
              <div className="flex-1 h-px bg-border/30" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  to={action.href}
                  className="group relative p-6 border border-border/30 rounded-lg bg-card/30 backdrop-blur-sm hover:border-foreground/30 hover:bg-card/50 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 flex items-center justify-center border border-border/50 rounded-lg group-hover:border-foreground/30 group-hover:bg-foreground/5 transition-all">
                      <action.icon className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-foreground mb-1 group-hover:text-foreground transition-colors">
                        {action.label}
                      </h3>
                      <p className="font-mono text-xs text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                    <div className="w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-foreground/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </Link>
              ))}
            </div>
          </div>

          {/* CV Drafts Section */}
          <div className="mb-12">
            <CVDraftsSection />
          </div>

          {/* User Profile Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-4 h-4 text-muted-foreground" />
              <h2 className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                Your Profile
              </h2>
              <div className="flex-1 h-px bg-border/30" />
            </div>

            <UserProfileCard />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
