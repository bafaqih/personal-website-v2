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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [tooltipOpen, setTooltipOpen] = useState(false);

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
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "AD";

  return (
    <TooltipProvider>
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
          <Tooltip
            open={dropdownOpen ? false : tooltipOpen}
            onOpenChange={setTooltipOpen}
          >
            <DropdownMenu onOpenChange={setDropdownOpen}>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    onClick={() => setTooltipOpen(false)}
                    className="h-9 w-9 rounded-lg p-0 border border-neutral-200 dark:border-white/10 hover:bg-transparent active:scale-100 focus:ring-0 focus-visible:ring-0"
                  >
                    <Avatar className="h-full w-full">
                      <AvatarImage
                        src={profile?.photo_url || undefined}
                        alt={profile?.full_name || "Admin"}
                        className="rounded-lg"
                      />
                      <AvatarFallback className="bg-neutral-900 text-[10px] text-white dark:bg-white dark:text-neutral-900 rounded-lg">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
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
