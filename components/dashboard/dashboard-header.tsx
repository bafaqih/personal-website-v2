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
import { Button } from "@/components/ui/button";
import { LogOut, Menu, User } from "lucide-react";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { AuthService } from "@/src/services/auth.service";
import type { Profile } from "@/src/types/database";
import { cn } from "@/src/app/lib/utils";

interface DashboardHeaderProps {
  sidebarCollapsed: boolean;
  onMobileMenuToggle?: () => void;
}

/**
 * Dashboard header with glassmorphism background.
 * Contains: mobile menu toggle, theme toggle, and user profile dropdown.
 */
export function DashboardHeader({
  sidebarCollapsed,
  onMobileMenuToggle,
}: DashboardHeaderProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    AuthService.getProfile()
      .then(setProfile)
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await AuthService.signOut();
      router.push("/login");
    } catch {
      // Ignore logout errors
    }
  };

  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "AD";

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center justify-between border-b border-neutral-200/60 bg-white/70 px-6 backdrop-blur-xl transition-all duration-300",
        "dark:border-white/10 dark:bg-neutral-950/70",
        sidebarCollapsed ? "lg:pl-[96px]" : "lg:pl-[284px]"
      )}
    >
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onMobileMenuToggle}
        className="lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="hidden lg:block" />

      {/* Right side */}
      <div className="flex items-center gap-3">
        <ThemeToggle />

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 rounded-lg px-2 py-1.5"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={profile?.photo_url || undefined}
                  alt={profile?.full_name || "Admin"}
                />
                <AvatarFallback className="bg-neutral-900 text-xs text-white dark:bg-white dark:text-neutral-900">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:block">
                {profile?.full_name || "Admin"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{profile?.full_name || "Admin"}</p>
                <p className="text-xs text-neutral-500">{profile?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/profile")}
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
      </div>
    </header>
  );
}
