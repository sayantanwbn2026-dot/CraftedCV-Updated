import React, { useState } from "react";
import { Mail, Edit2, Plus, Code, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Mock Data
const templates = [
    { id: 1, name: "Welcome Email", subject: "Welcome to CraftedCV! 🚀", key: "welcome_user", status: "Active" },
    { id: 2, name: "Password Reset", subject: "Reset your CraftedCV password", key: "auth_reset", status: "Active" },
    { id: 3, name: "Subscription Confirmation", subject: "Your Pro Subscription is Active", key: "billing_success", status: "Active" },
    { id: 4, name: "Payment Failed", subject: "Action Required: Payment Failed", key: "billing_failed", status: "Active" },
    { id: 5, name: "Weekly Stats", subject: "Your Weekly Resume Stats", key: "user_digest", status: "Draft" },
];

const EmailTemplates = () => {
    const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">

            {/* Header section */}
            <div className="flex items-center justify-between mb-6 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Email Templates</h1>
                    <p className="text-gray-500 mt-1 dark:text-gray-400">Manage transactional emails sent to users.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2 dark:border-gray-700 bg-white dark:bg-[#1A1D24]">
                        <Code size={16} /> SMTP Config
                    </Button>
                    <Button className="gap-2">
                        <Plus size={16} /> New Template
                    </Button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row flex-1 gap-6 overflow-hidden">

                {/* Template List (Sidebar) */}
                <div className="w-full lg:w-80 shrink-0 flex flex-col gap-2 overflow-y-auto custom-scrollbar border-r dark:border-gray-800 pr-4">
                    <h3 className="text-sm font-semibold uppercase text-gray-500 mb-2">Transactional</h3>
                    {templates.map(template => (
                        <button
                            key={template.id}
                            onClick={() => setSelectedTemplate(template)}
                            className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all
                ${selectedTemplate.id === template.id
                                    ? "border-primary bg-primary/5 dark:bg-primary/10 dark:border-primary/50"
                                    : "border-gray-200 bg-white hover:border-primary/50 dark:border-gray-800 dark:bg-[#1A1D24] dark:hover:border-gray-700"}
              `}
                        >
                            <div className="flex justify-between w-full mb-1">
                                <span className={`font-semibold ${selectedTemplate.id === template.id ? "text-primary dark:text-primary" : "text-gray-900 dark:text-white"}`}>
                                    {template.name}
                                </span>
                                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${template.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                                    {template.status}
                                </span>
                            </div>
                            <span className="text-xs text-gray-500 font-mono mb-2">{template.key}</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400 truncate w-full">{template.subject}</span>
                        </button>
                    ))}
                </div>

                {/* Template Editor */}
                <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-[#1A1D24] rounded-xl border dark:border-gray-800 shadow-sm relative">

                    <div className="border-b dark:border-gray-800 p-4 sm:p-6 bg-gray-50/50 dark:bg-gray-900/30 flex justify-between items-center shrink-0">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Edit: {selectedTemplate.name}</h2>
                            <p className="text-sm text-gray-500 font-mono mt-1">Key: {selectedTemplate.key}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="hidden sm:flex dark:border-gray-700">
                                <Send size={14} className="mr-2" /> Send Test
                            </Button>
                            <Button size="sm">Save Template</Button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Email Subject</Label>
                                    <Input defaultValue={selectedTemplate.subject} className="dark:bg-[#0F1117] dark:border-gray-700" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Preview Text (Preheader)</Label>
                                    <Input placeholder="Hidden text shown in inbox preview..." className="dark:bg-[#0F1117] dark:border-gray-700" />
                                </div>
                            </div>

                            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-lg">
                                <p className="text-xs text-blue-800 dark:text-blue-300">
                                    <span className="font-semibold">Available Variables:</span> {'{{user_name}}'}, {'{{action_url}}'}, {'{{app_name}}'}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2 flex-1 flex flex-col">
                            <div className="flex items-center justify-between">
                                <Label>Email Body (HTML / Markdown)</Label>
                                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded p-1">
                                    <button className="px-2 py-1 text-xs font-medium rounded bg-white dark:bg-gray-700 shadow-sm">Design</button>
                                    <button className="px-2 py-1 text-xs font-medium rounded text-gray-500 hover:text-gray-900 dark:hover:text-gray-300">Code</button>
                                </div>
                            </div>

                            {/* Fake rich text editor for email */}
                            <div className="flex-1 min-h-[400px] border dark:border-gray-700 rounded-lg flex flex-col overflow-hidden">
                                <div className="bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700 p-2 flex gap-1">
                                    <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500">B</Button>
                                    <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500">I</Button>
                                    <div className="w-px h-5 bg-gray-300 dark:bg-gray-700 my-auto mx-1" />
                                    <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500">{'< >'}</Button>
                                </div>
                                <Textarea
                                    className="flex-1 border-0 rounded-none focus-visible:ring-0 resize-none font-mono text-sm p-4 dark:bg-[#0F1117]"
                                    defaultValue={`<h1>Welcome to {{app_name}}!</h1>\n\n<p>Hi {{user_name}},</p>\n\n<p>Thanks for joining us. We're thrilled to have you here.</p>\n\n<p>Click the button below to get started and build your first AI-powered resume.</p>\n\n<a href="{{action_url}}" class="button">Go to Dashboard</a>\n\n<p>Cheers,<br>The {{app_name}} Team</p>`}
                                />
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default EmailTemplates;
