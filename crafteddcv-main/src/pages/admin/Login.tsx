import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const { login } = useAdminAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoggingIn(true);
        try {
            await login(email, password);
        } catch (error) {
            // Error handled in context
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleForgotPassword = () => {
        toast.info("Password reset instructions sent to your email.");
    };

    return (
        <div className="flex h-screen items-center justify-center bg-[#0F1117] px-4 font-sans text-white">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-[#1A1D24] p-8 shadow-2xl border border-gray-800">
                <div className="text-center">
                    <img src={logo} alt="CraftedCV Logo" className="mx-auto h-12 w-auto mb-4 brightness-0 invert" />
                    <h2 className="text-3xl font-bold tracking-tight text-white">
                        Admin Portal
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Sign in to access the CMS Dashboard
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 bg-[#0F1117] border-gray-700 text-white focus:ring-primary focus:border-primary placeholder:text-gray-600"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-gray-300">Password</Label>
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    className="text-sm font-medium text-primary hover:text-primary/80"
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 bg-[#0F1117] border-gray-700 text-white focus:ring-primary focus:border-primary placeholder:text-gray-600"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <Checkbox id="remember-me" className="border-gray-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                        <Label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                            Remember me
                        </Label>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-white transition-colors"
                        disabled={isLoggingIn}
                    >
                        {isLoggingIn ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
