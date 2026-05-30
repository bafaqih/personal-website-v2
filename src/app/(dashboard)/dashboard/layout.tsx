"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { cn } from "@/src/app/lib/utils";
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
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 overflow-x-hidden">
      <DashboardHeader
        sidebarCollapsed={collapsed}
        onToggleSidebar={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onToggleMobileSidebar={() => setMobileOpen(!mobileOpen)}
      />

      {/* Responsive sidebar (Desktop + Mobile) */}
      <DashboardSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Mobile backdrop overlay to close sidebar on click outside */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-10 cursor-pointer"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main content area */}
      <div
        className={cn(
          "transition-all duration-300 pt-16 w-full",
          collapsed ? "lg:ml-[72px] lg:w-[calc(100%-72px)]" : "lg:ml-[260px] lg:w-[calc(100%-260px)]",
          "max-lg:translate-x-0",
          mobileOpen ? "max-lg:translate-x-[260px]" : ""
        )}
      >
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>

      <ScrollToTop />
    </div>
  );
}
