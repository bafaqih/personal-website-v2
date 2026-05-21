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
  Eye,
  Mail,
  Pencil,
  User as UserIcon,
  AtSign,
  Loader2,
  Save,
  X,
  KeyRound,
  Trash2
} from "lucide-react";
import { AuthService } from "@/src/services/auth.service";
import { StorageService } from "@/src/services/storage.service";
import { STORAGE_PATHS } from "@/src/lib/constants";
import type { Profile } from "@/src/types/database";
import { cropToSquare } from "@/src/app/lib/image";
import { PageHeader } from "@/components/dashboard/page-header";
import { ImageViewerModal } from "@/components/dashboard/image-viewer-modal";
import { DeleteDialog } from "@/components/dashboard/delete-dialog";
import { toast } from "sonner";
import { cn } from "@/src/app/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/context/language-context";

export default function ProfilePage() {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: AuthService.getProfile,
    meta: { resource: "sidebar.Profile" },
  });

  const loading = isLoading;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageStatus, setImageStatus] = useState<"idle" | "loading" | "loaded" | "error">("idle");

  const showSkeleton = loading || isUploading || isDeletingImage || (profile?.photo_url ? (imageStatus !== "loaded" && imageStatus !== "error") : false);

  // Form states
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setUsername(profile.username || "");
      setEmail(profile.email || "");
    }
  }, [profile]);

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
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setIsEditModalOpen(false);
      toast.success(t("profile.save_success"));
      // Synchronize changes globally
      window.dispatchEvent(new CustomEvent("profile-update", { detail: updated }));
    } catch (error) {
      toast.error(t("common.failed"));
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

    try {
      setIsUploading(true);

      // Crop image to center 1:1 square
      const croppedFile = await cropToSquare(file);

      // Validate size (5MB)
      if (croppedFile.size > 5 * 1024 * 1024) {
        toast.error(t("common.image_upload.file_too_large", { 
          size: (croppedFile.size / (1024 * 1024)).toFixed(1),
          max: "5"
        }));
        return;
      }

      const { publicUrl } = await StorageService.uploadImage(STORAGE_PATHS.PROFILES, croppedFile);

      const updated = await AuthService.updateProfile(profile.id, {
        photo_url: publicUrl,
      });

      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setIsViewerOpen(false);
      toast.success(t("profile.photo_success"));
      // Synchronize changes globally
      window.dispatchEvent(new CustomEvent("profile-update", { detail: updated }));
    } catch (error) {
      console.error("Error cropping/uploading profile image:", error);
      toast.error(t("common.failed"));
    } finally {
      setIsUploading(false);
      if (e.target) {
        e.target.value = "";
      }
    }
  };

  const handleDeleteImage = async () => {
    if (!profile) return;

    try {
      setIsDeletingImage(true);
      const updated = await AuthService.updateProfile(profile.id, {
        photo_url: null,
      });

      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setIsDeleteOpen(false);
      setIsViewerOpen(false);
      toast.success(t("profile.photo_delete_success"));
      // Synchronize changes globally
      window.dispatchEvent(new CustomEvent("profile-update", { detail: updated }));
    } catch (error) {
      toast.error(t("common.failed"));
    } finally {
      setIsDeletingImage(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("profile.title")}
        icon={UserIcon}
        description={t("profile.description")}
        breadcrumbs={[
          { label: t("dashboard.title"), href: "/dashboard" },
          { label: t("profile.title") },
        ]}
      />

      <div className="grid gap-8">
        {/* Profile Header Card */}
        <Card className="overflow-hidden border-none bg-white shadow-sm dark:bg-neutral-900">
          <CardContent className="p-8 space-y-8">
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-center">
              <div className="relative group">
                <button
                  onClick={() => setIsViewerOpen(true)}
                  disabled={isUploading || isDeletingImage || loading}
                  className="relative h-32 w-32 p-1 bg-neutral-50 dark:bg-neutral-800 shadow-md rounded-2xl overflow-hidden group focus:outline-none transition cursor-pointer"
                >
                  <div className="w-full h-full relative rounded-xl overflow-hidden isolate">
                    {/* Always render Avatar so the image loads, but make it invisible when showSkeleton is true */}
                    {!loading && (
                      <Avatar className={cn("h-full w-full rounded-xl", showSkeleton && "invisible")}>
                        <AvatarImage
                          src={profile?.photo_url || undefined}
                          alt={profile?.full_name}
                          className="object-cover rounded-xl h-full w-full transition-all duration-300 group-hover:scale-105"
                          onLoadingStatusChange={(status) => {
                            setImageStatus(status);
                          }}
                        />
                        <AvatarFallback className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-xl flex items-center justify-center h-full w-full transition-all duration-300 group-hover:scale-105">
                          <UserIcon className="h-10 w-10 text-white dark:text-neutral-900" />
                        </AvatarFallback>
                      </Avatar>
                    )}

                    {showSkeleton && (
                      <Skeleton className="absolute inset-0 h-full w-full rounded-xl" />
                    )}

                    {/* Hover overlay / Uploading state */}
                    {!showSkeleton && (
                      <div className={cn(
                        "absolute inset-0 bg-black/65 transition-opacity duration-200 flex flex-col items-center justify-center text-white gap-1.5 rounded-xl",
                        isUploading || isDeletingImage ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      )}>
                        {isUploading ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span className="text-[10px] font-medium tracking-wide">{t("profile.uploading")}</span>
                          </>
                        ) : isDeletingImage ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span className="text-[10px] font-medium tracking-wide">{t("common.deleting")}</span>
                          </>
                        ) : (
                          <>
                            <Eye className="h-5 w-5" />
                            <span className="text-[10px] font-medium tracking-wide">{t("profile.view_image")}</span>
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
                  {t("profile.personal_info")}
                </h3>
                {loading ? (
                  <Skeleton className="h-9 w-28" />
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditClick}
                    className="gap-2 bg-transparent dark:bg-transparent border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                  >
                    <Pencil className="h-4 w-4" />
                    {t("profile.edit_profile")}
                  </Button>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <InfoCard
                  label={t("profile.full_name")}
                  value={profile?.full_name || "-"}
                  icon={<UserIcon className="h-5 w-5 text-neutral-400" />}
                  loading={loading}
                />
                <InfoCard
                  label={t("profile.username")}
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
                    className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 gap-1.5 cursor-pointer"
                  >
                    <KeyRound className="h-4 w-4" />
                    {t("profile.change_password")}
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
            <DialogTitle>{t("profile.edit_profile")}</DialogTitle>
            <DialogDescription>
              {t("profile.edit_profile_desc")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="fullname">{t("profile.full_name")}</Label>
              <Input
                id="fullname"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t("profile.fullname_placeholder")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">{t("profile.username")}</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t("profile.username_placeholder")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("profile.email_placeholder")}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isSaving}
              className="gap-1.5 cursor-pointer"
            >
              <X className="h-4 w-4" />
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 gap-1.5 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("common.saving")}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {t("common.save")}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ImageViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        images={profile?.photo_url ? [profile.photo_url] : []}
        onEdit={handleImageClick}
        onDelete={profile?.photo_url ? () => setIsDeleteOpen(true) : undefined}
        isEditLoading={isUploading}
        isDeleteLoading={isDeletingImage}
      />

      <DeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDeleteImage}
        itemName={t("profile.profile_picture")}
        loading={isDeletingImage}
      />
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
