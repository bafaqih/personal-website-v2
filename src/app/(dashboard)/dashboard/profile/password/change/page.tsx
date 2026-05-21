"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/dashboard/page-header";
import { toast } from "sonner";
import {
  User as UserIcon,
  KeyRound,
  Eye,
  EyeOff,
  Loader2
} from "lucide-react";
import { AuthService } from "@/src/services/auth.service";
import { cn } from "@/src/app/lib/utils";
import { useLanguage } from "@/context/language-context";

export default function ChangePasswordPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Error outlines state
  const [errors, setErrors] = useState<{
    oldPassword?: boolean;
    newPassword?: boolean;
    confirmPassword?: boolean;
  }>({});

  // Password visibility states
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isFormValid = oldPassword.trim() !== "" && newPassword.trim() !== "" && confirmPassword.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: typeof errors = {};
    let hasError = false;

    // Client-side validation
    if (!oldPassword) {
      newErrors.oldPassword = true;
      hasError = true;
      toast.error(language === "en" ? "Old password is required" : "Kata sandi lama wajib diisi");
    }

    if (!newPassword) {
      newErrors.newPassword = true;
      hasError = true;
      toast.error(language === "en" ? "New password is required" : "Kata sandi baru wajib diisi");
    } else if (newPassword.length < 6) {
      newErrors.newPassword = true;
      hasError = true;
      toast.error(language === "en" ? "New password must be at least 6 characters" : "Kata sandi baru minimal harus 6 karakter");
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = true;
      hasError = true;
      toast.error(language === "en" ? "Please confirm your new password" : "Mohon konfirmasi kata sandi baru Anda");
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = true;
      hasError = true;
      toast.error(language === "en" ? "New password and confirmation do not match" : "Kata sandi baru dan konfirmasi tidak cocok");
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await AuthService.updatePassword(oldPassword, newPassword);
      toast.success(language === "en" ? "Password updated successfully" : "Kata sandi berhasil diperbarui");
      router.push("/dashboard/profile");
    } catch (error: any) {
      toast.error(language === "en" ? "Failed to update password" : "Gagal memperbarui kata sandi", {
        description: error.message || (language === "en" ? "An unexpected error occurred." : "Terjadi kesalahan yang tidak terduga.")
      });
      // Outline old password if it was incorrect
      if (error.message?.toLowerCase().includes("old password")) {
        setErrors({ oldPassword: true });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("profile.title")}
        icon={UserIcon}
        description={language === "en" ? "Manage your account settings and profile information." : "Kelola pengaturan akun dan informasi profil Anda."}
        breadcrumbs={[
          { label: t("dashboard.title"), href: "/dashboard" },
          { label: t("profile.title"), href: "/dashboard/profile" },
          { label: language === "en" ? "Change Password" : "Ubah Kata Sandi" },
        ]}
      />

      <div className="w-full">
        <Card className="border-none bg-white shadow-sm dark:bg-neutral-900 overflow-hidden">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-1 pb-2">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                {language === "en" ? "Change Password" : "Ubah Kata Sandi"}
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {language === "en" 
                  ? "Update your password below to keep your account secure." 
                  : "Perbarui kata sandi Anda di bawah untuk menjaga keamanan akun Anda."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Old Password */}
              <div className="space-y-2">
                <Label htmlFor="oldPassword">{language === "en" ? "Old Password" : "Kata Sandi Lama"}</Label>
                <div className="relative">
                  <Input
                    id="oldPassword"
                    type={showOldPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder={language === "en" ? "Enter your old password" : "Masukkan kata sandi lama Anda"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    disabled={loading}
                    className={cn(
                      "h-11 pr-10",
                      errors.oldPassword && "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 cursor-pointer"
                  >
                    {showOldPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">{language === "en" ? "New Password" : "Kata Sandi Baru"}</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder={language === "en" ? "Enter your new password (min. 6 characters)" : "Masukkan kata sandi baru Anda (min. 6 karakter)"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                    className={cn(
                      "h-11 pr-10",
                      errors.newPassword && "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 cursor-pointer"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{language === "en" ? "Confirm New Password" : "Konfirmasi Kata Sandi Baru"}</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder={language === "en" ? "Confirm your new password" : "Konfirmasi kata sandi baru Anda"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className={cn(
                      "h-11 pr-10",
                      errors.confirmPassword && "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Change Password Button */}
              <Button
                type="submit"
                disabled={loading || !isFormValid}
                className="w-full h-11 bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 gap-2 text-sm font-semibold tracking-wide transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {language === "en" ? "Changing Password..." : "Mengubah Kata Sandi..."}
                  </>
                ) : (
                  <>
                    <KeyRound className="h-4 w-4" />
                    {language === "en" ? "Change Password" : "Ubah Kata Sandi"}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
