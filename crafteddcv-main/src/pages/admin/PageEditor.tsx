import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft, Monitor, Smartphone, LayoutTemplate,
    Settings, Type, Image as ImageIcon, Save,
    History, Eye, Calendar, UploadCloud
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

// Simplified drag-and-drop Image Uploader component
const ImageUploader = ({ currentImage, label }: { currentImage?: string; label: string }) => {
    const [preview, setPreview] = useState<string | null>(currentImage || null);

    const onDrop = React.useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            toast.success("Image uploaded successfully");
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        maxFiles: 1
    });

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            {preview ? (
                <div className="relative group overflow-hidden rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 aspect-video flex items-center justify-center">
                    <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button size="sm" variant="secondary" onClick={() => setPreview(null)}>Remove</Button>
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <Button size="sm">Replace</Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${isDragActive ? "border-primary bg-primary/5" : "border-gray-300 dark:border-gray-700 hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-900"
                        }`}
                >
                    <input {...getInputProps()} />
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                        <UploadCloud size={20} />
                    </div>
                    <p className="text-sm font-medium dark:text-gray-300">Click or drag image to upload</p>
                    <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or WEBP (max. 5MB)</p>
                </div>
            )}
        </div>
    );
};

// Rich Text Editor Mock (simplified textarea with toolbar)
const RichTextEditor = ({ label, value }: { label: string; value: string }) => {
    return (
        <div className="space-y-2 border-none">
            <Label>{label}</Label>
            <div className="rounded-md border dark:border-gray-700 overflow-hidden bg-white dark:bg-[#1A1D24]">
                <div className="flex items-center gap-1 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 dark:text-gray-400"><strong>B</strong></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 dark:text-gray-400"><em>I</em></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 dark:text-gray-400"><u>U</u></Button>
                    <div className="w-[1px] h-4 bg-gray-300 dark:bg-gray-700 mx-1" />
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 dark:text-gray-400"><Type size={14} /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 dark:text-gray-400"><LayoutTemplate size={14} /></Button>
                </div>
                <Textarea
                    defaultValue={value}
                    className="border-0 focus-visible:ring-0 resize-y min-h-[120px] rounded-t-none dark:bg-[#1A1D24]"
                    placeholder="Start typing..."
                />
            </div>
        </div>
    );
};

const PageEditor = () => {
    const { pageId } = useParams();
    const navigate = useNavigate();
    const [deviceMap, setDeviceMap] = useState<"desktop" | "mobile">("desktop");
    const [isSaving, setIsSaving] = useState(false);

    // Mock initial content based on ID
    const pageName = pageId === "home" ? "Home / Landing Page" :
        pageId === "pricing" ? "Pricing" : "Editing Page";

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success("Page published successfully!");
        }, 1000);
    };

    const handleDraft = () => {
        toast.info("Draft saved locally");
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] -mt-8 -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden bg-[#F8F9FA] dark:bg-[#111827]">

            {/* Editor Header */}
            <div className="flex items-center justify-between border-b dark:border-gray-800 bg-white dark:bg-[#1A1D24] px-4 py-3 shrink-0">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/admin/pages")}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-bold text-gray-900 dark:text-white capitalize">{pageName}</h1>
                            <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">Published</Badge>
                        </div>
                        <p className="text-xs text-gray-500">Last edited by Sarah Jenkins 2 hours ago</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Device Toggles */}
                    <div className="hidden sm:flex items-center rounded-md border p-1 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                        <button
                            onClick={() => setDeviceMap("desktop")}
                            className={`rounded px-3 py-1.5 transition-colors ${deviceMap === "desktop" ? "bg-white shadow-sm dark:bg-gray-700 text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"}`}
                        >
                            <Monitor size={16} />
                        </button>
                        <button
                            onClick={() => setDeviceMap("mobile")}
                            className={`rounded px-3 py-1.5 transition-colors ${deviceMap === "mobile" ? "bg-white shadow-sm dark:bg-gray-700 text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"}`}
                        >
                            <Smartphone size={16} />
                        </button>
                    </div>

                    <div className="w-[1px] h-6 bg-gray-200 dark:bg-gray-800 hidden sm:block"></div>

                    <Button variant="outline" className="hidden lg:flex" onClick={handleDraft}>
                        Save Draft
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? "Publishing..." : "Publish Now"}
                    </Button>
                </div>
            </div>

            {/* Editor Workspace */}
            <div className="flex flex-1 overflow-hidden">

                {/* Left Panel - Properties Manager */}
                <div className="w-[350px] lg:w-[400px] border-r dark:border-gray-800 bg-white dark:bg-[#1A1D24] overflow-y-auto custom-scrollbar flex flex-col shrink-0 flex-1 sm:flex-none">

                    <div className="p-4 border-b dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/30">
                        <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
                            <LayoutTemplate size={16} className="text-primary" />
                            Page Sections
                        </div>
                    </div>

                    <Accordion type="multiple" defaultValue={["hero", "features"]} className="w-full">

                        {/* HERO SECTION */}
                        <AccordionItem value="hero" className="border-b dark:border-gray-800 px-4">
                            <AccordionTrigger className="hover:no-underline font-semibold py-4 text-gray-900 dark:text-white">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500"></div> Hero Header
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-6 space-y-5">

                                <div className="flex items-center justify-between border-b dark:border-gray-800 pb-4 mb-2">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Show Section</span>
                                    <Switch defaultChecked />
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="hero-headline">Headline</Label>
                                        <Input id="hero-headline" defaultValue="Build Your Perfect Resume with AI" className="dark:bg-[#1A1D24] dark:border-gray-700" />
                                    </div>

                                    <RichTextEditor
                                        label="Subheadline (Body Text)"
                                        value="Create professional, ATS-optimized resumes in minutes. Stand out from the crowd and land your dream job with our AI-powered cv builder."
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Primary CTA Label</Label>
                                            <Input defaultValue="Build My Resume" className="dark:bg-[#1A1D24] dark:border-gray-700" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Secondary CTA Label</Label>
                                            <Input defaultValue="View Templates" className="dark:bg-[#1A1D24] dark:border-gray-700" />
                                        </div>
                                    </div>

                                    <ImageUploader
                                        label="Hero Side Image (Right)"
                                        currentImage="https://images.unsplash.com/photo-1542382121-6d744eb88c91?q=80&w=2000&auto=format&fit=crop"
                                    />

                                    <div className="space-y-2 border-t dark:border-gray-800 pt-4 mt-2">
                                        <Label className="flex items-center gap-2 text-primary">
                                            <Settings size={14} /> Section Styling
                                        </Label>
                                        <div className="grid grid-cols-2 gap-4 mt-2">
                                            <div>
                                                <Label className="text-xs text-gray-500">Background Color</Label>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <input type="color" defaultValue="#FFFFFF" className="h-8 w-8 rounded cursor-pointer border-0" />
                                                    <Input defaultValue="#FFFFFF" className="h-8 font-mono text-xs dark:bg-[#1A1D24]" />
                                                </div>
                                            </div>
                                            <div>
                                                <Label className="text-xs text-gray-500">Padding</Label>
                                                <select className="flex h-8 w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-xs dark:border-gray-700 dark:bg-[#1A1D24]">
                                                    <option>Small (py-12)</option>
                                                    <option>Medium (py-24)</option>
                                                    <option selected>Large (py-32)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* FEATURES SECTION */}
                        <AccordionItem value="features" className="border-b dark:border-gray-800 px-4">
                            <AccordionTrigger className="hover:no-underline font-semibold py-4 text-gray-900 dark:text-white">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500"></div> Key Features
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-6 space-y-4">
                                <div className="space-y-2">
                                    <Label>Section Title</Label>
                                    <Input defaultValue="Why choose CraftedCV?" className="dark:bg-[#1A1D24] dark:border-gray-700" />
                                </div>

                                <div className="space-y-2">
                                    <Label>Grid Layout</Label>
                                    <select className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-[#1A1D24]">
                                        <option>2 Columns</option>
                                        <option selected>3 Columns</option>
                                        <option>4 Columns</option>
                                    </select>
                                </div>

                                <div className="rounded-md border dark:border-gray-800 p-3 bg-gray-50 dark:bg-gray-900">
                                    <p className="text-sm font-medium mb-2 dark:text-gray-300">Feature Cards</p>
                                    <Button variant="outline" className="w-full border-dashed" size="sm">
                                        Manage Feature Cards (4 items)
                                    </Button>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* TESTIMONIALS SECTION */}
                        <AccordionItem value="testimonials" className="border-b dark:border-gray-800 px-4">
                            <AccordionTrigger className="hover:no-underline font-semibold py-4 text-gray-900 dark:text-white">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full border-2 border-gray-300 dark:border-gray-600 bg-transparent"></div> Testimonials Slider
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-6 text-sm text-gray-500">
                                <div className="flex items-center justify-between border-b dark:border-gray-800 pb-4 mb-4">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Show Section</span>
                                    <Switch />
                                </div>
                                Enable this section to display user testimonials.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <div className="p-4 mt-auto border-t dark:border-gray-800 sticky bottom-0 bg-white dark:bg-[#1A1D24]">
                        <Button variant="outline" className="w-full border-dashed">
                            + Add New Section
                        </Button>
                    </div>
                </div>

                {/* Right Panel - Live Preview Iframe */}
                <div className="hidden sm:flex flex-1 flex-col relative bg-gray-100 dark:bg-gray-950 items-center justify-center p-8">

                    {/* Editor Watermark tools */}
                    <div className="absolute top-4 right-4 flex gap-2">
                        <Button size="sm" variant="secondary" className="shadow-sm">
                            <History className="w-4 h-4 mr-2" /> History
                        </Button>
                        <Button size="sm" variant="secondary" className="shadow-sm">
                            <Calendar className="w-4 h-4 mr-2" /> Schedule
                        </Button>
                    </div>

                    {/* Iframe Container simulating the Live Preview */}
                    <div className={`transition-all duration-300 ease-in-out border-4 border-gray-200 dark:border-gray-800 rounded-lg shadow-xl overflow-hidden bg-white w-full h-full ${deviceMap === "mobile" ? "max-w-[375px] max-h-[812px]" : "max-w-[1200px]"
                        }`}>

                        {/* Native browser-like top bar */}
                        <div className="h-6 bg-gray-100 dark:bg-gray-900 flex items-center px-4 gap-1.5 border-b dark:border-gray-800 shrink-0">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                        </div>

                        {/* Simulating "Live" content because an actual iframe to "/" might run into nested routing issues during dev */}
                        <div className="w-full h-full overflow-y-auto pointer-events-none p-8 dark:bg-gray-950">
                            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 py-12">
                                <div className="flex-1 space-y-6">
                                    <h1 className="text-5xl font-bold leading-tight dark:text-white">Build Your Perfect Resume with AI</h1>
                                    <p className="text-xl text-gray-500 dark:text-gray-400">Create professional, ATS-optimized resumes in minutes. Stand out from the crowd and land your dream job with our AI-powered cv builder.</p>
                                    <div className="flex gap-4">
                                        <div className="px-6 py-3 bg-primary text-white rounded-lg font-medium">Build My Resume</div>
                                        <div className="px-6 py-3 border border-gray-300 dark:border-gray-700 bg-transparent rounded-lg font-medium dark:text-white">View Templates</div>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <img src="https://images.unsplash.com/photo-1542382121-6d744eb88c91?q=80&w=2000&auto=format&fit=crop" className="rounded-xl shadow-2xl" alt="Preview" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default PageEditor;
