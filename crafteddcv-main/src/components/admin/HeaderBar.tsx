import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu, Search, Bell, Settings, User as UserIcon, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const HeaderBar = ({
    toggleMobileMenu
}: {
    toggleMobileMenu: () => void;
}) => {
    const { user, logout } = useAdminAuth();
    const location = useLocation();
    const [isSaving, setIsSaving] = useState(false);

    // Parse path for breadcrumbs
    const pathnames = location.pathname.split("/").filter((x) => x && x !== "admin");

    // Mock global search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Search implementation would go here
    };

    // Mock quick publish
    const handleQuickPublish = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
        }, 1500);
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-white px-4 shadow-sm dark:border-gray-800 dark:bg-[#111827]">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleMobileMenu}
                    className="rounded-md p-2 text-gray-500 hover:bg-gray-100 lg:hidden dark:text-gray-400 dark:hover:bg-gray-800"
                >
                    <Menu size={20} />
                </button>

                {/* Breadcrumbs (Desktop Only) */}
                <div className="hidden pb-1 lg:block">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/admin/dashboard" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">Admin</BreadcrumbLink>
                            </BreadcrumbItem>
                            {pathnames.map((value, index) => {
                                const last = index === pathnames.length - 1;
                                const to = `/admin/${pathnames.slice(0, index + 1).join("/")}`;
                                const title = value.charAt(0).toUpperCase() + value.slice(1).replace("-", " ");

                                return (
                                    <React.Fragment key={to}>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            {last ? (
                                                <BreadcrumbPage className="font-semibold">{title}</BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink href={to} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                                                    {title}
                                                </BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>
                                    </React.Fragment>
                                );
                            })}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </div>

            <div className="flex flex-1 items-center justify-end gap-4 lg:gap-6">
                {/* Global Search */}
                <form onSubmit={handleSearch} className="hidden lg:flex relative w-64 max-w-sm ml-auto">
                    <div className="relative w-full">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-gray-400" />
                        </span>
                        <Input
                            type="search"
                            placeholder="Search users, pages (Cmd+K)..."
                            className="w-full bg-gray-50 pl-10 pt-[2px] h-9 text-sm focus-visible:ring-1 focus-visible:ring-primary dark:bg-gray-800 dark:border-gray-700"
                        />
                    </div>
                </form>

                {/* Quick Publish / Save State */}
                <div className="hidden sm:flex items-center">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 gap-2 dark:border-gray-700 dark:hover:bg-gray-800"
                        onClick={handleQuickPublish}
                        disabled={isSaving}
                    >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <div className="h-2 w-2 rounded-full bg-green-500" />}
                        {isSaving ? "Saving..." : "All changes saved"}
                    </Button>
                </div>

                {/* Notifications */}
                <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-[#111827]">
                        3
                    </span>
                </button>

                {/* User Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 rounded-full p-1 pl-2 hover:bg-gray-100 transition-colors dark:hover:bg-gray-800">
                            <span className="hidden text-sm font-medium sm:block dark:text-white">{user?.name}</span>
                            <img
                                src={user?.avatar || "https://i.pravatar.cc/150"}
                                alt="Profile"
                                className="h-8 w-8 rounded-full border border-gray-200 dark:border-gray-700"
                            />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 mt-1">
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user?.name}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user?.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer">
                            <UserIcon className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Account Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => logout()}
                            className="text-red-600 focus:bg-red-50 focus:text-red-700 dark:text-red-500 dark:focus:bg-red-950/50 cursor-pointer"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};

export default HeaderBar;
