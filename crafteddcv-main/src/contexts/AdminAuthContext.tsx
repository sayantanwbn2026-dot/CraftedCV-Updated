import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Editor" | "Analyst";
  avatar: string;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

async function hydrateAdminUser(session: Session | null): Promise<AdminUser | null> {
  if (!session?.user) return null;

  // Verify admin role server-side via RLS-protected user_roles table
  const { data: roles, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", session.user.id)
    .eq("role", "admin");

  if (error || !roles || roles.length === 0) return null;

  const email = session.user.email ?? "";
  const name =
    (session.user.user_metadata?.full_name as string | undefined) ??
    (session.user.user_metadata?.name as string | undefined) ??
    email.split("@")[0] ??
    "Admin";

  return {
    id: session.user.id,
    name,
    email,
    role: "Super Admin",
    avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(session.user.id)}`,
  };
}

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // Defer async work to avoid deadlock in the auth callback
      setTimeout(async () => {
        const adminUser = await hydrateAdminUser(session);
        if (!mounted) return;
        setUser(adminUser);
        setIsLoading(false);
      }, 0);
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const adminUser = await hydrateAdminUser(session);
      if (!mounted) return;
      setUser(adminUser);
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error || !data.session) {
        toast.error(error?.message ?? "Invalid email or password");
        throw error ?? new Error("Invalid credentials");
      }

      const adminUser = await hydrateAdminUser(data.session);
      if (!adminUser) {
        await supabase.auth.signOut();
        toast.error("This account does not have admin access.");
        throw new Error("Not an admin");
      }

      setUser(adminUser);
      toast.success("Logged in successfully");
      navigate("/admin/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout: handleLogout,
        isLoading,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};
