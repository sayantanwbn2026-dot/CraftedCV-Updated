import { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, MoreVertical, Pencil, Trash2, ExternalLink, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { CVDraft } from "@/hooks/useCVDrafts";

interface CVDraftCardProps {
  draft: CVDraft;
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onDuplicate: (id: string) => void;
}

const CVDraftCard = ({ draft, onDelete, onRename, onDuplicate }: CVDraftCardProps) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(draft.name);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleRename = () => {
    if (newName.trim() && newName !== draft.name) {
      onRename(draft.id, newName.trim());
    }
    setIsRenaming(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <div className="group relative p-4 border border-border/30 rounded-lg bg-card/30 backdrop-blur-sm hover:border-foreground/20 transition-all duration-300">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center border border-border/50 rounded-lg group-hover:border-foreground/30 transition-colors">
            <FileText className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {isRenaming ? (
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRename();
                  if (e.key === "Escape") {
                    setNewName(draft.name);
                    setIsRenaming(false);
                  }
                }}
                className="h-7 text-sm font-medium"
                autoFocus
              />
            ) : (
              <h3 className="text-sm font-medium text-foreground truncate">
                {draft.name}
              </h3>
            )}
            <p className="text-xs text-muted-foreground mt-1 font-mono">
              Updated {formatDate(draft.updated_at)}
            </p>
            <p className="text-xs text-muted-foreground/60 mt-0.5 font-mono capitalize">
              {draft.template_id.replace(/-/g, " ")}
            </p>
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem asChild>
                <Link to={`/builder?draft=${draft.id}`} className="cursor-pointer">
                  <ExternalLink className="w-3 h-3 mr-2" />
                  Open
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(draft.id)}>
                <Copy className="w-3 h-3 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsRenaming(true)}>
                <Pencil className="w-3 h-3 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-3 h-3 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Hover Effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-foreground/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete CV?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{draft.name}". This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(draft.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CVDraftCard;
