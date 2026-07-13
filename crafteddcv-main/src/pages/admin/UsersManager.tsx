import React from "react";
import { Link } from "react-router-dom";
import { Users, UserPlus, CreditCard, Ban, Mail } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/admin/DataTable";
import { StatCard } from "@/components/admin/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock Data
type User = {
    id: string;
    name: string;
    email: string;
    plan: "Free" | "Pro" | "Lifetime";
    resumes: number;
    joined: string;
    status: "Active" | "Banned";
    country: string;
    avatar: string;
};

const mockUsers: User[] = [
    { id: "1", name: "Sarah Jenkins", email: "sarah.j@example.com", plan: "Pro", resumes: 5, joined: "2023-10-12", status: "Active", country: "USA", avatar: "https://i.pravatar.cc/150?u=1" },
    { id: "2", name: "Mike Thompson", email: "mike.t@example.com", plan: "Free", resumes: 1, joined: "2023-11-05", status: "Active", country: "UK", avatar: "https://i.pravatar.cc/150?u=2" },
    { id: "3", name: "Alex Wong", email: "alex.w@example.com", plan: "Lifetime", resumes: 12, joined: "2023-01-22", status: "Active", country: "Canada", avatar: "https://i.pravatar.cc/150?u=3" },
    { id: "4", name: "Emma Lopez", email: "emma.l@example.com", plan: "Free", resumes: 2, joined: "2023-12-01", status: "Banned", country: "Spain", avatar: "https://i.pravatar.cc/150?u=4" },
    { id: "5", name: "David Chen", email: "david.c@example.com", plan: "Pro", resumes: 8, joined: "2023-09-15", status: "Active", country: "Singapore", avatar: "https://i.pravatar.cc/150?u=5" },
];

const columns: ColumnDef<User>[] = [
    {
        accessorKey: "name",
        header: "User",
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div className="flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full bg-gray-100" />
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-900 dark:text-white leading-none">{user.name}</span>
                        <span className="text-xs text-gray-500 mt-1">{user.email}</span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "plan",
        header: "Plan",
        cell: ({ row }) => {
            const plan = row.getValue("plan") as string;
            return (
                <Badge variant={plan === "Free" ? "outline" : plan === "Pro" ? "default" : "secondary"}>
                    {plan}
                </Badge>
            );
        },
    },
    {
        accessorKey: "resumes",
        header: "Resumes",
    },
    {
        accessorKey: "country",
        header: "Country",
    },
    {
        accessorKey: "joined",
        header: "Joined Date",
        cell: ({ row }) => {
            return <span className="text-gray-500">{new Date(row.getValue("joined")).toLocaleDateString()}</span>;
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <Badge variant={status === "Active" ? "outline" : "destructive"} className={status === "Active" ? "text-green-600 border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900" : ""}>
                    {status}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-primary">
                        <Mail size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-500">
                        <Ban size={16} />
                    </Button>
                    <Button variant="outline" size="sm" className="h-8" asChild>
                        <Link to={`/admin/users/${user.id}`}>View Details</Link>
                    </Button>
                </div>
            );
        },
    },
];

const UsersManager = () => {
    return (
        <div className="space-y-6 pb-12 animate-in fade-in duration-500">

            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Users</h1>
                    <p className="text-gray-500 mt-1 dark:text-gray-400">Manage your users, subscriptions, and activity.</p>
                </div>
                <div className="flex gap-2">
                    <Button className="gap-2">
                        <UserPlus size={16} /> Add User
                    </Button>
                </div>
            </div>

            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Users" value="12,450" trend={12.5} icon={Users} />
                <StatCard title="Active Subscribers" value="2,840" trend={5.2} icon={CreditCard} />
                <StatCard title="New Today" value="124" trend={-2.4} icon={UserPlus} />
                <StatCard title="Banned Users" value="45" icon={Ban} />
            </div>

            {/* Data Table */}
            <DataTable columns={columns} data={mockUsers} searchKey="name" searchPlaceholder="Search users by name..." />

        </div>
    );
};

export default UsersManager;
