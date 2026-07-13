import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import logo from "@/assets/logo.png";
import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import AuthDialog from "@/components/AuthDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const { profile } = useProfile();

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'User';

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img src={logo} alt="Crafted CV" className="h-7 w-auto brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity" />
              <span className="text-lg font-medium tracking-tight text-foreground/90 group-hover:text-foreground transition-colors">
                Crafted<span className="text-foreground/60">CV</span>
              </span>
            </Link>

            {/* Desktop Navigation - Center aligned */}
            <div className="hidden md:flex items-center justify-center flex-1 gap-8">
              <Link to="/templates" className="text-sm font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors relative group">
                Templates
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground group-hover:w-full transition-all duration-300" />
              </Link>
              <Link to="/builder" className="text-sm font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors relative group">
                Builder
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground group-hover:w-full transition-all duration-300" />
              </Link>
              <Link to="/ats-checker" className="text-sm font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors relative group">
                ATS Checker
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground group-hover:w-full transition-all duration-300" />
              </Link>
              <Link to="/career-studio" className="text-sm font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors relative group">
                Career Studio
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground group-hover:w-full transition-all duration-300" />
              </Link>
              {user && (
                <Link to="/dashboard" className="text-sm font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors relative group">
                  Dashboard
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground group-hover:w-full transition-all duration-300" />
                </Link>
              )}
            </div>

            {/* Auth Button - Right aligned */}
            <div className="hidden md:flex items-center">
              {loading ? (
                <div className="w-8 h-8 rounded-full border border-border/50 animate-pulse" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-md border border-border/50 hover:border-foreground/30 hover:bg-foreground/5 hover:shadow-glow-white transition-all group">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={profile?.avatar_url || undefined} alt={displayName} />
                        <AvatarFallback className="text-xs bg-foreground/10">
                          {displayName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                        {displayName}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-background border-border/50">
                    <DropdownMenuItem 
                      onClick={signOut}
                      className="font-mono text-xs uppercase tracking-wider cursor-pointer"
                    >
                      <LogOut className="w-3 h-3 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  onClick={() => setAuthDialogOpen(true)}
                  variant="outline" 
                  className="font-mono text-xs uppercase tracking-wider hover:shadow-glow-white"
                >
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                className="p-2 text-foreground/70 hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-6 border-t border-border/50 animate-fade-in">
              <div className="flex flex-col gap-6">
                <Link to="/templates" className="text-sm font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                  Templates
                </Link>
                <Link to="/builder" className="text-sm font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                  Builder
                </Link>
                <Link to="/ats-checker" className="text-sm font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                  ATS Checker
                </Link>
                <Link to="/career-studio" className="text-sm font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                  Career Studio
                </Link>
                {user && (
                  <Link to="/dashboard" className="text-sm font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                    Dashboard
                  </Link>
                )}
                <div className="pt-4 border-t border-border/50">
                  {user ? (
                    <Button 
                      onClick={signOut}
                      variant="ghost" 
                      className="w-full font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
                    >
                      <LogOut className="w-3 h-3 mr-2" />
                      Sign Out
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => setAuthDialogOpen(true)}
                      variant="ghost" 
                      className="w-full font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
                    >
                      Sign In
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
};

export default Navbar;
