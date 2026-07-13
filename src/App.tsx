import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import ScrollToTop from "@/components/ScrollToTop";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import AuthGuard from "@/components/admin/AuthGuard";
import Index from "./pages/Index";

// Route-level code splitting: keep the landing page (Index) in the main bundle
// for a fast first paint, and lazy-load everything else so the heavy CV
// template library and the admin panel are only fetched when needed.
const CVBuilder = lazy(() => import("./pages/CVBuilder"));
const Templates = lazy(() => import("./pages/Templates"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ATSChecker = lazy(() => import("./pages/ATSChecker"));
const CareerStudio = lazy(() => import("./pages/CareerStudio"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const About = lazy(() => import("./pages/About"));
const InfoPage = lazy(() => import("./pages/InfoPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AdminLayout = lazy(() => import("@/components/admin/AdminLayout"));
const AdminLogin = lazy(() => import("@/pages/admin/Login"));
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const UsersManager = lazy(() => import("@/pages/admin/UsersManager"));
const ResumeTemplates = lazy(() => import("@/pages/admin/ResumeTemplates"));
const PagesManager = lazy(() => import("@/pages/admin/PagesManager"));
const PageEditor = lazy(() => import("@/pages/admin/PageEditor"));
const GlobalSettings = lazy(() => import("@/pages/admin/GlobalSettings"));
const MediaLibrary = lazy(() => import("@/pages/admin/MediaLibrary"));
const SeoManager = lazy(() => import("@/pages/admin/SeoManager"));
const Analytics = lazy(() => import("@/pages/admin/Analytics"));
const Demographics = lazy(() => import("@/pages/admin/Demographics"));
const EmailTemplates = lazy(() => import("@/pages/admin/EmailTemplates"));
const AuditLog = lazy(() => import("@/pages/admin/AuditLog"));
const AdminsManager = lazy(() => import("@/pages/admin/AdminsManager"));
const AIPromptsManager = lazy(() => import("@/pages/admin/AIPromptsManager"));
const ComingSoon = lazy(() => import("@/pages/admin/ComingSoon"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="crafted-cv-theme">
      <BrowserRouter>
        <AdminAuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <ScrollToTop />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/builder" element={<CVBuilder />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/ats-checker" element={<ATSChecker />} />
                <Route path="/career-studio" element={<CareerStudio />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/about" element={<About />} />
                <Route path="/pricing" element={
                  <InfoPage
                    eyebrow="Pricing"
                    title="Simple, transparent pricing"
                    description="Crafted CV is currently free to use while in beta. Build, optimize, and export your resume at no cost. Detailed plans are on the way."
                  />
                } />
                <Route path="/contact" element={
                  <InfoPage
                    eyebrow="Contact"
                    title="Get in touch"
                    description="Questions, feedback, or partnership ideas? We'd love to hear from you. A dedicated contact form is coming soon — in the meantime, reach out through our social channels."
                  />
                } />
                <Route path="/privacy" element={
                  <InfoPage
                    eyebrow="Legal"
                    title="Privacy Policy"
                    description="We take your privacy seriously. Your resume data is yours. Our full privacy policy is being finalized and will be published here shortly."
                  />
                } />
                <Route path="/terms" element={
                  <InfoPage
                    eyebrow="Legal"
                    title="Terms of Service"
                    description="Our terms of service are being finalized and will be published here shortly. By using Crafted CV you agree to use the service responsibly."
                  />
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />

                {/* ADMIN ROUTES */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AuthGuard />}>
                  <Route element={<AdminLayout />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="users" element={<UsersManager />} />
                    <Route path="resume-templates" element={<ResumeTemplates />} />
                    <Route path="pages" element={<PagesManager />} />
                    <Route path="pages/:pageId/edit" element={<PageEditor />} />
                    <Route path="settings/global" element={<GlobalSettings />} />
                    <Route path="settings/ai-prompts" element={<AIPromptsManager />} />
                    <Route path="media" element={<MediaLibrary />} />
                    <Route path="seo" element={<SeoManager />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="analytics/demographics" element={<Demographics />} />
                    <Route path="emails" element={<EmailTemplates />} />
                    <Route path="audit-log" element={<AuditLog />} />
                    <Route path="admins" element={<AdminsManager />} />
                    {/* Sections linked in the sidebar that are not yet built */}
                    <Route path="generated-resumes" element={<ComingSoon />} />
                    <Route path="users/subscriptions" element={<ComingSoon />} />
                    <Route path="users/feedback" element={<ComingSoon />} />
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    {/* Any other unmatched admin path stays inside the admin shell */}
                    <Route path="*" element={<ComingSoon />} />
                  </Route>
                </Route>

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<Navigate to="/not-found" replace />} />
                <Route path="/not-found" element={<NotFound />} />
              </Routes>
            </Suspense>
          </TooltipProvider>
        </AdminAuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
