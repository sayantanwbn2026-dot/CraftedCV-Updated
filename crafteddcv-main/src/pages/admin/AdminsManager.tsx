import React from "react";
import { Shield, UserPlus, Key, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const admins = [
    { id: 1, name: "Sarah Jenkins", email: "sarah@craftedcv.com", role: "Super Admin", lastActive: "Just now", status: "Active", avatar: "https://i.pravatar.cc/150?u=1" },
    { id: 2, name: "Mike Thompson", email: "mike@craftedcv.com", role: "Content Editor", lastActive: "1 hour ago", status: "Active", avatar: "https://i.pravatar.cc/150?u=2" },
    { id: 3, name: "Alex Wong", email: "alex@craftedcv.com", role: "System Manager", lastActive: "Yesterday", status: "Active", avatar: "https://i.pravatar.cc/150?u=3" },
    { id: 4, name: "Emma Lopez", email: "emma@craftedcv.com", role: "Support", lastActive: "1 week ago", status: "Inactive", avatar: "https://i.pravatar.cc/150?u=4" },
];

const AdminsManager = () => {
    return (
        <div className="space-y-6 pb-12 animate-in fade-in duration-500 max-w-6xl">

            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                        <Shield className="text-primary" /> Admin Accounts
                    </h1>
                    <p className="text-gray-500 mt-1 dark:text-gray-400">Manage dashboard access and role-based permissions.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button className="gap-2">
                        <UserPlus size={16} /> Invite Admin
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">

                {/* Roles overview (Left Col) */}
                <div className="space-y-4">
                    <div className="bg-white dark:bg-[#1A1D24] p-5 rounded-xl border dark:border-gray-800 shadow-sm">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Roles & Permissions</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Super Admin</span>
                                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">1 Account</Badge>
                            </div>
                            <div className="text-xs text-gray-500 mb-3 border-b dark:border-gray-800 pb-3">Full system access, billing, and all settings.</div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">System Manager</span>
                                <Badge variant="secondary" className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">1 Account</Badge>
                            </div>
                            <div className="text-xs text-gray-500 mb-3 border-b dark:border-gray-800 pb-3">Manages SEO, integrations, and user accounts. Cannot view billing.</div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Content Editor</span>
                                <Badge variant="secondary" className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">1 Account</Badge>
                            </div>
                            <div className="text-xs text-gray-500 mb-3 border-b dark:border-gray-800 pb-3">Can only edit CMS pages and templates.</div>
                        </div>
                        <Button variant="outline" className="w-full mt-4 text-xs dark:border-gray-700">Manage Roles</Button>
                    </div>
                </div>

                {/* Admin List (Right Cols) */}
                <div className="md:col-span-3">
                    <div className="bg-white dark:bg-[#1A1D24] rounded-xl border dark:border-gray-800 shadow-sm overflow-hidden flex flex-col h-full">
                        <div className="flex-1">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-900/50 dark:text-gray-400 border-b dark:border-gray-800">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Administrator</th>
                                        <th className="px-6 py-4 font-medium">Role</th>
                                        <th className="px-6 py-4 font-medium">Last Active</th>
                                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {admins.map((admin) => (
                                        <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={admin.avatar} alt={admin.name} className={`h-10 w-10 rounded-full border-2 ${admin.status === 'Active' ? 'border-green-500' : 'border-gray-300 dark:border-gray-700 opacity-50'}`} />
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                                            {admin.name}
                                                            {admin.id === 1 && <Badge className="text-[10px] px-1.5 py-0 h-4 bg-primary text-white">You</Badge>}
                                                        </span>
                                                        <span className="text-xs text-gray-500">{admin.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className="dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                                    {admin.role}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">
                                                {admin.lastActive}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-primary">
                                                        <Key size={16} />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-600" disabled={admin.id === 1}>
                                                        <EyeOff size={16} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Security Notice */}
                        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border-t border-amber-100 dark:border-amber-900/30 flex items-start gap-3 justify-center shrink-0">
                            <Shield className="text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" size={16} />
                            <p className="text-xs text-amber-800 dark:text-amber-400 max-w-xl">
                                <strong>Security Notice:</strong> Require all administrators to enable Two-Factor Authentication (2FA) to protect sensitive user data. Current compliance: 3/4 accounts.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminsManager;
