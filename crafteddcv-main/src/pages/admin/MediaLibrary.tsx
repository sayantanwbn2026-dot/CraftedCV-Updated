import React, { useState } from "react";
import { UploadCloud, Search, Check, Copy, Trash2, HardDrive, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Mock Media data
const initialMedia = [
    { id: 1, name: "hero-bg-2024.jpg", type: "image/jpeg", size: "2.4 MB", date: "Oct 12, 2023", url: "https://images.unsplash.com/photo-1542382121-6d744eb88c91?w=800&q=80", alt: "Modern desk setup" },
    { id: 2, name: "logo-dark.svg", type: "image/svg+xml", size: "45 KB", date: "Nov 05, 2023", url: "/logo.svg", alt: "CraftedCV Logo text" },
    { id: 3, name: "avatar-placeholder.png", type: "image/png", size: "120 KB", date: "Jan 22, 2024", url: "https://i.pravatar.cc/300", alt: "Avatar Placeholder" },
    { id: 4, name: "testimonial-1.jpg", type: "image/jpeg", size: "1.1 MB", date: "Feb 10, 2024", url: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&q=80", alt: "Happy customer" },
    { id: 5, name: "feature-icon-1.png", type: "image/png", size: "24 KB", date: "Feb 15, 2024", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&q=80", alt: "Feature abstract" },
];

const MediaLibrary = () => {
    const [media, setMedia] = useState(initialMedia);
    const [selectedFile, setSelectedFile] = useState<typeof initialMedia[0] | null>(null);

    const onDrop = React.useCallback((acceptedFiles: File[]) => {
        // Mock upload
        if (acceptedFiles.length > 0) {
            toast.success(`${acceptedFiles.length} file(s) uploaded successfully`);
            const newMedia = acceptedFiles.map((file, i) => ({
                id: Date.now() + i,
                name: file.name,
                type: file.type,
                size: (file.size / 1024 / 1024).toFixed(2) + " MB",
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                url: URL.createObjectURL(file), // create local preview
                alt: file.name.split('.')[0]
            }));
            setMedia([...newMedia, ...media]);
        }
    }, [media]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
    });

    const handleDelete = (id: number) => {
        setMedia(media.filter(m => m.id !== id));
        setSelectedFile(null);
        toast.success("File deleted successfully");
    };

    const handleCopy = (url: string) => {
        navigator.clipboard.writeText(url);
        toast.success("URL copied to clipboard");
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Media Library</h1>
                    <p className="text-gray-500 mt-1 dark:text-gray-400">Manage all images, icons, and uploads globally.</p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Search files..."
                            className="pl-9 w-full bg-white dark:bg-[#1A1D24] dark:border-gray-700"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row flex-1 gap-6 overflow-hidden">

                {/* Main Grid Area */}
                <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-[#1A1D24] rounded-xl border dark:border-gray-800 shadow-sm">

                    {/* Dropzone Top Bar */}
                    <div
                        {...getRootProps()}
                        className={`shrink-0 border-b dark:border-gray-800 p-6 flex items-center justify-center transition-colors cursor-pointer
              ${isDragActive ? "bg-primary/5 pb-10 pt-10 border-primary" : "bg-gray-50/50 dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-800"}
            `}
                    >
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center gap-2 pointer-events-none">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <UploadCloud size={20} />
                            </div>
                            <p className="text-sm font-medium dark:text-gray-300">
                                {isDragActive ? "Drop files here..." : "Click or drag files to upload"}
                            </p>
                        </div>
                    </div>

                    {/* Grid View */}
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                            {media.map((file) => (
                                <div
                                    key={file.id}
                                    onClick={() => setSelectedFile(file)}
                                    className={`group relative aspect-square rounded-lg border overflow-hidden cursor-pointer transition-all
                    ${selectedFile?.id === file.id ? "ring-2 ring-primary border-primary" : "border-gray-200 dark:border-gray-800 hover:border-primary/50"}
                  `}
                                >
                                    <img src={file.url} alt={file.alt} className="w-full h-full object-cover transition-transform group-hover:scale-105" />

                                    {/* File Info Overlay */}
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-xs font-medium text-white truncate">{file.name}</p>
                                        <p className="text-[10px] text-gray-300">{file.size}</p>
                                    </div>

                                    {selectedFile?.id === file.id && (
                                        <div className="absolute top-2 right-2 h-6 w-6 bg-primary rounded-full flex items-center justify-center text-white shadow-sm">
                                            <Check size={14} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Storage Footer */}
                    <div className="shrink-0 border-t dark:border-gray-800 p-4 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                            <HardDrive size={14} />
                            <span>Storage Used: 1.2 GB of 5 GB</span>
                        </div>
                        <div className="hidden sm:block w-48 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: '24%' }}></div>
                        </div>
                    </div>
                </div>

                {/* Sidebar details panel */}
                {selectedFile ? (
                    <div className="w-full lg:w-80 shrink-0 bg-white dark:bg-[#1A1D24] rounded-xl border dark:border-gray-800 p-6 flex flex-col custom-scrollbar overflow-y-auto">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">File Details</h3>

                        <div className="aspect-video w-full rounded-lg bg-gray-100 dark:bg-gray-900 border dark:border-gray-800 mb-6 flex items-center justify-center overflow-hidden">
                            <img src={selectedFile.url} alt={selectedFile.alt} className="max-w-full max-h-full object-contain" />
                        </div>

                        <div className="space-y-4 text-sm mb-8">
                            <div>
                                <Label className="text-gray-500 text-xs">Filename</Label>
                                <div className="font-medium text-gray-900 dark:text-gray-200 mt-1 break-all">{selectedFile.name}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-gray-500 text-xs">File Type</Label>
                                    <div className="font-medium text-gray-900 dark:text-gray-200 mt-1">{selectedFile.type}</div>
                                </div>
                                <div>
                                    <Label className="text-gray-500 text-xs">File Size</Label>
                                    <div className="font-medium text-gray-900 dark:text-gray-200 mt-1">{selectedFile.size}</div>
                                </div>
                            </div>
                            <div>
                                <Label className="text-gray-500 text-xs">Uploaded On</Label>
                                <div className="font-medium text-gray-900 dark:text-gray-200 mt-1">{selectedFile.date}</div>
                            </div>
                        </div>

                        <div className="space-y-4 border-t dark:border-gray-800 pt-6 flex-1">
                            <div className="space-y-2">
                                <Label>Alt Text (SEO)</Label>
                                <div className="flex gap-2">
                                    <Input defaultValue={selectedFile.alt} className="dark:bg-[#0F1117] dark:border-gray-700 h-9" />
                                    <Button variant="outline" size="sm" className="shrink-0 h-9" title="Auto-generate with AI">
                                        AI
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>File URL</Label>
                                <div className="flex gap-2">
                                    <Input value={selectedFile.url} readOnly className="dark:bg-[#0F1117] dark:border-gray-700 h-9 font-mono text-xs text-gray-500" />
                                    <Button onClick={() => handleCopy(selectedFile.url)} variant="outline" size="icon" className="shrink-0 h-9 w-9">
                                        <Copy size={14} />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="border-t dark:border-gray-800 pt-6 mt-6 flex items-center justify-between gap-4">
                            <Button onClick={() => handleDelete(selectedFile.id)} variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 flex-1 gap-2">
                                <Trash2 size={16} /> Delete
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="hidden lg:flex w-80 shrink-0 bg-white dark:bg-[#1A1D24] rounded-xl border dark:border-gray-800 p-6 flex-col items-center justify-center text-center text-gray-500 space-y-4">
                        <div className="h-16 w-16 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center border dark:border-gray-800">
                            <ImageIcon size={24} className="text-gray-400" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 dark:text-gray-300">No file selected</p>
                            <p className="text-sm mt-1">Select an image to view details, copy its link, or edit meta tags.</p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default MediaLibrary;
