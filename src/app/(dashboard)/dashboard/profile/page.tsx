"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
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
  Loader2,
  Save,
  X,
  KeyRound
} from "lucide-react";
import { AuthService } from "@/src/services/auth.service";
import { StorageService } from "@/src/services/storage.service";
import { STORAGE_PATHS } from "@/src/lib/constants";
import type { Profile } from "@/src/types/database";
import { PageHeader } from "@/components/dashboard/page-header";
import { toast } from "sonner";
import { cn } from "@/src/app/lib/utils";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageStatus, setImageStatus] = useState<"idle" | "loading" | "loaded" | "error">("idle");

  const showSkeleton = loading || (profile?.photo_url ? (imageStatus !== "loaded" && imageStatus !== "error") : false);

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

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Profile"
        icon={UserIcon}
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
                <button
                  onClick={handleImageClick}
                  disabled={isUploading || loading}
                  className="relative h-32 w-32 border-4 border-neutral-50 dark:border-neutral-800 shadow-md rounded-2xl overflow-hidden group focus:outline-none transition"
                  title="Change profile picture"
                >
                  <div className="w-full h-full relative transition-transform duration-200 ease-out group-active:scale-95">
                    {/* Always render Avatar so the image loads, but make it invisible when showSkeleton is true */}
                    {!loading && (
                      <Avatar className={cn("h-full w-full rounded-2xl", showSkeleton && "invisible")}>
                        <AvatarImage
                          src={profile?.photo_url || undefined}
                          alt={profile?.full_name}
                          className="object-cover rounded-2xl h-full w-full"
                          onLoadingStatusChange={(status) => {
                            setImageStatus(status);
                          }}
                        />
                        <AvatarFallback className="bg-neutral-100 text-2xl font-bold text-neutral-400 dark:bg-neutral-800 rounded-2xl flex items-center justify-center h-full w-full">
                          <UserIcon className="h-10 w-10 text-neutral-400" />
                        </AvatarFallback>
                      </Avatar>
                    )}

                    {showSkeleton && (
                      <Skeleton className="absolute inset-0 h-full w-full rounded-2xl" />
                    )}

                    {/* Hover overlay / Uploading state */}
                    {!showSkeleton && (
                      <div className={`absolute inset-0 bg-black/65 transition-opacity duration-200 flex flex-col items-center justify-center text-white gap-1.5 rounded-2xl ${isUploading ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                        {isUploading ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span className="text-[10px] font-medium tracking-wide">Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Camera className="h-5 w-5" />
                            <span className="text-[10px] font-medium tracking-wide">Change Photo</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              <div className="flex-1 text-center md:text-left flex flex-col justify-center">
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-56 mx-auto md:mx-0" />
                    <Skeleton className="h-5 w-36 mx-auto md:mx-0" />
                  </div>
                ) : (
                  <>
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
                      {profile?.full_name}
                    </h2>
                    <p className="text-lg text-neutral-500 dark:text-neutral-400">
                      @{profile?.username}
                    </p>
                  </>
                )}
                <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
                  <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 ring-1 ring-inset ring-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:ring-neutral-700">
                    Administrator
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-100 pt-8 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  Personal Information
                </h3>
                {loading ? (
                  <Skeleton className="h-9 w-28" />
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditClick}
                    className="gap-2 bg-transparent dark:bg-transparent border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <InfoCard
                  label="Full Name"
                  value={profile?.full_name || "-"}
                  icon={<UserIcon className="h-5 w-5 text-neutral-400" />}
                  loading={loading}
                />
                <InfoCard
                  label="Username"
                  value={profile?.username || "-"}
                  icon={<AtSign className="h-5 w-5 text-neutral-400" />}
                  loading={loading}
                />
                <InfoCard
                  label="Email"
                  value={profile?.email || "-"}
                  icon={<Mail className="h-5 w-5 text-neutral-400" />}
                  loading={loading}
                />
              </div>

              <div className="border-t border-neutral-100 mt-8 pt-8 dark:border-neutral-800 flex justify-start">
                <Link href="/dashboard/profile/password/change">
                  <Button
                    className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 gap-1.5"
                  >
                    <KeyRound className="h-4 w-4" />
                    Change Password
                  </Button>
                </Link>
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
              className="gap-1.5"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 gap-1.5"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoCard({
  label,
  value,
  icon,
  loading
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <Card className="border-none bg-neutral-50/50 shadow-none dark:bg-neutral-900/50">
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-neutral-800">
          {icon}
        </div>
        <div className="flex flex-col flex-1">
          <span className="text-xs text-neutral-500 dark:text-neutral-500">{label}</span>
          {loading ? (
            <Skeleton className="h-5 w-32 mt-1" />
          ) : (
            <span className="font-semibold text-neutral-900 dark:text-white truncate">{value}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
