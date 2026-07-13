import React from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from "recharts";
import { Users, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

const mapData = [
    { country: "United States", users: 4500 },
    { country: "India", users: 3200 },
    { country: "United Kingdom", users: 1800 },
    { country: "Canada", users: 1200 },
    { country: "Germany", users: 950 },
    { country: "Australia", users: 800 },
];

const ageData = [
    { name: "18-24", value: 35, color: "#4f46e5" },
    { name: "25-34", value: 45, color: "#0ea5e9" },
    { name: "35-44", value: 15, color: "#8b5cf6" },
    { name: "45+", value: 5, color: "#ec4899" },
];

const Demographics = () => {
    return (
        <div className="space-y-6 pb-12 animate-in fade-in duration-500 max-w-7xl">

            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b dark:border-gray-800 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
                        <Users className="text-primary" size={28} /> Demographics
                    </h1>
                    <p className="text-gray-500 mt-1 dark:text-gray-400">Understand your user base distribution and segments.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2 dark:border-gray-700 bg-white dark:bg-[#1A1D24]">
                        <Filter size={16} /> Filter Segments
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

                {/* Top Countries Bar Chart */}
                <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1A1D24]">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Top Countries by User Base</h3>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mapData} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#374151" opacity={0.1} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="country" type="category" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 13 }} width={120} />
                                <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1A1D24', borderColor: '#374151', color: '#fff', borderRadius: '8px' }} />
                                <Bar dataKey="users" fill="#0ea5e9" radius={[0, 4, 4, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Age Group Donut Chart */}
                <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1A1D24]">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Age Distribution</h3>
                    <div className="h-[350px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={ageData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {ageData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip contentStyle={{ backgroundColor: '#1A1D24', borderColor: '#374151', borderRadius: '8px', color: '#fff' }} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Demographics;
