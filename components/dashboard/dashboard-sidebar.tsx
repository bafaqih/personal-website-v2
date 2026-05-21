"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
import iconBlack from "@/src/assets/images/icon-black.svg";
import iconWhite from "@/src/assets/images/icon-white.svg";

interface SidebarNavItemProps {
  item: NavItem;
  collapsed: boolean;
  isMobile: boolean;
  isActive: (href: string) => boolean;
  isOpen: boolean;
  t: (key: string) => string;
  onToggle: () => void;
  toggleSubmenu: (title: string) => void;
  handleNavClick: (item: NavItem, e: React.MouseEvent) => void;
  setOpenMenu: (title: string | null) => void;
}

function SidebarNavItem({
  item,
  collapsed,
  isMobile,
  isActive,
  isOpen,
  t,
  onToggle,
  toggleSubmenu,
  handleNavClick,
  setOpenMenu,
}: SidebarNavItemProps) {
  const [hovered, setHovered] = useState(false);
  const hasChildren = !!item.children;
  const translatedTitle = t(`sidebar.${item.title}`);

  const triggerElement = hasChildren ? (
    <button
      onPointerDown={(e) => e.preventDefault()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        if (collapsed) {
          onToggle(); // Open sidebar
          setOpenMenu(item.title); // Show submenu
        } else {
          toggleSubmenu(item.title);
        }
      }}
      className={cn(
        "flex items-center !justify-start rounded-lg font-medium transition-all duration-300 cursor-pointer",
        isMobile
          ? "w-full px-4 py-3 text-[15px] gap-3.5"
          : cn(
              "h-10 rounded-lg transition-all duration-300",
              collapsed ? "w-10 pl-2.5 pr-2.5 gap-0" : "w-full pl-2.5 pr-3 py-2.5 gap-3"
            ),
        isActive(item.href)
          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white"
      )}
    >
      <item.icon className={cn("shrink-0", isMobile ? "h-[22px] w-[22px]" : "h-5 w-5")} />
      <span className={cn(
        "inline-block !text-left transition-all duration-200 origin-left whitespace-nowrap overflow-hidden text-ellipsis",
        collapsed
          ? "w-0 max-w-0 opacity-0 -translate-x-4 pointer-events-none flex-none"
          : "flex-1 max-w-[200px] opacity-100 translate-x-0"
      )}>
        {translatedTitle}
      </span>
      <ChevronDown
        className={cn(
          "shrink-0 transition-all duration-200 origin-center ml-auto",
          isOpen && "rotate-180",
          collapsed
            ? "w-0 h-0 opacity-0 pointer-events-none flex-none"
            : cn("opacity-100", isMobile ? "h-5 w-5" : "h-4 w-4")
        )}
      />
    </button>
  ) : (
    <Link
      href={item.disabled ? "#" : item.href}
      onPointerDown={(e) => e.preventDefault()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => handleNavClick(item, e)}
      className={cn(
        "flex items-center !justify-start rounded-lg font-medium transition-all duration-300",
        item.disabled && "opacity-50 cursor-not-allowed",
        isMobile
          ? "w-full px-4 py-3 text-[15px] gap-3.5"
          : cn(
              "h-10 rounded-lg transition-all duration-300",
              collapsed ? "w-10 pl-2.5 pr-2.5 gap-0" : "w-full pl-2.5 pr-3 py-2.5 gap-3"
            ),
        isActive(item.href)
          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white"
      )}
    >
      <item.icon className={cn("shrink-0", isMobile ? "h-[22px] w-[22px]" : "h-5 w-5")} />
      <span className={cn(
        "inline-block !text-left transition-all duration-200 origin-left whitespace-nowrap overflow-hidden text-ellipsis",
        collapsed
          ? "w-0 max-w-0 opacity-0 -translate-x-4 pointer-events-none flex-none"
          : "flex-1 max-w-[200px] opacity-100 translate-x-0"
      )}>
        {translatedTitle}
      </span>
    </Link>
  );

  return (
    <li className="flex flex-col items-start w-full">
      <Tooltip open={collapsed && hovered}>
        <TooltipTrigger asChild>
          {triggerElement}
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={10}>
          <p>{translatedTitle}</p>
        </TooltipContent>
      </Tooltip>

      {/* Submenu */}
      {!collapsed && isOpen && hasChildren && (
        <ul className={cn("ml-4 mt-1 border-l border-neutral-200 pl-4 dark:border-white/10 w-full", isMobile ? "space-y-1" : "space-y-0.5")}>
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
    </li>
  );
}

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

  useEffect(() => {
    const activeParent = DASHBOARD_NAV.find((item) => {
      if (item.children) {
        return item.children.some((child) => isActive(child.href));
      }
      return false;
    });

    if (activeParent) {
      setOpenMenu(activeParent.title);
    }
  }, [pathname]);

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
        <div className="flex h-16 items-center px-4 border-b border-neutral-200/60 dark:border-white/10 transition-all duration-300">
          <Link href="/dashboard" className="relative flex items-center w-full h-8 overflow-hidden">
            {/* Full logo (light and dark) */}
            <div className={cn(
              "absolute left-0 top-0 h-full flex items-center transition-all duration-300 origin-left shrink-0 overflow-hidden",
              collapsed ? "opacity-0 -translate-x-10 pointer-events-none w-0" : "opacity-100 w-full"
            )}>
              <img
                src={logoBlack.src}
                alt="Fadil Bafagih"
                className="dark:hidden h-8 w-[141px] min-w-[141px] shrink-0"
              />
              <img
                src={logoWhite.src}
                alt="Fadil Bafagih"
                className="hidden dark:block h-8 w-[141px] min-w-[141px] shrink-0"
              />
            </div>

            {/* Icon logo (light and dark) */}
            <div className={cn(
              "absolute left-0 top-0 h-full flex items-center transition-all duration-300 origin-left shrink-0",
              collapsed ? "opacity-100" : "opacity-0 pointer-events-none"
            )}>
              <img
                src={iconBlack.src}
                alt="FB Icon"
                className="dark:hidden h-8 w-auto"
              />
              <img
                src={iconWhite.src}
                alt="FB Icon"
                className="hidden dark:block h-8 w-auto"
              />
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className={cn("flex-1 overflow-y-auto", isMobile ? "px-4 py-6" : "px-4 py-4")}>
          <ul className={cn(isMobile ? "space-y-2.5" : "space-y-2")}>
            {DASHBOARD_NAV.map((item) => {
              const isOpen = openMenu === item.title;

              return (
                <SidebarNavItem
                  key={item.title}
                  item={item}
                  collapsed={collapsed}
                  isMobile={isMobile}
                  isActive={isActive}
                  isOpen={isOpen}
                  t={t}
                  onToggle={onToggle}
                  toggleSubmenu={toggleSubmenu}
                  handleNavClick={handleNavClick}
                  setOpenMenu={setOpenMenu}
                />
              );
            })}
          </ul>
        </nav>

      </aside>
    </TooltipProvider>
  );
}
