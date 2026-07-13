import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a valid recovery session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Listen for auth state changes (recovery link click)
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === "PASSWORD_RECOVERY") {
            setIsValidSession(true);
          }
        }
      );

      // If user already has a session (from clicking recovery link), allow reset
      if (session) {
        setIsValidSession(true);
      }
      
      setIsCheckingSession(false);

      return () => subscription.unsubscribe();
    };

    checkSession();
  }, []);

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are identical",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        toast({
          title: "Reset failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setIsSuccess(true);
        toast({
          title: "Password updated!",
          description: "Your password has been successfully reset",
        });
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!isValidSession) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="max-w-md w-full text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 border border-border/50 rounded-full">
              <Lock className="w-8 h-8 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-medium tracking-tight text-foreground mb-3">
              Invalid or Expired Link
            </h1>
            <p className="text-muted-foreground font-mono text-sm mb-6">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="font-mono text-xs uppercase tracking-wider"
            >
              Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="max-w-md w-full text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 border border-green-500/30 rounded-full bg-green-500/10">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-medium tracking-tight text-foreground mb-3">
              Password Reset Complete
            </h1>
            <p className="text-muted-foreground font-mono text-sm mb-6">
              Your password has been successfully updated. Redirecting you now...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-md w-full">
          {/* Card Container */}
          <div className="relative p-8 border border-border/30 rounded-lg bg-card/30 backdrop-blur-sm">
            {/* Corner Accents */}
            <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-foreground/10 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-foreground/10 rounded-bl-lg" />

            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-6 border border-border/50 rounded-full">
                <Lock className="w-5 h-5 text-foreground/70" />
              </div>
              <h1 className="text-xl font-medium tracking-tight text-foreground mb-2">
                Set New Password
              </h1>
              <p className="text-sm text-muted-foreground font-mono">
                Enter your new password below
              </p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  New Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12"
                />
                <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12"
                />
              </div>

              <Button
                onClick={handleResetPassword}
                disabled={isLoading}
                className="w-full h-12 font-mono text-xs uppercase tracking-wider"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
