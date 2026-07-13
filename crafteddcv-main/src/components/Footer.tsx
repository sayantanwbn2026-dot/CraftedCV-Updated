import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-12 relative overflow-hidden">
      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Crafted CV" className="h-6 w-auto brightness-0 invert opacity-70" />
              <span className="text-lg font-medium tracking-tight">
                Crafted<span className="text-muted-foreground">CV</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Precision-engineered resumes for the modern job market.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/builder" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                  CV Builder
                </Link>
              </li>
              <li>
                <Link to="/templates" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                  Templates
                </Link>
              </li>
              <li>
                <Link to="/ats-checker" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                  ATS Checker
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-xs font-mono">
            © {new Date().getFullYear()} CRAFTED CV
          </p>
          <div className="flex items-center gap-6">
            <div className="w-1.5 h-1.5 rounded-full bg-foreground/30" />
            <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Built with precision</span>
            <div className="w-1.5 h-1.5 rounded-full bg-foreground/30" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
