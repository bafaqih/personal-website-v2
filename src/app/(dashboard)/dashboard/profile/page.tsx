"use client";

import { useEffect, useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Camera, 
  Mail, 
  Pencil, 
  User as UserIcon, 
  AtSign, 
  Loader2
} from "lucide-react";
import { AuthService } from "@/src/services/auth.service";
import { StorageService } from "@/src/services/storage.service";
import { STORAGE_PATHS } from "@/src/lib/constants";
import type { Profile } from "@/src/types/database";
import { PageHeader } from "@/components/dashboard/page-header";
import { toast } from "sonner";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await AuthService.getProfile();
      if (data) {
        setProfile(data);
        setFullName(data.full_name);
        setUsername(data.username);
        setEmail(data.email);
      }
    } catch (error) {
      toast.error("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    try {
      setIsSaving(true);
      const updated = await AuthService.updateProfile(profile.id, {
        full_name: fullName,
        username: username,
        email: email,
      });
      setProfile(updated);
      setIsEditModalOpen(false);
      toast.success("Profile updated successfully");
      // Reload to update header (or use a global state if available)
      window.location.reload();
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);
      const { publicUrl } = await StorageService.uploadImage(STORAGE_PATHS.PROFILES, file);
      
      const updated = await AuthService.updateProfile(profile.id, {
        photo_url: publicUrl,
      });
      
      setProfile(updated);
      toast.success("Profile picture updated");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "AD";

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="My Profile"
        description="Manage your account settings and profile information."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Profile" },
        ]}
      />

      <div className="grid gap-8">
        {/* Profile Header Card */}
        <Card className="overflow-hidden border-none bg-white shadow-sm dark:bg-neutral-900">
          <CardContent className="p-8 space-y-8">
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-center">
              <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-neutral-50 dark:border-neutral-800 shadow-md">
                  <AvatarImage src={profile?.photo_url || undefined} alt={profile?.full_name} className="object-cover" />
                  <AvatarFallback className="bg-neutral-100 text-2xl font-bold text-neutral-400 dark:bg-neutral-800">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                
                <button
                  onClick={handleImageClick}
                  disabled={isUploading}
                  className="absolute bottom-0 right-0 rounded-full bg-emerald-500 p-2 text-white shadow-lg transition-transform hover:scale-110 active:scale-95 disabled:bg-neutral-400"
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
                  {profile?.full_name}
                </h2>
                <p className="text-lg text-neutral-500 dark:text-neutral-400">
                  @{profile?.username}
                </p>
                <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20">
                    Administrator
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-100 pt-8 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  Informasi Pribadi
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditClick}
                  className="gap-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
                >
                  <Pencil className="h-4 w-4" />
                  Edit Profil
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <InfoCard
                  label="Nama Lengkap"
                  value={profile?.full_name || "-"}
                  icon={<UserIcon className="h-5 w-5 text-neutral-400" />}
                />
                <InfoCard
                  label="Username"
                  value={profile?.username || "-"}
                  icon={<AtSign className="h-5 w-5 text-neutral-400" />}
                />
                <InfoCard
                  label="Email"
                  value={profile?.email || "-"}
                  icon={<Mail className="h-5 w-5 text-neutral-400" />}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <Card className="border-none bg-neutral-50/50 shadow-none dark:bg-neutral-900/50">
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-neutral-800">
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-neutral-500 dark:text-neutral-500">{label}</span>
          <span className="font-semibold text-neutral-900 dark:text-white">{value}</span>
        </div>
      </CardContent>
    </Card>
  );
}
