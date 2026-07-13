import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

interface InfoPageProps {
  eyebrow: string;
  title: string;
  description: string;
}

/**
 * On-brand placeholder for informational pages that are linked in the footer
 * (Pricing, Contact, Privacy, Terms) but whose full content is not finalized.
 * Keeps every navigation link functional instead of redirecting to a 404.
 */
const InfoPage = ({ eyebrow, title, description }: InfoPageProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {eyebrow}
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
            {description}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="outline" className="font-mono text-xs uppercase tracking-wider">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button asChild className="font-mono text-xs uppercase tracking-wider">
              <Link to="/builder">Start Building</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InfoPage;
