import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Save, Upload, Link as LinkIcon, AlertTriangle, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

const GlobalSettings = () => {
    const queryClient = useQueryClient();

    // Fetch Global Brand Settings
    const { data: brandSettings, isLoading: loadingBrand } = useQuery({
        queryKey: ['cms_settings', 'global_brand'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('cms_settings')
                .select('value')
                .eq('key', 'global_brand')
                .single();

            if (error && error.code !== 'PGRST116') throw error; // ignore row not found

            return (data?.value as { primary_color: string; accent_color: string; font_family: string }) || {
                primary_color: "#0ea5e9",
                accent_color: "#f59e0b",
                font_family: "Inter"
            };
        }
    });

    const [brandForm, setBrandForm] = React.useState({
        primary_color: "#0ea5e9",
        accent_color: "#f59e0b",
        font_family: "Inter"
    });

    // Sync form state when data loads
    React.useEffect(() => {
        if (brandSettings) {
            setBrandForm({
                primary_color: brandSettings.primary_color || "#0ea5e9",
                accent_color: brandSettings.accent_color || "#f59e0b",
                font_family: brandSettings.font_family || "Inter"
            });
        }
    }, [brandSettings]);

    // Fetch Maintenance Mode Settings
    const { data: maintenanceSettings } = useQuery({
        queryKey: ['cms_settings', 'maintenance_mode'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('cms_settings')
                .select('value')
                .eq('key', 'maintenance_mode')
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            return (data?.value as { enabled: boolean; message: string }) || {
                enabled: false,
                message: "We are currently undergoing scheduled maintenance to upgrade the resume engine. We'll be back online shortly!"
            };
        }
    });

    const [maintenanceForm, setMaintenanceForm] = React.useState({
        enabled: false,
        message: "We are currently undergoing scheduled maintenance to upgrade the resume engine. We'll be back online shortly!"
    });

    React.useEffect(() => {
        if (maintenanceSettings) {
            setMaintenanceForm({
                enabled: maintenanceSettings.enabled || false,
                message: maintenanceSettings.message || "We are currently undergoing scheduled maintenance to upgrade the resume engine. We'll be back online shortly!"
            });
        }
    }, [maintenanceSettings]);


    // Mutation to save settings
    const saveSettingsMutation = useMutation({
        mutationFn: async (payload: { key: string, value: any }) => {
            const { error } = await supabase
                .from('cms_settings')
                .upsert({
                    key: payload.key,
                    value: payload.value,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'key' });

            if (error) throw error;
        },
        onSuccess: () => {
            toast.success("Settings saved successfully");
            queryClient.invalidateQueries({ queryKey: ['cms_settings'] });
        },
        onError: (err) => {
            toast.error("Failed to save settings: " + err.message);
        }
    });

    const [activeTab, setActiveTab] = useState("brand");

    const handleSave = () => {
        if (activeTab === 'brand') {
            saveSettingsMutation.mutate({ key: 'global_brand', value: brandForm });
        } else if (activeTab === 'maintenance') {
            saveSettingsMutation.mutate({ key: 'maintenance_mode', value: maintenanceForm });
        } else {
            toast.info(`Saving for the ${activeTab} tab is not fully implemented yet.`);
        }
    };

    return (
        <div className="space-y-6 pb-12 animate-in fade-in duration-500 max-w-5xl">

            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Global Settings</h1>
                    <p className="text-gray-500 mt-1 dark:text-gray-400">Manage site-wide configuration, branding, and integrations.</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={saveSettingsMutation.isPending || loadingBrand} className="gap-2">
                        {saveSettingsMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {saveSettingsMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-4 bg-white border dark:bg-[#1A1D24] dark:border-gray-800 w-full justify-start overflow-x-auto h-auto p-1 py-1.5 flex-nowrap rounded-lg shadow-sm">
                    <TabsTrigger value="brand" className="rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary dark:data-[state=active]:bg-primary/20">Brand & Identity</TabsTrigger>
                    <TabsTrigger value="navigation" className="rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary dark:data-[state=active]:bg-primary/20">Navigation</TabsTrigger>
                    <TabsTrigger value="footer" className="rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary dark:data-[state=active]:bg-primary/20">Footer</TabsTrigger>
                    <TabsTrigger value="announcements" className="rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary dark:data-[state=active]:bg-primary/20">Announcements</TabsTrigger>
                    <TabsTrigger value="cookie" className="rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary dark:data-[state=active]:bg-primary/20">Cookie & Privacy</TabsTrigger>
                    <TabsTrigger value="integrations" className="rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary dark:data-[state=active]:bg-primary/20">Integrations</TabsTrigger>
                    <TabsTrigger value="maintenance" className="rounded-md data-[state=active]:bg-red-50 text-red-600 data-[state=active]:text-red-700 dark:data-[state=active]:bg-red-950/30">Maintenance</TabsTrigger>
                </TabsList>

                {/* Brand Tab */}
                <TabsContent value="brand" className="mt-0 space-y-6">
                    <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1A1D24]">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">General Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="site-name">Site Name</Label>
                                <Input id="site-name" defaultValue="CraftedCV" className="dark:bg-[#0F1117] dark:border-gray-700" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="site-tagline">Site Tagline</Label>
                                <Input id="site-tagline" defaultValue="AI-Powered Resume Builder" className="dark:bg-[#0F1117] dark:border-gray-700" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t dark:border-gray-800">
                            <div className="space-y-4">
                                <Label>Logos</Label>
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 rounded-lg bg-gray-100 dark:bg-gray-800 border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <img src={logo} alt="Light" className="h-8 w-auto" />
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        <p className="font-medium text-gray-700 dark:text-gray-300">Light / Default Logo</p>
                                        <p>Used on light backgrounds (SVG, PNG)</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 rounded-lg bg-gray-900 border-2 text-white border-dashed flex items-center justify-center cursor-pointer hover:bg-black">
                                        <img src={logo} alt="Dark" className="h-8 w-auto brightness-0 invert" />
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        <p className="font-medium text-gray-700 dark:text-gray-300">Dark Logo</p>
                                        <p>Used on dark backgrounds (SVG, PNG)</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label>Brand Colors</Label>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={brandForm.primary_color}
                                            onChange={(e) => setBrandForm({ ...brandForm, primary_color: e.target.value })}
                                            className="h-10 w-10 p-0 border-0 rounded cursor-pointer shrink-0"
                                        />
                                        <div className="flex-1">
                                            <Label className="text-xs text-gray-500">Primary Color</Label>
                                            <Input
                                                value={brandForm.primary_color}
                                                onChange={(e) => setBrandForm({ ...brandForm, primary_color: e.target.value })}
                                                className="h-8 font-mono text-sm dark:bg-[#0F1117]"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={brandForm.accent_color}
                                            onChange={(e) => setBrandForm({ ...brandForm, accent_color: e.target.value })}
                                            className="h-10 w-10 p-0 border-0 rounded cursor-pointer shrink-0"
                                        />
                                        <div className="flex-1">
                                            <Label className="text-xs text-gray-500">Secondary / Accent Color</Label>
                                            <Input
                                                value={brandForm.accent_color}
                                                onChange={(e) => setBrandForm({ ...brandForm, accent_color: e.target.value })}
                                                className="h-8 font-mono text-sm dark:bg-[#0F1117]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t dark:border-gray-800">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Typography</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Heading Font</Label>
                                    <select
                                        value={brandForm.font_family}
                                        onChange={(e) => setBrandForm({ ...brandForm, font_family: e.target.value })}
                                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-[#0F1117]"
                                    >
                                        <option value="Inter">Inter</option>
                                        <option value="Space Grotesk">Space Grotesk</option>
                                        <option value="DM Sans">DM Sans</option>
                                        <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Body Font</Label>
                                    <select defaultValue="Inter" className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-[#0F1117]">
                                        <option value="Inter">Inter</option>
                                        <option value="Roboto">Roboto</option>
                                        <option value="Open Sans">Open Sans</option>
                                        <option value="System UI">System UI</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Placeholder contents for other tabs for brevity, keeping all the requested structures intact as UI */}
                <TabsContent value="navigation" className="mt-0">
                    <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1A1D24] flex items-center justify-center min-h-[400px]">
                        <p className="text-gray-500">Navigation builder interface goes here.</p>
                    </div>
                </TabsContent>

                <TabsContent value="footer" className="mt-0">
                    <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1A1D24] flex items-center justify-center min-h-[400px]">
                        <p className="text-gray-500">Footer link manager goes here.</p>
                    </div>
                </TabsContent>

                <TabsContent value="integrations" className="mt-0">
                    <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1A1D24]">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Third-party Integrations</h3>
                        <div className="space-y-6 max-w-2xl">
                            <div className="space-y-2">
                                <Label>Google Analytics ID / Tag Manager</Label>
                                <Input defaultValue="G-XXXXXXXXXX" className="font-mono dark:bg-[#0F1117] dark:border-gray-700" />
                            </div>
                            <div className="space-y-2">
                                <Label>Meta Pixel ID</Label>
                                <Input placeholder="Enter Pixel ID" className="font-mono dark:bg-[#0F1117] dark:border-gray-700" />
                            </div>
                            <div className="space-y-2">
                                <Label>Stripe Public Key (Read Only)</Label>
                                <Input defaultValue="pk_test_51Nx..." disabled className="font-mono bg-gray-50 dark:bg-gray-900 dark:border-gray-700" />
                                <p className="text-xs text-gray-500">Manage payment keys securely in your environment variables.</p>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="maintenance" className="mt-0">
                    <div className="rounded-xl border border-red-200 bg-red-50/50 p-6 shadow-sm dark:border-red-900/30 dark:bg-[#1A1D24]">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-red-100 rounded-full text-red-600 dark:bg-red-900/40">
                                <AlertTriangle size={24} />
                            </div>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-red-900 dark:text-red-400">Maintenance Mode</h3>
                                    <p className="text-sm text-red-700 mt-1 dark:text-red-300/80">
                                        When enabled, all visitors except logged-in admins will see a maintenance page.
                                    </p>
                                </div>

                                <div className="flex items-center justify-between border-y border-red-200 dark:border-red-900/30 py-4">
                                    <span className="font-medium text-gray-900 dark:text-white">Enable Maintenance Mode</span>
                                    <Switch
                                        checked={maintenanceForm.enabled}
                                        onCheckedChange={(checked) => setMaintenanceForm({ ...maintenanceForm, enabled: checked })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-gray-700 dark:text-gray-300">Custom Status Message</Label>
                                    <Textarea
                                        value={maintenanceForm.message}
                                        onChange={(e) => setMaintenanceForm({ ...maintenanceForm, message: e.target.value })}
                                        className="dark:bg-[#0F1117] dark:border-gray-700 border-red-200 min-h-[100px]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

            </Tabs>
        </div>
    );
};

export default GlobalSettings;
