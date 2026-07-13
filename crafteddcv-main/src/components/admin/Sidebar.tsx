import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard, LineChart, Users, FileText, Settings,
    LayoutTemplate, MessageSquare, Search, Image as ImageIcon,
    Mail, Activity, Shield, ChevronLeft, ChevronRight,
    Database, FileCode2, UserCog, LogOut, Menu
} from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

const NAV_GROUPS = [
    {
        label: "Overview",
        items: [
            { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
            { label: "Analytics", href: "/admin/analytics", icon: LineChart },
            { label: "User Demographics", href: "/admin/analytics/demographics", icon: Users },
        ],
    },
    {
        label: "Content Management",
        items: [
            { label: "Pages", href: "/admin/pages", icon: FileText },
            { label: "Global Settings", href: "/admin/settings/global", icon: Settings },
        ],
    },
    {
        label: "Resume Engine",
        items: [
            { label: "Resume Templates", href: "/admin/resume-templates", icon: LayoutTemplate },
            { label: "AI Prompt Settings", href: "/admin/settings/ai-prompts", icon: Database },
            { label: "Generated Resumes", href: "/admin/generated-resumes", icon: FileCode2 },
        ],
    },
    {
        label: "Users",
        items: [
            { label: "All Users", href: "/admin/users", icon: Users },
            { label: "Subscriptions", href: "/admin/users/subscriptions", icon: Activity },
            { label: "User Feedback", href: "/admin/users/feedback", icon: MessageSquare },
        ],
    },
    {
        label: "System",
        items: [
            { label: "SEO Settings", href: "/admin/seo", icon: Search },
            { label: "Media Library", href: "/admin/media", icon: ImageIcon },
            { label: "Email Templates", href: "/admin/emails", icon: Mail },
            { label: "Audit Log", href: "/admin/audit-log", icon: Activity },
            { label: "Admin Accounts", href: "/admin/admins", icon: Shield },
        ],
    },
];

const Sidebar = ({
    collapsed,
    setCollapsed,
    mobileOpen,
    setMobileOpen
}: {
    collapsed: boolean;
    setCollapsed: (v: boolean) => void;
    mobileOpen: boolean;
    setMobileOpen: (v: boolean) => void;
}) => {
    const { user, logout } = useAdminAuth();

    return (
        <>
            {/* Mobile backdrop */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex flex-col bg-[#0F1117] text-gray-300 transition-all duration-300 ease-in-out border-r border-gray-800",
                    collapsed ? "w-[80px]" : "w-[260px]",
                    mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                    "lg:static" // Allow it to be relatively positioned on desktop via Flex
                )}
            >
                <div className="flex h-16 items-center justify-between px-4 border-b border-gray-800">
                    {!collapsed && (
                        <div className="flex items-center gap-2">
                            <img src={logo} alt="CraftedCV" className="h-6 w-auto brightness-0 invert" />
                            <span className="font-bold text-white tracking-tight">CraftedCV</span>
                        </div>
                    )}
                    {collapsed && (
                        <img src={logo} alt="CraftedCV" className="h-8 w-auto mx-auto brightness-0 invert" />
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden lg:block p-1 hover:bg-gray-800 rounded-md text-gray-400"
                    >
                        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>

                {/* User Profile Summary */}
                <div className={cn("p-4 border-b border-gray-800", collapsed ? "text-center" : "")}>
                    <div className={cn("flex items-center gap-3", collapsed ? "justify-center" : "")}>
                        <img src={user?.avatar} alt={user?.name} className="h-10 w-10 rounded-full bg-gray-800 border-2 border-primary/20" />
                        {!collapsed && (
                            <div className="flex flex-col min-w-0 overflow-hidden">
                                <span className="text-sm font-medium text-white truncate">{user?.name}</span>
                                <span className="text-xs text-primary truncate">{user?.role}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 custom-scrollbar">
                    {NAV_GROUPS.map((group, i) => (
                        <div key={i} className="mb-6 px-3">
                            {!collapsed && (
                                <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    {group.label}
                                </h3>
                            )}
                            {collapsed && <div className="mx-auto w-8 border-t border-gray-800 mb-2 mt-4 first:mt-0" />}

                            <ul className="space-y-1">
                                {group.items.map((item, j) => {
                                    const Icon = item.icon;
                                    return (
                                        <li key={j}>
                                            <NavLink
                                                to={item.href}
                                                className={({ isActive }) =>
                                                    cn(
                                                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors group",
                                                        isActive
                                                            ? "bg-primary/10 text-primary"
                                                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                                    )
                                                }
                                                title={collapsed ? item.label : undefined}
                                            >
                                                <Icon size={20} className={cn("shrink-0", collapsed && "mx-auto")} />
                                                {!collapsed && <span className="truncate">{item.label}</span>}
                                            </NavLink>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Footer actions */}
                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={() => logout()}
                        className={cn(
                            "w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-colors",
                            collapsed ? "justify-center" : ""
                        )}
                        title={collapsed ? "Logout" : undefined}
                    >
                        <LogOut size={20} className="shrink-0" />
                        {!collapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
