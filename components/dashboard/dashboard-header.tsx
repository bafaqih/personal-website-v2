"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { LogOut, User, PanelLeft, PanelLeftClose } from "lucide-react";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { LanguageToggle } from "@/components/dashboard/language-toggle";
import { useLanguage } from "@/context/language-context";
import { AuthService } from "@/src/services/auth.service";
import type { Profile } from "@/src/types/database";
import { cn } from "@/src/app/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import logoBlack from "@/src/assets/images/fadilbaf-black.svg";
import logoWhite from "@/src/assets/images/fadilbaf-white.svg";

interface ProfileDropdownProps {
  profile: Profile | null;
  showSkeleton: boolean;
  handleLogout: () => void;
  router: any;
  t: any;
  align: "start" | "end";
}

function ProfileDropdown({
  profile,
  showSkeleton,
  handleLogout,
  router,
  t,
  align,
}: ProfileDropdownProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [imageStatus, setImageStatus] = useState<"idle" | "loading" | "loaded" | "error">("idle");

  const actualShowSkeleton = showSkeleton || (profile?.photo_url ? (imageStatus !== "loaded" && imageStatus !== "error") : false);

  return (
    <Tooltip
      open={dropdownOpen ? false : tooltipOpen}
      onOpenChange={setTooltipOpen}
    >
      <DropdownMenu onOpenChange={setDropdownOpen}>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={actualShowSkeleton}
              onClick={() => !actualShowSkeleton && setTooltipOpen(false)}
              className={cn(
                "h-9 w-9 rounded-lg p-0 border border-neutral-200 dark:border-white/10 hover:bg-transparent active:scale-100 focus:ring-0 focus-visible:ring-0 relative overflow-hidden cursor-pointer",
                actualShowSkeleton && "pointer-events-none cursor-default"
              )}
            >
              <Avatar className={cn("h-full w-full", actualShowSkeleton && "invisible")}>
                <AvatarImage
                  src={profile?.photo_url || undefined}
                  alt={profile?.full_name || "FB"}
                  className="rounded-lg"
                  onLoadingStatusChange={setImageStatus}
                />
                <AvatarFallback className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-lg flex items-center justify-center">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              {actualShowSkeleton && (
                <Skeleton className="absolute inset-0 h-full w-full rounded-lg" />
              )}
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <DropdownMenuContent
          align={align}
          className="w-48"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                {profile?.full_name || "Admin"}
              </p>
              <p className="text-xs text-neutral-500 font-normal">
                {profile?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              router.push("/dashboard/profile");
              setTooltipOpen(false);
            }}
            className="cursor-pointer"
          >
            <User className="mr-2 h-4 w-4" />
            {t("header.my_profile")}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={handleLogout}
            className="cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {t("header.logout")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <TooltipContent side="bottom">
        <p>{t("header.profile")}</p>
      </TooltipContent>
    </Tooltip>
  );
}

interface DashboardHeaderProps {
  sidebarCollapsed: boolean;
  onToggleSidebar?: () => void;
}

/**
 * Dashboard header with glassmorphism background.
 * Contains: mobile menu toggle, language toggle, theme toggle, and user profile dropdown.
 */
export function DashboardHeader({
  sidebarCollapsed,
  onToggleSidebar,
}: DashboardHeaderProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AuthService.getProfile()
      .then(setProfile)
      .catch(() => {})
      .finally(() => setLoading(false));

    const handleProfileUpdate = () => {
      setLoading(true);
      AuthService.getProfile()
        .then((updatedProfile) => {
          if (updatedProfile) {
            setProfile(updatedProfile);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    };

    window.addEventListener("profile-update", handleProfileUpdate);
    return () => {
      window.removeEventListener("profile-update", handleProfileUpdate);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await AuthService.signOut();
      router.push("/login");
    } catch {
      // Ignore logout errors
    }
  };

  return (
    <TooltipProvider>
      <header
        className="fixed top-0 left-0 w-full z-30 flex h-16 items-center justify-between border-b border-neutral-200/60 bg-white/70 pl-4 sm:pl-5 pr-4 sm:pr-5 backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-neutral-950/70"
      >
        {/* Left Side: Profile dropdown on mobile, Sidebar toggle and Logo on desktop */}
        <div className="flex items-center gap-4">
          {/* Mobile Profile dropdown */}
          <div className="flex lg:hidden items-center">
            <ProfileDropdown
              profile={profile}
              showSkeleton={loading}
              handleLogout={handleLogout}
              router={router}
              t={t}
              align="start"
            />
          </div>

          {/* Desktop Sidebar Toggle & Logo */}
          <div className="hidden lg:flex items-center gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleSidebar}
                  className="h-9 w-9 border border-neutral-200 dark:border-white/10 rounded-lg cursor-pointer flex items-center justify-center"
                >
                  {sidebarCollapsed ? (
                    <PanelLeft className="h-4 w-4" />
                  ) : (
                    <PanelLeftClose className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{sidebarCollapsed ? t("header.expand") : t("header.collapse")}</p>
              </TooltipContent>
            </Tooltip>

            {/* Brand Logo */}
            <Link href="/dashboard" className="relative flex items-center h-8 w-[141px]">
              <img
                src={logoBlack.src}
                alt="Fadil Bafagih"
                className="dark:hidden h-8 w-[141px] min-w-[141px]"
              />
              <img
                src={logoWhite.src}
                alt="Fadil Bafagih"
                className="hidden dark:block h-8 w-[141px] min-w-[141px]"
              />
            </Link>
          </div>
        </div>

        {/* Right side: Language, Theme, and Profile dropdown (on desktop) */}
        <div className="flex items-center gap-3 pr-12 lg:pr-0">
          <LanguageToggle />
          <ThemeToggle />

          {/* Desktop Profile dropdown */}
          <div className="hidden lg:flex items-center">
            <ProfileDropdown
              profile={profile}
              showSkeleton={loading}
              handleLogout={handleLogout}
              router={router}
              t={t}
              align="end"
            />
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
}
