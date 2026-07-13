import { Link } from "react-router-dom";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import CVDraftCard from "./CVDraftCard";
import { useCVDrafts } from "@/hooks/useCVDrafts";

const CVDraftsSection = () => {
  const { drafts, loading, deleteDraft, renameDraft, duplicateDraft } = useCVDrafts();

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
            Your CVs
          </h2>
          <div className="flex-1 h-px bg-border/30" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-4 h-4 text-muted-foreground" />
        <h2 className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
          Your CVs
        </h2>
        <div className="flex-1 h-px bg-border/30" />
        <Button asChild variant="outline" size="sm" className="font-mono text-xs uppercase tracking-wider">
          <Link to="/builder">
            <Plus className="w-3 h-3 mr-2" />
            New CV
          </Link>
        </Button>
      </div>

      {drafts.length === 0 ? (
        <div className="relative p-12 border border-border/30 rounded-lg bg-card/30 backdrop-blur-sm text-center">
          <div className="w-16 h-16 mx-auto mb-6 border border-border/50 rounded-full flex items-center justify-center">
            <FileText className="w-8 h-8 text-muted-foreground/50" />
          </div>
          
          <h3 className="text-lg font-medium text-foreground mb-2">
            No CVs yet
          </h3>
          <p className="text-muted-foreground font-mono text-sm mb-6 max-w-md mx-auto">
            Create your first CV to start building your professional profile.
          </p>
          
          <Button asChild variant="outline" className="font-mono text-xs uppercase tracking-wider">
            <Link to="/builder">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First CV
            </Link>
          </Button>

          {/* Corner Decorations */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l border-t border-border/30" />
          <div className="absolute top-4 right-4 w-8 h-8 border-r border-t border-border/30" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l border-b border-border/30" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r border-b border-border/30" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {drafts.map((draft) => (
            <CVDraftCard
              key={draft.id}
              draft={draft}
              onDelete={deleteDraft}
              onRename={renameDraft}
              onDuplicate={duplicateDraft}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CVDraftsSection;
