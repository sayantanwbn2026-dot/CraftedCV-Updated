import React from "react";
import {
    Users, FileText, Activity, Clock, MousePointerClick,
    ArrowUpRight, Download, Eye, Link as LinkIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/admin/StatCard";
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

// Mock Data
const userActivityData = [
    { date: "Mar 1", users: 120, resumes: 45 },
    { date: "Mar 2", users: 132, resumes: 52 },
    { date: "Mar 3", users: 101, resumes: 38 },
    { date: "Mar 4", users: 142, resumes: 65 },
    { date: "Mar 5", users: 180, resumes: 85 },
    { date: "Mar 6", users: 215, resumes: 110 },
    { date: "Mar 7", users: 250, resumes: 135 },
];

const deviceData = [
    { name: "Desktop", value: 65, color: "#4f46e5" },
    { name: "Mobile", value: 25, color: "#0ea5e9" },
    { name: "Tablet", value: 10, color: "#8b5cf6" },
];

const trafficData = [
    { name: "Organic", value: 45, color: "#10b981" },
    { name: "Direct", value: 25, color: "#f59e0b" },
    { name: "Referral", value: 20, color: "#3b82f6" },
    { name: "Social", value: 10, color: "#ec4899" },
];

const AdminDashboard = () => {
    // 1. Fetch Total Users
    const { data: totalUsers = 0, isLoading: loadingUsers } = useQuery({
        queryKey: ['admin_total_users'],
        queryFn: async () => {
            const { count, error } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true });
            if (error) throw error;
            return count || 0;
        }
    });

    // 2. Fetch Total Resumes
    const { data: totalResumes = 0, isLoading: loadingResumes } = useQuery({
        queryKey: ['admin_total_resumes'],
        queryFn: async () => {
            const { count, error } = await supabase
                .from('cv_drafts')
                .select('*', { count: 'exact', head: true });
            if (error) throw error;
            return count || 0;
        }
    });

    // 3. Fetch Recent Activity (Mocked for now until an audit log table exists)
    const recentActivity = [
        { id: 1, type: "signup", user: "sarah.j@example.com", time: "5 mins ago", desc: "New user signed up", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
        { id: 2, type: "resume", user: "mike.t@example.com", time: "12 mins ago", desc: "Generated 'Executive' resume", icon: FileText, color: "text-green-500", bg: "bg-green-500/10" },
        { id: 3, type: "subscription", user: "alex.w@example.com", time: "1 hour ago", desc: "Upgraded to Pro Plan", icon: ArrowUpRight, color: "text-purple-500", bg: "bg-purple-500/10" },
        { id: 4, type: "resume", user: "emma.l@example.com", time: "2 hours ago", desc: "Downloaded PDF resume", icon: Download, color: "text-primary", bg: "bg-primary/10" },
    ];
    return (
        <div className="space-y-6 pb-12 animate-in fade-in duration-500">

            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-1 dark:text-gray-400">Welcome back. Here's what's happening today.</p>
                </div>
                <div className="flex gap-2">
                    <select className="bg-white border text-sm rounded-md px-3 py-1.5 dark:bg-[#1A1D24] dark:border-gray-700">
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>This Month</option>
                        <option>All Time</option>
                    </select>
                    <button className="bg-primary hover:bg-primary/90 text-white rounded-md px-4 py-1.5 text-sm font-medium transition-colors">
                        Download Report
                    </button>
                </div>
            </div>

            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <StatCard title="Total Users" value={loadingUsers ? "..." : totalUsers.toLocaleString()} trend={12.5} trendLabel="vs last mo" icon={Users} className="xl:col-span-2" />
                <StatCard title="Resumes (Today)" value="12" trend={5.2} icon={FileText} className="xl:col-span-2" />
                <StatCard title="Total Resumes" value={loadingResumes ? "..." : totalResumes.toLocaleString()} icon={FileText} />
                <StatCard title="Active Subs" value="1,240" trend={2.1} icon={Activity} />
                <StatCard title="Avg Time on Site" value="4m 12s" trend={-1.5} icon={Clock} className="xl:col-span-3" />
                <StatCard title="Bounce Rate" value="34.5%" trend={-4.2} icon={MousePointerClick} className="xl:col-span-3" />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Line Chart */}
                <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1A1D24]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Active Users</h3>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={userActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#1A1D24', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="users" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bar Chart */}
                <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1A1D24]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Resumes Generated</h3>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={userActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                                <RechartsTooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: '#1A1D24', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}
                                />
                                <Bar dataKey="resumes" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Charts Row 2 & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Device Breakdown */}
                <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1A1D24]">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Device Breakdown</h3>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={deviceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {deviceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip contentStyle={{ backgroundColor: '#1A1D24', borderColor: '#374151', borderRadius: '8px' }} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Traffic Sources */}
                <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1A1D24]">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Traffic Sources</h3>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={trafficData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {trafficData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip contentStyle={{ backgroundColor: '#1A1D24', borderColor: '#374151', borderRadius: '8px' }} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1A1D24] overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
                        <button className="text-sm text-primary hover:underline">View All</button>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <ul className="space-y-5">
                            {recentActivity.map((activity) => (
                                <li key={activity.id} className="flex gap-4">
                                    <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full", activity.bg, activity.color)}>
                                        <activity.icon size={16} />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{activity.desc}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-gray-500 truncate">{activity.user}</span>
                                            <span className="hidden sm:inline-block h-1 w-1 rounded-full bg-gray-400"></span>
                                            <span className="text-xs text-gray-400 shrink-0">{activity.time}</span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Pages Performance Table */}
            <div className="rounded-xl border bg-white shadow-sm dark:border-gray-800 dark:bg-[#1A1D24] overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Page Performance</h3>
                    <button className="text-sm text-primary hover:underline flex items-center gap-1">
                        <LinkIcon size={14} /> Full Report
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4 font-medium">Page Path</th>
                                <th className="px-6 py-4 font-medium">Page Views</th>
                                <th className="px-6 py-4 font-medium">Avg. Time Spent</th>
                                <th className="px-6 py-4 font-medium">Bounce Rate</th>
                                <th className="px-6 py-4 font-medium">Exit Rate</th>
                                <th className="px-6 py-4 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {[
                                { path: "/home", views: "45.2K", time: "2:15", bounce: "32%", exit: "15%" },
                                { path: "/builder", views: "28.5K", time: "8:45", bounce: "12%", exit: "45%" },
                                { path: "/templates", views: "15.8K", time: "4:30", bounce: "25%", exit: "22%" }
                            ].map((page, i) => (
                                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{page.path}</td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{page.views}</td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{page.time}</td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{page.bounce}</td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{page.exit}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-400 hover:text-primary transition-colors">
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default AdminDashboard;
