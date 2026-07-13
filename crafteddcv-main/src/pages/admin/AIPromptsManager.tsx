import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Plus, BrainCircuit, Save, Trash2, Edit } from "lucide-react";

export default function AIPromptsManager() {
    const queryClient = useQueryClient();
    const [selectedPrompt, setSelectedPrompt] = useState<any | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    // Fetch Prompts
    const { data: prompts = [], isLoading } = useQuery({
        queryKey: ['cms_ai_prompts'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('cms_ai_prompts')
                .select('*')
                .order('updated_at', { ascending: false });

            if (error) throw error;
            return data || [];
        }
    });

    const [formState, setFormState] = useState({
        prompt_key: '',
        system_instruction: '',
        model_params: { temperature: 0.7, max_tokens: 1024 }
    });

    useEffect(() => {
        if (selectedPrompt) {
            setFormState({
                prompt_key: selectedPrompt.prompt_key,
                system_instruction: selectedPrompt.system_instruction,
                model_params: selectedPrompt.model_params || { temperature: 0.7, max_tokens: 1024 }
            });
        }
    }, [selectedPrompt]);

    const saveMutation = useMutation({
        mutationFn: async (payload: any) => {
            if (selectedPrompt?.id) {
                // Update
                const { error } = await supabase
                    .from('cms_ai_prompts')
                    .update({
                        prompt_key: payload.prompt_key,
                        system_instruction: payload.system_instruction,
                        model_params: payload.model_params,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', selectedPrompt.id);
                if (error) throw error;
            } else {
                // Insert
                const { error } = await supabase
                    .from('cms_ai_prompts')
                    .insert([{
                        prompt_key: payload.prompt_key,
                        system_instruction: payload.system_instruction,
                        model_params: payload.model_params
                    }]);
                if (error) throw error;
            }
        },
        onSuccess: () => {
            toast.success("AI Prompt saved successfully");
            queryClient.invalidateQueries({ queryKey: ['cms_ai_prompts'] });
            setIsCreating(false);
            setSelectedPrompt(null);
        },
        onError: (err) => {
            toast.error("Failed to save: " + err.message);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('cms_ai_prompts').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            toast.success("Prompt deleted");
            queryClient.invalidateQueries({ queryKey: ['cms_ai_prompts'] });
            setSelectedPrompt(null);
        }
    });

    const handleSave = () => {
        saveMutation.mutate(formState);
    };

    const handleCreateNew = () => {
        setIsCreating(true);
        setSelectedPrompt(null);
        setFormState({
            prompt_key: '',
            system_instruction: 'You are an expert resume writer...',
            model_params: { temperature: 0.7, max_tokens: 1024 }
        });
    };

    return (
        <div className="space-y-6 pb-12 animate-in fade-in duration-500 max-w-6xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                        <BrainCircuit className="h-8 w-8 text-primary" />
                        AI Prompts Manager
                    </h1>
                    <p className="text-gray-500 mt-1 dark:text-gray-400">Manage backend system instructions and AI parameters for the resume engine.</p>
                </div>
                <Button onClick={handleCreateNew} className="gap-2">
                    <Plus size={16} /> New Prompt
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: List */}
                <div className="lg:col-span-1 border rounded-xl bg-white shadow-sm dark:bg-[#1A1D24] dark:border-gray-800 overflow-hidden h-[calc(100vh-250px)] flex flex-col">
                    <div className="p-4 border-b dark:border-gray-800 font-semibold bg-gray-50/50 dark:bg-gray-800/20">
                        Configured Prompts
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {isLoading ? (
                            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
                        ) : prompts.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center p-4">No prompts found. Create one.</p>
                        ) : (
                            prompts.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => { setSelectedPrompt(p); setIsCreating(false); }}
                                    className={`w-full text-left p-3 rounded-lg border transition-all ${selectedPrompt?.id === p.id
                                            ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                            : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                        }`}
                                >
                                    <div className="font-medium text-sm text-gray-900 dark:text-white truncate">{p.prompt_key}</div>
                                    <div className="text-xs text-gray-500 truncate mt-1">{p.system_instruction}</div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Column: Editor */}
                <div className="lg:col-span-2 border rounded-xl bg-white shadow-sm dark:bg-[#1A1D24] dark:border-gray-800 p-6 min-h-[500px]">
                    {!(selectedPrompt || isCreating) ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                            <BrainCircuit className="h-12 w-12 opacity-20" />
                            <p>Select a prompt to edit or create a new one.</p>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in">
                            <div className="flex items-center justify-between border-b dark:border-gray-800 pb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {isCreating ? 'Create New Prompt' : 'Edit Prompt'}
                                </h3>
                                <div className="flex gap-2">
                                    {!isCreating && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                                            onClick={() => {
                                                if (confirm('Are you sure you want to delete this prompt?')) {
                                                    deleteMutation.mutate(selectedPrompt.id);
                                                }
                                            }}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    )}
                                    <Button onClick={handleSave} disabled={saveMutation.isPending} className="gap-2">
                                        {saveMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                        Save Prompt
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Prompt Key (Unique Identifier)</Label>
                                    <Input
                                        value={formState.prompt_key}
                                        onChange={(e) => setFormState({ ...formState, prompt_key: e.target.value })}
                                        placeholder="e.g., generate_summary, enhance_experience"
                                        className="font-mono text-sm dark:bg-[#0F1117] dark:border-gray-700"
                                        disabled={!isCreating} // Usually don't want to change keys once established
                                    />
                                    <p className="text-xs text-gray-500">This key is used by the backend edge functions to fetch the correct prompt.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label>System Instruction</Label>
                                    <Textarea
                                        value={formState.system_instruction}
                                        onChange={(e) => setFormState({ ...formState, system_instruction: e.target.value })}
                                        className="min-h-[250px] font-mono text-sm dark:bg-[#0F1117] dark:border-gray-700 leading-relaxed"
                                        placeholder="You are an expert ATS-friendly resume copywriter..."
                                    />
                                    <p className="text-xs text-gray-500">The core instruction given to the LLM (e.g. GPT-4, Claude) for this task.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t dark:border-gray-800">
                                    <div className="space-y-2">
                                        <Label>Temperature (0.0 - 2.0)</Label>
                                        <Input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="2"
                                            value={formState.model_params.temperature}
                                            onChange={(e) => setFormState({
                                                ...formState,
                                                model_params: { ...formState.model_params, temperature: parseFloat(e.target.value) }
                                            })}
                                            className="dark:bg-[#0F1117] dark:border-gray-700"
                                        />
                                        <p className="text-[10px] text-gray-500">Higher = more creative, Lower = more deterministic.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Max Tokens</Label>
                                        <Input
                                            type="number"
                                            step="100"
                                            min="100"
                                            value={formState.model_params.max_tokens}
                                            onChange={(e) => setFormState({
                                                ...formState,
                                                model_params: { ...formState.model_params, max_tokens: parseInt(e.target.value, 10) }
                                            })}
                                            className="dark:bg-[#0F1117] dark:border-gray-700"
                                        />
                                        <p className="text-[10px] text-gray-500">Max length of the generated response.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
