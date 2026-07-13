import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
    title: string;
    value: string | number;
    trend?: number;
    trendLabel?: string;
    icon: React.ElementType;
    className?: string;
}

export const StatCard = ({ title, value, trend, trendLabel, icon: Icon, className }: StatCardProps) => {
    const isPositive = trend && trend > 0;
    const isNegative = trend && trend < 0;

    return (
        <div className={cn("rounded-xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1A1D24]", className)}>
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon size={20} />
                </div>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{value}</span>

                {trend !== undefined && (
                    <div
                        className={cn(
                            "flex items-center text-xs font-medium",
                            isPositive ? "text-green-600 dark:text-green-400" : "",
                            isNegative ? "text-red-600 dark:text-red-400" : "",
                            !isPositive && !isNegative ? "text-gray-500" : ""
                        )}
                    >
                        {isPositive && <TrendingUp size={14} className="mr-1" />}
                        {isNegative && <TrendingDown size={14} className="mr-1" />}
                        {Math.abs(trend)}%
                        {trendLabel && <span className="ml-1 text-gray-400 font-normal">{trendLabel}</span>}
                    </div>
                )}
            </div>
        </div>
    );
};
