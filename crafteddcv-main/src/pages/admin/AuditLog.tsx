import React from "react";
import { format } from "date-fns";
import { Search, Filter, ShieldAlert, Monitor, Type } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock Audit Log Data
const auditLogs = [
    { id: "105", user: "Sarah Jenkins", email: "sarah@craftedcv.com", role: "Super Admin", action: "Updated Global Settings", resource: "Settings", date: new Date(Date.now() - 1000 * 60 * 5), ip: "192.168.1.1", status: "Success" },
    { id: "104", user: "Mike Thompson", email: "mike@craftedcv.com", role: "Content Editor", action: "Published Page 'Pricing'", resource: "Pages", date: new Date(Date.now() - 1000 * 60 * 45), ip: "10.0.0.45", status: "Success" },
    { id: "103", user: "Alex Wong", email: "alex@craftedcv.com", role: "Manager", action: "Deleted User Account (ID: 4509)", resource: "Users", date: new Date(Date.now() - 1000 * 60 * 60 * 2), ip: "172.16.0.12", status: "Warning" },
    { id: "102", user: "System", email: "system@craftedcv", role: "System", action: "Automated Routine Backup", resource: "Database", date: new Date(Date.now() - 1000 * 60 * 60 * 12), ip: "127.0.0.1", status: "Success" },
    { id: "101", user: "Unknown", email: "unknown", role: "N/A", action: "Failed Login Attempt", resource: "Admin Auth", date: new Date(Date.now() - 1000 * 60 * 60 * 24), ip: "185.20.14.9", status: "Failed" },
    { id: "100", user: "Sarah Jenkins", email: "sarah@craftedcv.com", role: "Super Admin", action: "Created API Key", resource: "Security", date: new Date(Date.now() - 1000 * 60 * 60 * 48), ip: "192.168.1.1", status: "Success" },
];

const AuditLog = () => {
    return (
        <div className="space-y-6 pb-12 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                        <ShieldAlert className="text-primary" /> Security & Audit Log
                    </h1>
                    <p className="text-gray-500 mt-1 dark:text-gray-400">Chronological record of all administrative actions and security events.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline" className="gap-2 dark:border-gray-700 bg-white dark:bg-[#1A1D24]">
                        <Filter size={16} /> Filters
                    </Button>
                    <Button variant="outline" className="dark:border-gray-700 bg-white dark:bg-[#1A1D24]">
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white dark:bg-[#1A1D24] p-4 rounded-xl border dark:border-gray-800 shadow-sm flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input placeholder="Search logs by user, action, or IP address..." className="pl-9 dark:bg-[#0F1117] dark:border-gray-700 w-full" />
                </div>
                <div className="flex gap-2">
                    <select className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-[#0F1117]">
                        <option>All Resources</option>
                        <option>Users</option>
                        <option>Pages</option>
                        <option>Settings</option>
                    </select>
                    <select className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-[#0F1117]">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>All Time</option>
                    </select>
                </div>
            </div>

            {/* Log Table */}
            <div className="bg-white dark:bg-[#1A1D24] rounded-xl border dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-900/50 dark:text-gray-400 border-b dark:border-gray-800">
                            <tr>
                                <th className="px-6 py-4 font-medium">Timestamp</th>
                                <th className="px-6 py-4 font-medium">Actor</th>
                                <th className="px-6 py-4 font-medium">Event / Action</th>
                                <th className="px-6 py-4 font-medium">Resource</th>
                                <th className="px-6 py-4 font-medium">IP Address</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {auditLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400 font-mono text-xs">
                                        {format(log.date, "MMM dd, yyyy HH:mm:ss")}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900 dark:text-white">{log.user}</span>
                                            <span className="text-xs text-gray-500">{log.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">
                                        {log.action}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="outline" className="dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                            {log.resource}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500 flex items-center gap-1.5 mt-2">
                                        <Monitor size={12} /> {log.ip}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={
                                            log.status === "Success" ? "default" :
                                                log.status === "Warning" ? "secondary" : "destructive"
                                        }
                                            className={
                                                log.status === "Success" ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400" :
                                                    log.status === "Warning" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : ""
                                            }
                                        >
                                            {log.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination placeholder */}
                <div className="p-4 border-t dark:border-gray-800 flex items-center justify-between text-sm text-gray-500 bg-gray-50/50 dark:bg-gray-900/30">
                    <span>Showing 1 to 6 of 1,240 entries</span>
                    <div className="flex gap-1">
                        <Button variant="outline" size="sm" disabled>Previous</Button>
                        <Button variant="outline" size="sm">Next</Button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AuditLog;
