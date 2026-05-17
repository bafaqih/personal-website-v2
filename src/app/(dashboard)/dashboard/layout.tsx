"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { cn } from "@/src/app/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
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
        <SheetContent side="left" className="w-[260px] p-0">
          <DashboardSidebar collapsed={false} onToggle={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main content area */}
      <div
        className={cn(
          "transition-all duration-300",
          collapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"
        )}
      >
        <DashboardHeader
          sidebarCollapsed={collapsed}
          onToggleSidebar={() => setCollapsed(!collapsed)}
          onMobileMenuToggle={() => setMobileOpen(true)}
        />

        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>

      <ScrollToTop />
    </div>
  );
}
