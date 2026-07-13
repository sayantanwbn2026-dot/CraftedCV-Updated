import React from "react";
import { Link } from "react-router-dom";
import { FileText, Edit2, ExternalLink, Globe, Calendar, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock Data
const pages = [
    { id: "home", title: "Home / Landing Page", url: "/", lastEdited: "2 hours ago", editedBy: "Sarah Jenkins", status: "Published", seoScore: 92 },
    { id: "pricing", title: "Pricing", url: "/pricing", lastEdited: "Yesterday", editedBy: "Mike Thompson", status: "Published", seoScore: 88 },
    { id: "templates", title: "Resume Templates", url: "/templates", lastEdited: "3 days ago", editedBy: "Alex Wong", status: "Published", seoScore: 95 },
    { id: "builder", title: "Resume Builder (App)", url: "/builder", lastEdited: "1 week ago", editedBy: "System", status: "Published", seoScore: 100 },
    { id: "about", title: "About Us", url: "/about", lastEdited: "2 weeks ago", editedBy: "Sarah Jenkins", status: "Draft", seoScore: 65 },
    { id: "blog", title: "Blog Hub", url: "/blog", lastEdited: "1 month ago", editedBy: "Emma Lopez", status: "Published", seoScore: 82 },
    { id: "privacy", title: "Privacy Policy", url: "/privacy", lastEdited: "3 months ago", editedBy: "Legal Team", status: "Published", seoScore: 70 },
    { id: "terms", title: "Terms of Service", url: "/terms", lastEdited: "3 months ago", editedBy: "Legal Team", status: "Published", seoScore: 70 },
];

const PagesManager = () => {
    return (
        <div className="space-y-6 pb-12 animate-in fade-in duration-500">

            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Pages Content</h1>
                    <p className="text-gray-500 mt-1 dark:text-gray-400">Manage all marketing and static pages on the site.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Search pages..."
                            className="pl-9 w-full bg-white dark:bg-[#1A1D24] dark:border-gray-700"
                        />
                    </div>
                </div>
            </div>

            {/* Pages List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {pages.map((page) => (
                    <div key={page.id} className="group relative rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-[#1A1D24] flex flex-col h-full">

                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary shrink-0">
                                <FileText size={20} />
                            </div>

                            <div className="flex flex-col items-end gap-2">
                                <Badge variant={page.status === "Published" ? "default" : "secondary"} className={page.status === "Published" ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400" : ""}>
                                    {page.status}
                                </Badge>

                                <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${page.seoScore >= 90 ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" :
                                        page.seoScore >= 70 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400" :
                                            "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                                    }`}>
                                    SEO: {page.seoScore}
                                </div>
                            </div>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                            {page.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6 gap-1.5">
                            <Globe size={14} />
                            <span className="truncate">{window.location.origin}{page.url}</span>
                        </div>

                        <div className="mt-auto border-t border-gray-100 dark:border-gray-800 pt-4 flex flex-col gap-4">
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-4">
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={14} />
                                    <span>{page.lastEdited}</span>
                                </div>
                                <div className="flex items-center gap-1.5 line-clamp-1">
                                    <img src={`https://ui-avatars.com/api/?name=${page.editedBy.replace(' ', '+')}&background=random&size=16`} className="w-4 h-4 rounded-full" alt="" />
                                    <span>{page.editedBy}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-2">
                                <Button className="flex-1 gap-2" variant="default" asChild>
                                    <Link to={`/admin/pages/${page.id}/edit`}>
                                        <Edit2 size={16} /> Edit Content
                                    </Link>
                                </Button>
                                <Button size="icon" variant="outline" className="shrink-0" title="Preview on live site">
                                    <ExternalLink size={18} />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default PagesManager;
