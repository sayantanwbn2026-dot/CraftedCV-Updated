import { useState, useEffect, useRef } from "react";
import { User, MapPin, Globe, Phone, FileText, Save, Loader2, Camera, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useProfile } from "@/hooks/useProfile";

const UserProfileCard = () => {
  const { profile, loading, updating, uploadingAvatar, updateProfile, uploadAvatar, removeAvatar } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    display_name: "",
    bio: "",
    phone: "",
    location: "",
    website: "",
  });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        display_name: profile.display_name || "",
        bio: profile.bio || "",
        phone: profile.phone || "",
        location: profile.location || "",
        website: profile.website || "",
      });
    }
  }, [profile]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    await updateProfile(formData);
    setHasChanges(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadAvatar(file);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getInitials = () => {
    if (profile?.display_name) {
      return profile.display_name.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  if (loading) {
    return (
      <div className="p-8 border border-border/30 rounded-lg bg-card/30 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground font-mono text-sm">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative p-6 border border-border/30 rounded-lg bg-card/30 backdrop-blur-sm">
      {/* Corner Accents */}
      <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-foreground/10 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-foreground/10 rounded-bl-lg" />

      {/* Header with Avatar */}
      <div className="flex items-start gap-4 mb-6">
        {/* Avatar Upload */}
        <div className="relative group">
          <Avatar className="w-20 h-20 border-2 border-border/50">
            <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.display_name || "User"} />
            <AvatarFallback className="bg-foreground/5 text-foreground text-lg font-medium">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          
          {/* Upload Overlay */}
          <button
            onClick={handleAvatarClick}
            disabled={uploadingAvatar}
            className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-wait"
          >
            {uploadingAvatar ? (
              <Loader2 className="w-5 h-5 animate-spin text-foreground" />
            ) : (
              <Camera className="w-5 h-5 text-foreground" />
            )}
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-medium text-foreground">Profile Settings</h3>
          <p className="font-mono text-xs text-muted-foreground mb-2">Update your personal information</p>
          
          {/* Avatar Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAvatarClick}
              disabled={uploadingAvatar}
              className="font-mono text-xs"
            >
              {uploadingAvatar ? (
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              ) : (
                <Camera className="w-3 h-3 mr-1" />
              )}
              Upload Photo
            </Button>
            {profile?.avatar_url && (
              <Button
                variant="ghost"
                size="sm"
                onClick={removeAvatar}
                disabled={uploadingAvatar}
                className="font-mono text-xs text-destructive hover:text-destructive"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Remove
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Form Grid */}
      <div className="grid gap-5">
        {/* Display Name */}
        <div className="space-y-2">
          <Label htmlFor="display_name" className="font-mono text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <User className="w-3 h-3" />
            Display Name
          </Label>
          <Input
            id="display_name"
            value={formData.display_name}
            onChange={(e) => handleChange("display_name", e.target.value)}
            placeholder="Your name"
            className="bg-background/50 border-border/50 focus:border-foreground/30"
          />
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio" className="font-mono text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <FileText className="w-3 h-3" />
            Bio
          </Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            placeholder="A brief description about yourself"
            rows={3}
            className="bg-background/50 border-border/50 focus:border-foreground/30 resize-none"
          />
        </div>

        {/* Two Column Grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="font-mono text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Phone className="w-3 h-3" />
              Phone
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+1 234 567 8900"
              className="bg-background/50 border-border/50 focus:border-foreground/30"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="font-mono text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <MapPin className="w-3 h-3" />
              Location
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="City, Country"
              className="bg-background/50 border-border/50 focus:border-foreground/30"
            />
          </div>
        </div>

        {/* Website */}
        <div className="space-y-2">
          <Label htmlFor="website" className="font-mono text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Globe className="w-3 h-3" />
            Website
          </Label>
          <Input
            id="website"
            value={formData.website}
            onChange={(e) => handleChange("website", e.target.value)}
            placeholder="https://yourwebsite.com"
            className="bg-background/50 border-border/50 focus:border-foreground/30"
          />
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <Button
            onClick={handleSave}
            disabled={!hasChanges || updating}
            variant="outline"
            className="font-mono text-xs uppercase tracking-wider hover:shadow-glow-white disabled:opacity-50"
          >
            {updating ? (
              <>
                <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-3 h-3 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
