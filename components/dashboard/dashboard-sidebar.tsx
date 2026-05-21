"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
  X,
} from "lucide-react";
import { cn } from "@/src/app/lib/utils";
import { DASHBOARD_NAV, type NavItem } from "@/src/lib/constants";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/context/language-context";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import logoBlack from "@/src/assets/images/fadilbaf-black.svg";
import logoWhite from "@/src/assets/images/fadilbaf-white.svg";

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  isMobile?: boolean;
}

/**
 * Dashboard sidebar with logo, navigation menu, and collapsible submenus.
 * Features glassmorphism border and smooth collapse animation.
 */
export function DashboardSidebar({ collapsed, onToggle, isMobile = false }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  // Track only ONE open menu at a time
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleSubmenu = (title: string) => {
    setOpenMenu((prev) => (prev === title ? null : title));
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard" || pathname === "/admin/dashboard";
    return pathname.startsWith(href) || pathname.startsWith(`/admin${href}`);
  };

  const handleNavClick = (item: NavItem, e: React.MouseEvent) => {
    if (item.disabled) {
      e.preventDefault();
      toast.info(t("common.coming_soon"), {
        description: t("common.coming_soon_desc"),
      });
    } else {
      setOpenMenu(null);
      if (isMobile) {
        onToggle();
      }
    }
  };

  return (
    <TooltipProvider delayDuration={200}>
      <aside
        className={cn(
          "flex h-full flex-col border-r border-neutral-200/60 bg-white/90 backdrop-blur-xl transition-all duration-300 overflow-x-hidden",
          "dark:border-white/10 dark:bg-neutral-950/90",
          isMobile ? "relative w-full" : "fixed left-0 top-0 z-40 h-screen",
          !isMobile && (collapsed ? "w-[72px]" : "w-[260px]")
        )}
      >
        {/* Logo */}
<div
  className={`flex h-16 items-center px-4 border-b border-neutral-200/60 dark:border-white/10 ${
    collapsed ? "justify-center" : "justify-start"
  }`}
>
  <Link href="/dashboard" className="flex items-center">
    <Image
      src={logoBlack}
      alt="Fadil Bafagih"
      width={collapsed ? 32 : 120}
      height={32}
      className="transition-all duration-300 dark:hidden"
      priority
    />
    <Image
      src={logoWhite}
      alt="Fadil Bafagih"
      width={collapsed ? 32 : 120}
      height={32}
      className="hidden transition-all duration-300 dark:block"
      priority
    />
  </Link>
</div>

        {/* Navigation */}
        <nav key={collapsed ? "collapsed" : "expanded"} className={cn("flex-1 overflow-y-auto", isMobile ? "px-4 py-6" : "px-3 py-4")}>
          <ul className={cn(isMobile ? "space-y-2.5" : "space-y-2")}>
            {DASHBOARD_NAV.map((item) => {
              const hasChildren = !!item.children;
              const isOpen = openMenu === item.title;
              const translatedTitle = t(`sidebar.${item.title}`);

              return (
                <li key={item.title} className={cn(collapsed && "flex justify-center")}>
                  <Tooltip>
                    {hasChildren ? (
                      <>
                        <TooltipTrigger asChild>
                          <button
                            onPointerDown={(e) => e.preventDefault()}
                            onClick={() => {
                              if (collapsed) {
                                onToggle(); // Open sidebar
                                setOpenMenu(item.title); // Show submenu
                              } else {
                                toggleSubmenu(item.title);
                              }
                            }}
                            className={cn(
                              "flex items-center rounded-lg font-medium transition-all duration-200",
                              isMobile
                                ? "w-full px-4 py-3 text-[15px] gap-3.5"
                                : (collapsed ? "h-11 w-11 justify-center p-0 text-sm gap-3" : "w-full px-3 py-2.5 text-sm gap-3"),
                              isActive(item.href)
                                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white"
                            )}
                          >
                            <item.icon className={cn("shrink-0", isMobile ? "h-[22px] w-[22px]" : "h-5 w-5")} />
                            {!collapsed && (
                              <>
                                <span className="flex-1 text-left">{translatedTitle}</span>
                                <ChevronDown
                                  className={cn(
                                    "shrink-0 transition-transform duration-200",
                                    isMobile ? "h-5 w-5" : "h-4 w-4",
                                    isOpen && "rotate-180"
                                  )}
                                />
                              </>
                            )}
                          </button>
                        </TooltipTrigger>
                        {/* Submenu */}
                        {!collapsed && isOpen && (
                          <ul className={cn("ml-4 mt-1 border-l border-neutral-200 pl-4 dark:border-white/10", isMobile ? "space-y-1" : "space-y-0.5")}>
                            {item.children?.map((child) => (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  onClick={() => {
                                    if (isMobile) {
                                      onToggle();
                                    }
                                  }}
                                  className={cn(
                                    "block rounded-md transition-colors",
                                    isMobile ? "px-4 py-2.5 text-[14px]" : "px-3 py-2 text-sm",
                                    isActive(child.href)
                                      ? "font-medium text-neutral-900 dark:text-white"
                                      : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                                  )}
                                >
                                  {t(`sidebar.${child.title}`)}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <TooltipTrigger asChild>
                        <Link
                          href={item.disabled ? "#" : item.href}
                          onPointerDown={(e) => e.preventDefault()}
                          onClick={(e) => handleNavClick(item, e)}
                          className={cn(
                            "flex items-center rounded-lg font-medium transition-all duration-200",
                            item.disabled && "opacity-50 cursor-not-allowed",
                            isMobile
                              ? "w-full px-4 py-3 text-[15px] gap-3.5"
                              : (collapsed ? "h-11 w-11 justify-center p-0 text-sm gap-3" : "w-full px-3 py-2.5 text-sm gap-3"),
                            isActive(item.href)
                              ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                              : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white"
                          )}
                        >
                          <item.icon className={cn("shrink-0", isMobile ? "h-[22px] w-[22px]" : "h-5 w-5")} />
                          {!collapsed && <span>{translatedTitle}</span>}
                        </Link>
                      </TooltipTrigger>
                    )}
                    {collapsed && (
                      <TooltipContent side="right" sideOffset={10}>
                        <p>{translatedTitle}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Copyright */}
        {!collapsed && (
          <div className="border-t border-neutral-200/60 dark:border-white/10 px-2 py-4 text-center text-neutral-400 dark:text-neutral-500 shrink-0">
            <p className="text-[10px] whitespace-nowrap">
              © {new Date().getFullYear()} Fadil Bafagih. All Rights Reserved.
            </p>
          </div>
        )}
      </aside>
    </TooltipProvider>
  );
}
