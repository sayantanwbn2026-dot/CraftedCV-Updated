import React, { useState } from "react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, CalendarIcon, Users, MousePointerClick, TrendingUp, Clock, FileText } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";

// Mock Data
const trafficData = [
    { date: "Mar 1", sessions: 4200, pageviews: 8400, unique: 3100 },
    { date: "Mar 2", sessions: 4800, pageviews: 9600, unique: 3500 },
    { date: "Mar 3", sessions: 4100, pageviews: 7800, unique: 2900 },
    { date: "Mar 4", sessions: 5200, pageviews: 11500, unique: 3900 },
    { date: "Mar 5", sessions: 5800, pageviews: 12100, unique: 4200 },
    { date: "Mar 6", sessions: 6500, pageviews: 14200, unique: 4800 },
    { date: "Mar 7", sessions: 7100, pageviews: 16500, unique: 5300 },
];

const conversionData = [
    { step: "Landing Page", users: 15400 },
    { step: "Sign Up Setup", users: 8200 },
    { step: "Created Resume", users: 5100 },
    { step: "Subscribed Pro", users: 1250 },
];

const Analytics = () => {
    return (
        <div className="space-y-6 pb-12 animate-in fade-in duration-500 max-w-7xl">

            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Detailed Analytics</h1>
                    <p className="text-gray-500 mt-1 dark:text-gray-400">Deep dive into traffic, user flow, and content performance.</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <Button variant="outline" className="gap-2 dark:border-gray-700 bg-white dark:bg-[#1A1D24]">
                        <CalendarIcon size={16} /> Last 30 Days
                    </Button>
                    <Button variant="default" className="gap-2">
                        <Download size={16} /> Export Report
                    </Button>
                </div>
            </div>

            {/* KPI Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Sessions" value="124.5K" trend={15.2} icon={Users} />
                <StatCard title="Pageviews" value="342.1K" trend={28.4} icon={MousePointerClick} />
                <StatCard title="Avg. Source Conv. Rate" value="4.2%" trend={0.5} icon={TrendingUp} />
                <StatCard title="Avg Session Duration" value="3m 45s" trend={-1.2} icon={Clock} />
            </div>

            <Tabs defaultValue="traffic" className="w-full">
                <TabsList className="mb-4 bg-white border dark:bg-[#1A1D24] dark:border-gray-800 w-full justify-start overflow-x-auto h-auto p-1 py-1.5 flex-nowrap rounded-lg shadow-sm">
                    <TabsTrigger value="traffic" className="rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary dark:data-[state=active]:bg-primary/20">Traffic Overview</TabsTrigger>
                    <TabsTrigger value="pages" className="rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary dark:data-[state=active]:bg-primary/20">Page Analytics</TabsTrigger>
                    <TabsTrigger value="conversions" className="rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary dark:data-[state=active]:bg-primary/20">Conversions Funnel</TabsTrigger>
                    <TabsTrigger value="performance" className="rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary dark:data-[state=active]:bg-primary/20">Web Performance</TabsTrigger>
                </TabsList>

                <TabsContent value="traffic" className="mt-0 space-y-6">
                    <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1A1D24]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sessions & Pageviews over time</h3>
                        </div>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorPageviews" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: '#1A1D24', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}
                                    />
                                    <Area type="monotone" dataKey="pageviews" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorPageviews)" />
                                    <Area type="monotone" dataKey="sessions" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorSessions)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="conversions" className="mt-0 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1A1D24]">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">User Journey Funnel</h3>
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={conversionData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#374151" opacity={0.1} />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="step" type="category" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} width={100} />
                                        <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1A1D24', borderColor: '#374151', color: '#fff', borderRadius: '8px' }} />
                                        <Bar dataKey="users" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={24} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1A1D24]">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Drop-off Insights</h3>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Landing to Signup</span>
                                        <span className="text-xl font-bold text-red-500">46.7% drop</span>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden flex">
                                        <div className="bg-primary h-full w-[53.3%]"></div>
                                        <div className="bg-red-500 h-full w-[46.7%]"></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Highest drop-off occurs before account creation. Consider simplifying the CTA.</p>
                                </div>

                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Created Resume to Subscribed</span>
                                        <span className="text-xl font-bold text-red-500">75.5% drop</span>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden flex">
                                        <div className="bg-primary h-full w-[24.5%]"></div>
                                        <div className="bg-red-500 h-full w-[75.5%]"></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Many users preview resumes but don't upgrade to download. Pricing or feature gate might be too steep.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="pages" className="mt-0">
                    <div className="rounded-xl border bg-white shadow-sm dark:border-gray-800 dark:bg-[#1A1D24] p-8 text-center text-gray-500">
                        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Page-Level Data</h3>
                        <p className="max-w-sm mx-auto">Detailed tabular data for each page including average time spent and exit rates.</p>
                    </div>
                </TabsContent>

                <TabsContent value="performance" className="mt-0">
                    <div className="rounded-xl border bg-white shadow-sm dark:border-gray-800 dark:bg-[#1A1D24] p-8 text-center text-gray-500">
                        <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Core Web Vitals</h3>
                        <p className="max-w-sm mx-auto">Track LCP, CLS, and FID metrics directly from user browsers.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Analytics;
