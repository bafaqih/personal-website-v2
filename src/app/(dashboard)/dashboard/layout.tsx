"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { cn } from "@/src/app/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollToTop } from "@/components/scroll-to-top";

/**
 * Inner dashboard layout — provides sidebar + header shell.
 * Wraps all authenticated /dashboard/* pages.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <DashboardSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Mobile sidebar (Sheet) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[calc(100vw-68px)]! max-w-none! p-0 border-none bg-transparent shadow-none" showCloseButton={false}>
          <DashboardSidebar collapsed={false} onToggle={() => setMobileOpen(false)} isMobile={true} />
        </SheetContent>
      </Sheet>

      {/* Main content area */}
      <div
        className={cn(
          "transition-all duration-300",
          collapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"
        )}
      >
        {/* Mobile menu toggle button (floating at z-[60] to sit above backdrop blur) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden fixed top-[14px] right-4 z-60 h-9 w-9 bg-neutral-900 text-white hover:bg-neutral-800 hover:text-white transition-all dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 dark:hover:text-neutral-900 rounded-[10px] flex items-center justify-center cursor-pointer border-0 shadow-none focus:outline-none focus:ring-0 focus-visible:ring-0"
        >
          <div className="relative w-[18px] h-[14px] flex flex-col justify-between items-center">
            <span className={cn(
              "w-full h-[2px] bg-current rounded-full transition-all duration-300 ease-in-out origin-center",
              mobileOpen ? "rotate-45 translate-y-[6px]" : ""
            )} />
            <span className={cn(
              "w-full h-[2px] bg-current rounded-full transition-all duration-300 ease-in-out",
              mobileOpen ? "opacity-0 scale-0" : ""
            )} />
            <span className={cn(
              "w-full h-[2px] bg-current rounded-full transition-all duration-300 ease-in-out origin-center",
              mobileOpen ? "-rotate-45 translate-y-[-6px]" : ""
            )} />
          </div>
        </Button>

        <DashboardHeader
          sidebarCollapsed={collapsed}
          onToggleSidebar={() => setCollapsed(!collapsed)}
        />

        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>

      <ScrollToTop />
    </div>
  );
}
