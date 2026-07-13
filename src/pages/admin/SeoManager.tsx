import React from "react";
import { Globe, RefreshCw, BarChart2, CheckCircle2, AlertTriangle, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const SeoManager = () => {
    return (
        <div className="space-y-6 pb-12 animate-in fade-in duration-500 max-w-5xl">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">SEO & Indexing</h1>
                    <p className="text-gray-500 mt-1 dark:text-gray-400">Manage global SEO defaults, redirects, and search appearance.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2 dark:border-gray-700 dark:hover:bg-gray-800">
                        <FileCode size={16} /> Edit robots.txt
                    </Button>
                    <Button className="gap-2">
                        Save SEO Config
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left Column: Defaults & Settings */}
                <div className="md:col-span-2 space-y-6">
                    <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1A1D24]">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Global Defaults</h3>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label>Default Meta Title Format</Label>
                                    <span className="text-xs text-gray-500">Variables: %page_title%, %site_name%</span>
                                </div>
                                <Input defaultValue="%page_title% | %site_name%" className="font-mono text-sm dark:bg-[#0F1117] dark:border-gray-700" />
                                <p className="text-xs text-gray-500 mt-1">Example: Templates | CraftedCV</p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label>Default Meta Description</Label>
                                    <span className="text-xs text-gray-500">145/160 characters</span>
                                </div>
                                <Textarea
                                    defaultValue="Create professional, ATS-optimized resumes in minutes with CraftedCV's AI-powered resume builder. Land your dream job at top companies today."
                                    className="dark:bg-[#0F1117] dark:border-gray-700 resize-none h-24"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Global OG Image (Social Share Provider)</Label>
                                <div className="flex items-center gap-4 border dark:border-gray-700 p-2 rounded-lg bg-gray-50 dark:bg-[#0F1117]">
                                    <img src="https://images.unsplash.com/photo-1542382121-6d744eb88c91?w=200&q=80" alt="OG Preview" className="w-24 h-16 object-cover rounded shadow-sm border dark:border-gray-600" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium dark:text-gray-200">og-image-default.jpg</p>
                                        <p className="text-xs text-gray-500">1200x630px recommended</p>
                                    </div>
                                    <Button variant="secondary" size="sm">Choose Image</Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1A1D24]">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">JSON-LD Global Schema</h3>
                        <p className="text-sm text-gray-500 mb-4">Add structured data that applies to all pages (e.g., Organization schema).</p>
                        <Textarea
                            defaultValue={`{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "CraftedCV",\n  "url": "https://craftedcv.com",\n  "logo": "https://craftedcv.com/logo.png"\n}`}
                            className="font-mono text-xs dark:bg-[#0F1117] dark:border-gray-700 h-48 bg-gray-900 text-green-400 p-4"
                        />
                    </div>
                </div>

                {/* Right Column: Status & Check */}
                <div className="space-y-6">

                    {/* Sitemap Status */}
                    <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1A1D24]">
                        <div className="flex items-center gap-2 mb-4">
                            <Globe className="text-primary" size={20} />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sitemap.xml</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Status</span>
                                <span className="flex items-center gap-1 text-green-600 font-medium">
                                    <CheckCircle2 size={16} /> Valid
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">URLs indexed</span>
                                <span className="font-medium text-gray-900 dark:text-white">34 pages</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Last built</span>
                                <span className="font-medium text-gray-900 dark:text-white">Today, 8:45 AM</span>
                            </div>

                            <Button variant="outline" className="w-full mt-2 gap-2 dark:border-gray-700">
                                <RefreshCw size={14} /> Rebuild Sitemap
                            </Button>
                        </div>
                    </div>

                    {/* Health Check */}
                    <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1A1D24]">
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart2 className="text-primary" size={20} />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Health Score</h3>
                        </div>

                        <div className="flex items-center justify-center py-4">
                            <div className="relative h-24 w-24 rounded-full border-8 border-green-500 flex items-center justify-center">
                                <span className="text-2xl font-bold dark:text-white">94</span>
                            </div>
                        </div>

                        <ul className="space-y-3 mt-4 text-sm">
                            <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                                <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                                <span>All pages have meta titles</span>
                            </li>
                            <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                                <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                                <span>Robots.txt is configured</span>
                            </li>
                            <li className="flex items-start gap-2 text-amber-600 dark:text-amber-500">
                                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                                <span>2 pages missing OG images</span>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SeoManager;
