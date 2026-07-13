import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, Loader2, FileUp, AlertCircle } from "lucide-react";
import { useCVImport } from "@/hooks/useCVImport";
import type { CVFormData } from "@/components/cv-templates/types";

interface CVImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (data: CVFormData) => void;
}

export function CVImportDialog({ open, onOpenChange, onImport }: CVImportDialogProps) {
  const [activeTab, setActiveTab] = useState<"file" | "text">("file");
  const [textInput, setTextInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { importFromFile, importFromText, isImporting } = useCVImport();

  const handleFileSelect = (file: File) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "text/plain"];
    if (allowedTypes.includes(file.type)) {
      setSelectedFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    let result: CVFormData | null = null;

    if (activeTab === "file" && selectedFile) {
      result = await importFromFile(selectedFile);
    } else if (activeTab === "text" && textInput.trim()) {
      result = await importFromText(textInput);
    }

    if (result) {
      onImport(result);
      onOpenChange(false);
      // Reset state
      setSelectedFile(null);
      setTextInput("");
    }
  };

  const canImport = activeTab === "file" ? !!selectedFile : !!textInput.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Existing CV
          </DialogTitle>
          <DialogDescription>
            Upload a PDF, image, or paste text from your existing CV to pre-fill the form.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "file" | "text")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file" className="flex items-center gap-2">
              <FileUp className="h-4 w-4" />
              Upload File
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Paste Text
            </TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="mt-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : selectedFile
                  ? "border-primary/50 bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="space-y-2">
                  <FileText className="h-10 w-10 mx-auto text-primary" />
                  <p className="font-medium text-foreground">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">
                      Drag and drop your CV here
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      or click to browse
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Browse Files
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Supports PDF, JPG, PNG, TXT (max 5MB)
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </TabsContent>

          <TabsContent value="text" className="mt-4">
            <div className="space-y-3">
              <Textarea
                placeholder="Paste your CV text here...

Example:
John Doe
john@example.com | +1 234 567 890 | New York, NY

PROFESSIONAL SUMMARY
Experienced software engineer with 5+ years...

EXPERIENCE
Senior Developer at Tech Corp (2020 - Present)
- Led development of key features..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                rows={10}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Paste the full text content of your CV. Our AI will extract and organize the information.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg text-sm">
          <AlertCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <p className="text-muted-foreground">
            AI will extract information from your CV. Review and edit the results as needed.
          </p>
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!canImport || isImporting}
          >
            {isImporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Import CV
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
