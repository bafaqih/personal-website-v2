"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { LogOut, Menu, User, PanelLeft, PanelLeftClose } from "lucide-react";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { AuthService } from "@/src/services/auth.service";
import type { Profile } from "@/src/types/database";
import { cn } from "@/src/app/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DashboardHeaderProps {
  sidebarCollapsed: boolean;
  onToggleSidebar?: () => void;
  onMobileMenuToggle?: () => void;
}

/**
 * Dashboard header with glassmorphism background.
 * Contains: mobile menu toggle, theme toggle, and user profile dropdown.
 */
export function DashboardHeader({
  sidebarCollapsed,
  onToggleSidebar,
  onMobileMenuToggle,
}: DashboardHeaderProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [imageStatus, setImageStatus] = useState<"idle" | "loading" | "loaded" | "error">("idle");

  const showSkeleton = loading || (profile?.photo_url ? (imageStatus !== "loaded" && imageStatus !== "error") : false);

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
            setImageStatus("idle");
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
        className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-neutral-200/60 bg-white/70 px-8 backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-neutral-950/70"
      >
        {/* Left Side: Toggle Button */}
        <div className="flex items-center">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileMenuToggle}
            className="lg:hidden mr-2"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Desktop Sidebar Toggle */}
          <div className="hidden lg:block">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleSidebar}
                  className="h-9 w-9 border border-neutral-200 dark:border-white/10 rounded-lg"
                >
                  {sidebarCollapsed ? (
                    <PanelLeft className="h-4 w-4" />
                  ) : (
                    <PanelLeftClose className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{sidebarCollapsed ? "Expand" : "Collapse"}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Profile dropdown */}
          <Tooltip
            open={dropdownOpen ? false : tooltipOpen}
            onOpenChange={setTooltipOpen}
          >
            <DropdownMenu onOpenChange={setDropdownOpen}>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    disabled={showSkeleton}
                    onClick={() => !showSkeleton && setTooltipOpen(false)}
                    className={cn(
                      "h-9 w-9 rounded-lg p-0 border border-neutral-200 dark:border-white/10 hover:bg-transparent active:scale-100 focus:ring-0 focus-visible:ring-0 relative overflow-hidden",
                      showSkeleton && "pointer-events-none cursor-default"
                    )}
                  >
                    <Avatar className={cn("h-full w-full", showSkeleton && "invisible")}>
                      <AvatarImage
                        src={profile?.photo_url || undefined}
                        alt={profile?.full_name || "Admin"}
                        className="rounded-lg"
                        onLoadingStatusChange={(status) => {
                          setImageStatus(status);
                        }}
                      />
                      <AvatarFallback className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-lg flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    {showSkeleton && (
                      <Skeleton className="absolute inset-0 h-full w-full rounded-lg" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <DropdownMenuContent
                align="end"
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
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <TooltipContent side="bottom">
              <p>Profile</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </header>
    </TooltipProvider>
  );
}
