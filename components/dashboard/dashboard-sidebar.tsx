"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/src/app/lib/utils";
import { DASHBOARD_NAV, type NavItem } from "@/src/lib/constants";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import logoBlack from "@/src/assets/images/fadilbaf-black.svg";
import logoWhite from "@/src/assets/images/fadilbaf-white.svg";

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

/**
 * Dashboard sidebar with logo, navigation menu, and collapsible submenus.
 * Features glassmorphism border and smooth collapse animation.
 */
export function DashboardSidebar({ collapsed, onToggle }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const logo = resolvedTheme === "dark" ? logoWhite : logoBlack;

  const toggleSubmenu = (title: string) => {
    setOpenMenus((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard" || pathname === "/admin/dashboard";
    return pathname.startsWith(href) || pathname.startsWith(`/admin${href}`);
  };

  const handleNavClick = (item: NavItem, e: React.MouseEvent) => {
    if (item.disabled) {
      e.preventDefault();
      toast.info("Coming Soon", {
        description: "This feature is under development.",
      });
    }
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-neutral-200/60 bg-white/90 backdrop-blur-xl transition-all duration-300",
        "dark:border-white/10 dark:bg-neutral-950/90",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center">
          <Image
            src={logo}
            alt="Fadil Bafagih"
            width={collapsed ? 32 : 120}
            height={32}
            className="transition-all duration-300"
            priority
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {DASHBOARD_NAV.map((item) => (
            <li key={item.title}>
              {/* Parent item */}
              {item.children ? (
                <>
                  <button
                    onClick={() => {
                      if (collapsed) return;
                      toggleSubmenu(item.title);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive(item.href)
                        ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white"
                    )}
                    title={collapsed ? item.title : undefined}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.title}</span>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 shrink-0 transition-transform duration-200",
                            openMenus.includes(item.title) && "rotate-180"
                          )}
                        />
                      </>
                    )}
                  </button>
                  {/* Submenu */}
                  {!collapsed && openMenus.includes(item.title) && (
                    <ul className="ml-4 mt-1 space-y-0.5 border-l border-neutral-200 pl-4 dark:border-white/10">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={cn(
                              "block rounded-md px-3 py-2 text-sm transition-colors",
                              isActive(child.href)
                                ? "font-medium text-neutral-900 dark:text-white"
                                : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                            )}
                          >
                            {child.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link
                  href={item.disabled ? "#" : item.href}
                  onClick={(e) => handleNavClick(item, e)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    item.disabled && "opacity-50 cursor-not-allowed",
                    isActive(item.href)
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white"
                  )}
                  title={collapsed ? item.title : undefined}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-neutral-200/60 p-3 dark:border-white/10">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-full justify-center"
        >
          {collapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <>
              <PanelLeftClose className="mr-2 h-4 w-4" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
