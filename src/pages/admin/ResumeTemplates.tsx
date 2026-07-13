import React from "react";
import { Plus, Edit3, Trash2, Eye, LayoutTemplate, Star, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

// Mock Data
const templates = [
    { id: 1, name: "Executive Pro", category: "Professional", uses: "12.4k", rating: 4.8, isPremium: true, isActive: true, image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=500&fit=crop" },
    { id: 2, name: "Minimalist Clean", category: "Creative", uses: "45.2k", rating: 4.9, isPremium: false, isActive: true, image: "https://images.unsplash.com/photo-1586282391129-76a6df230234?w=400&h=500&fit=crop" },
    { id: 3, name: "Tech Innovator", category: "Tech", uses: "8.1k", rating: 4.5, isPremium: true, isActive: true, image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=500&fit=crop" },
    { id: 4, name: "Academic Scholar", category: "Academic", uses: "3.2k", rating: 4.2, isPremium: false, isActive: false, image: "https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=400&h=500&fit=crop" },
    { id: 5, name: "Modern Startup", category: "Business", uses: "18.5k", rating: 4.7, isPremium: true, isActive: true, image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=500&fit=crop" },
];

const ResumeTemplates = () => {
    return (
        <div className="space-y-6 pb-12 animate-in fade-in duration-500">

            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Resume Templates</h1>
                    <p className="text-gray-500 mt-1 dark:text-gray-400">Manage, reorder, and configure CV templates.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2 dark:border-gray-700">
                        <BarChart3 size={16} /> AI Prompts
                    </Button>
                    <Button className="gap-2">
                        <Plus size={16} /> New Template
                    </Button>
                </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mt-6">
                {templates.map((template) => (
                    <div key={template.id} className="group overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-[#1A1D24] flex flex-col">

                        {/* Template Thumb */}
                        <div className="relative aspect-[1/1.2] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                            <img
                                src={template.image}
                                alt={template.name}
                                className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${!template.isActive && "opacity-50 grayscale"}`}
                            />

                            <div className="absolute top-3 right-3 flex flex-col gap-2">
                                {template.isPremium && (
                                    <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white border-0 shadow-sm pointer-events-none">
                                        PRO
                                    </Badge>
                                )}
                                {!template.isActive && (
                                    <Badge variant="secondary" className="bg-gray-900/80 text-white border-0 pointer-events-none backdrop-blur-sm">
                                        Draft
                                    </Badge>
                                )}
                            </div>

                            {/* Hover Actions */}
                            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity backdrop-blur-[2px] group-hover:opacity-100">
                                <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full hover:scale-110 transition-transform">
                                    <Eye size={18} />
                                </Button>
                                <Button size="icon" className="h-10 w-10 rounded-full hover:scale-110 transition-transform bg-primary text-white hover:bg-primary/90">
                                    <Edit3 size={18} />
                                </Button>
                            </div>
                        </div>

                        {/* Template Info */}
                        <div className="flex flex-1 flex-col p-4">
                            <div className="flex items-start justify-between gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1" title={template.name}>
                                    {template.name}
                                </h3>
                                <div className="flex items-center text-xs font-medium text-amber-500 shrink-0 bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded">
                                    <Star size={12} className="mr-1 fill-amber-500" />
                                    {template.rating}
                                </div>
                            </div>

                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{template.category}</p>

                            <div className="mt-auto flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3">
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-medium">Usage</span>
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{template.uses}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{template.isActive ? "Active" : "Hidden"}</span>
                                    <Switch checked={template.isActive} aria-label="Toggle active status" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Card */}
                <button className="group flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800 bg-transparent hover:bg-gray-50 dark:hover:bg-[#1A1D24]/50 transition-colors aspect-[1/1.4] sm:aspect-auto sm:h-full min-h-[300px]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors mb-3">
                        <Plus size={24} />
                    </div>
                    <span className="font-medium text-gray-500 group-hover:text-primary transition-colors">Blank Template</span>
                    <span className="text-sm text-gray-400 mt-1 max-w-[200px] text-center">Start from scratch using the template editor</span>
                </button>
            </div>
        </div>
    );
};

export default ResumeTemplates;
