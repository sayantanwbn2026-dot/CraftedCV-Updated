import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Loader2, Mail, Phone, ArrowLeft } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type AuthMode = "options" | "email-signin" | "email-signup" | "phone-signin" | "phone-verify" | "forgot-password";

const AuthDialog = ({ open, onOpenChange }: AuthDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("options");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const { toast } = useToast();

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setPhone("");
    setOtp("");
    setAuthMode("options");
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // Use Supabase's native Google OAuth so the flow works on any host
      // (localhost, Vercel, etc.). The previous Lovable broker redirected to
      // "/~oauth/initiate", a route that only exists on Lovable's own hosting
      // and 404s everywhere else.
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        toast({
          title: "Authentication failed",
          description: error.message ?? "Please try again",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // On success the browser navigates to Google's consent screen; the
      // session is picked up automatically on redirect back (detectSessionInUrl).
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async () => {
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in",
        });
        onOpenChange(false);
        resetForm();
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

  const handleEmailSignUp = async () => {
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please enter both email and password",
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

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast({
            title: "Account exists",
            description: "This email is already registered. Try signing in instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Sign up failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Account created!",
          description: "You have been signed in automatically",
        });
        onOpenChange(false);
        resetForm();
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

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Missing email",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: "Reset failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Check your email",
          description: "We've sent you a password reset link",
        });
        onOpenChange(false);
        resetForm();
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

  const handlePhoneSignIn = async () => {
    if (!phone) {
      toast({
        title: "Missing phone number",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return;
    }

    const formattedPhone = phone.trim().replace(/[\s().-]/g, "").startsWith("+")
      ? phone.trim().replace(/[\s().-]/g, "")
      : `+${phone.trim().replace(/[\s().-]/g, "")}`;

    if (!/^\+[1-9]\d{7,14}$/.test(formattedPhone)) {
      toast({
        title: "Invalid phone number",
        description: "Use international format, for example +917980920710",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("phone-auth", {
        body: { action: "send_code", phone: formattedPhone },
      });

      if (error || data?.error) {
        toast({
          title: "Failed to send code",
          description: data?.error || error?.message || "Please try again",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Code sent!",
          description: "Check your phone for the verification code",
        });
        setPhone(formattedPhone);
        setAuthMode("phone-verify");
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

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter the 6-digit code",
        variant: "destructive",
      });
      return;
    }

    const formattedPhone = phone.trim().replace(/[\s().-]/g, "").startsWith("+")
      ? phone.trim().replace(/[\s().-]/g, "")
      : `+${phone.trim().replace(/[\s().-]/g, "")}`;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("phone-auth", {
        body: { action: "verify_code", phone: formattedPhone, code: otp },
      });

      if (error || data?.error || !data?.session) {
        toast({
          title: "Verification failed",
          description: data?.error || error?.message || "Please request a new code",
          variant: "destructive",
        });
      } else {
        const { error: sessionError } = await supabase.auth.setSession(data.session);
        if (sessionError) {
          toast({
            title: "Session failed",
            description: sessionError.message,
            variant: "destructive",
          });
          return;
        }
        toast({
          title: "Welcome!",
          description: "You have successfully signed in",
        });
        onOpenChange(false);
        resetForm();
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

  const renderBackButton = () => (
    <button
      onClick={() => setAuthMode("options")}
      className="absolute top-4 left-4 p-2 text-muted-foreground hover:text-foreground transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
    </button>
  );

  const getDialogTitle = () => {
    switch (authMode) {
      case "options": return "Welcome";
      case "email-signin": return "Sign In";
      case "email-signup": return "Create Account";
      case "phone-signin": return "Phone Sign In";
      case "phone-verify": return "Verify Code";
      case "forgot-password": return "Reset Password";
      default: return "Authentication";
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogContent className="sm:max-w-md bg-background border-border/30 p-0 overflow-hidden" aria-describedby={undefined}>
        <VisuallyHidden>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </VisuallyHidden>
        
        {/* Minimalist geometric decoration */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
        
        <div className="p-8 sm:p-10 relative">
          {authMode !== "options" && renderBackButton()}

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-6 border border-border/50 rounded-full">
              <div className="w-2 h-2 bg-foreground rounded-full" />
            </div>
            <h2 className="text-xl font-medium tracking-tight text-foreground mb-2">
              {getDialogTitle()}
            </h2>
            <p className="text-sm text-muted-foreground font-mono">
              {authMode === "options" && "Choose how to continue"}
              {authMode === "email-signin" && "Enter your credentials"}
              {authMode === "email-signup" && "Create a new account"}
              {authMode === "phone-signin" && "We'll send you a code"}
              {authMode === "phone-verify" && "Enter the 6-digit code"}
              {authMode === "forgot-password" && "We'll send you a reset link"}
            </p>
          </div>

          {/* Options View */}
          {authMode === "options" && (
            <div className="space-y-3">
              {/* Google Sign In */}
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full h-12 border border-border/50 rounded-lg hover:border-foreground/30 hover:bg-foreground/5 font-mono text-xs uppercase tracking-wider text-foreground/80 hover:text-foreground transition-all group relative overflow-hidden flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>

              {/* Email Sign In */}
              <button
                onClick={() => setAuthMode("email-signin")}
                className="w-full h-12 border border-border/50 rounded-lg hover:border-foreground/30 hover:bg-foreground/5 font-mono text-xs uppercase tracking-wider text-foreground/80 hover:text-foreground transition-all group relative overflow-hidden flex items-center justify-center"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <Mail className="w-4 h-4 mr-3" />
                Continue with Email
              </button>

              {/* Phone Sign In */}
              <button
                onClick={() => setAuthMode("phone-signin")}
                className="w-full h-12 border border-border/50 rounded-lg hover:border-foreground/30 hover:bg-foreground/5 font-mono text-xs uppercase tracking-wider text-foreground/80 hover:text-foreground transition-all group relative overflow-hidden flex items-center justify-center"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <Phone className="w-4 h-4 mr-3" />
                Continue with Phone
              </button>
            </div>
          )}

          {/* Email Sign In View */}
          {authMode === "email-signin" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12"
                />
              </div>
              <Button
                onClick={handleEmailSignIn}
                disabled={isLoading}
                className="w-full h-12 font-mono text-xs uppercase tracking-wider"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
              </Button>
              <div className="flex flex-col gap-2 text-center">
                <p className="text-xs text-muted-foreground">
                  Don't have an account?{" "}
                  <button
                    onClick={() => setAuthMode("email-signup")}
                    className="text-foreground hover:underline"
                  >
                    Sign up
                  </button>
                </p>
                <button
                  onClick={() => setAuthMode("forgot-password")}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            </div>
          )}

          {/* Forgot Password View */}
          {authMode === "forgot-password" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Email
                </Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                />
              </div>
              <Button
                onClick={handleForgotPassword}
                disabled={isLoading}
                className="w-full h-12 font-mono text-xs uppercase tracking-wider"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Reset Link"}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Remember your password?{" "}
                <button
                  onClick={() => setAuthMode("email-signin")}
                  className="text-foreground hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          )}

          {/* Email Sign Up View */}
          {authMode === "email-signup" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Email
                </Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Password
                </Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12"
                />
                <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
              </div>
              <Button
                onClick={handleEmailSignUp}
                disabled={isLoading}
                className="w-full h-12 font-mono text-xs uppercase tracking-wider"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Already have an account?{" "}
                <button
                  onClick={() => setAuthMode("email-signin")}
                  className="text-foreground hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          )}

          {/* Phone Sign In View */}
          {authMode === "phone-signin" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12"
                />
                <p className="text-xs text-muted-foreground">Include country code (e.g., +1 for US)</p>
              </div>
              <Button
                onClick={handlePhoneSignIn}
                disabled={isLoading}
                className="w-full h-12 font-mono text-xs uppercase tracking-wider"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Code"}
              </Button>
            </div>
          )}

          {/* Phone Verify View */}
          {authMode === "phone-verify" && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button
                onClick={handleVerifyOTP}
                disabled={isLoading || otp.length !== 6}
                className="w-full h-12 font-mono text-xs uppercase tracking-wider"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Didn't receive the code?{" "}
                <button
                  onClick={handlePhoneSignIn}
                  disabled={isLoading}
                  className="text-foreground hover:underline"
                >
                  Resend
                </button>
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-border/30">
            <p className="text-center text-xs text-muted-foreground/60 font-mono">
              By continuing, you agree to our Terms of Service
            </p>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
