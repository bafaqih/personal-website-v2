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

export default function ChangePasswordPage() {
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
      toast.error("Old password is required");
    }

    if (!newPassword) {
      newErrors.newPassword = true;
      hasError = true;
      toast.error("New password is required");
    } else if (newPassword.length < 6) {
      newErrors.newPassword = true;
      hasError = true;
      toast.error("New password must be at least 6 characters");
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = true;
      hasError = true;
      toast.error("Please confirm your new password");
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = true;
      hasError = true;
      toast.error("New password and confirmation do not match");
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await AuthService.updatePassword(oldPassword, newPassword);
      toast.success("Password updated successfully");
      router.push("/dashboard/profile");
    } catch (error: any) {
      toast.error("Failed to update password", {
        description: error.message || "An unexpected error occurred."
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
        title="My Profile"
        icon={UserIcon}
        description="Manage your account settings and profile information."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Profile", href: "/dashboard/profile" },
          { label: "Change Password" },
        ]}
      />

      <div className="w-full">
        <Card className="border-none bg-white shadow-sm dark:bg-neutral-900 overflow-hidden">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-1 pb-2">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                Change Password
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Update your password below to keep your account secure.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Old Password */}
              <div className="space-y-2">
                <Label htmlFor="oldPassword">Old Password</Label>
                <div className="relative">
                  <Input
                    id="oldPassword"
                    type={showOldPassword ? "text" : "password"}
                    placeholder="Enter your old password"
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
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
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter your new password (min. 6 characters)"
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
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
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
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
                className="w-full h-11 bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 gap-2 text-sm font-semibold tracking-wide transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  <>
                    <KeyRound className="h-4 w-4" />
                    Change Password
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
