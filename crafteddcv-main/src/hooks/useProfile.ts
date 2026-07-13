import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "@/hooks/use-toast";

export interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  bio: string | null;
  phone: string | null;
  location: string | null;
  website: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const resolveAvatarUrl = async (path: string | null): Promise<string | null> => {
    if (!path) return null;
    if (/^https?:\/\//.test(path)) return path;
    const { data, error } = await supabase.storage
      .from("avatars")
      .createSignedUrl(path, 60 * 60 * 24 * 7);
    if (error) return null;
    return data?.signedUrl ?? null;
  };

  const fetchProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      let record = data;
      if (!record) {
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert({
            user_id: user.id,
            display_name: user.email?.split('@')[0] || null
          })
          .select()
          .single();
        if (createError) throw createError;
        record = newProfile;
      }
      const signedUrl = await resolveAvatarUrl(record.avatar_url);
      setProfile({ ...record, avatar_url: signedUrl });
    } catch (error: any) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Pick<Profile, 'display_name' | 'bio' | 'phone' | 'location' | 'website' | 'avatar_url'>>) => {
    if (!user || !profile) return { error: new Error("No user or profile") };
    
    setUpdating(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      
      setProfile(data);
      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });
      
      return { data, error: null };
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      return { data: null, error };
    } finally {
      setUpdating(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return { error: new Error("No user") };

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, or WebP image.",
        variant: "destructive",
      });
      return { error: new Error("Invalid file type") };
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 2MB.",
        variant: "destructive",
      });
      return { error: new Error("File too large") };
    }

    setUploadingAvatar(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`;

      // Look up existing stored path (state may hold a signed URL, not the path)
      const { data: existing } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('user_id', user.id)
        .maybeSingle();
      const oldPath = existing?.avatar_url && !/^https?:\/\//.test(existing.avatar_url)
        ? existing.avatar_url
        : null;
      if (oldPath) {
        await supabase.storage.from('avatars').remove([oldPath]);
      }

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: fileName })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      await fetchProfile();

      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated.",
      });

      return { error: null };
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
      return { error };
    } finally {
      setUploadingAvatar(false);
    }
  };

  const removeAvatar = async () => {
    if (!user || !profile?.avatar_url) return;

    setUploadingAvatar(true);
    try {
      const { data: existing } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('user_id', user.id)
        .maybeSingle();
      const oldPath = existing?.avatar_url && !/^https?:\/\//.test(existing.avatar_url)
        ? existing.avatar_url
        : null;
      if (oldPath) {
        await supabase.storage.from('avatars').remove([oldPath]);
      }

      await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('user_id', user.id);

      await fetchProfile();

      toast({
        title: "Avatar removed",
        description: "Your profile picture has been removed.",
      });
    } catch (error) {
      console.error("Error removing avatar:", error);
      toast({
        title: "Error",
        description: "Failed to remove avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  return { 
    profile, 
    loading, 
    updating, 
    uploadingAvatar,
    updateProfile, 
    uploadAvatar,
    removeAvatar,
    refetch: fetchProfile 
  };
};
