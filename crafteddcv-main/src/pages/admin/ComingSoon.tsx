import { Link, useLocation } from "react-router-dom";
import { Construction, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const ComingSoon = () => {
    const location = useLocation();

    // Derive a readable title from the last path segment
    const segment = location.pathname.split("/").filter(Boolean).pop() || "page";
    const title = segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center animate-in fade-in duration-500">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Construction size={32} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                {title}
            </h1>
            <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
                This section is under construction and will be available soon. The rest of the
                dashboard is fully functional.
            </p>
            <Button asChild variant="outline" className="mt-6 gap-2">
                <Link to="/admin/dashboard">
                    <ArrowLeft size={16} />
                    Back to Dashboard
                </Link>
            </Button>
        </div>
    );
};

export default ComingSoon;
