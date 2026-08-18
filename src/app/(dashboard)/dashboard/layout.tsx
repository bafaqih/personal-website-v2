"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { cn } from "@/src/app/lib/utils";
import { AuthService } from "@/src/services/auth.service";

/**
 * Inner dashboard layout — provides sidebar + header shell.
 * Wraps all authenticated /dashboard/* pages.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Redirect to login if user session is not found
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await AuthService.getUser();
        if (!user) {
          router.replace("/login");
        }
      } catch {
        router.replace("/login");
      }
    };
    checkAuth();
  }, [router, pathname]);

  // Force page reload if navigated to from back-forward cache (bfcache)
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        window.location.reload();
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

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

      {/* Mobile backdrop overlay to close sidebar on click outside or when trying to scroll */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-10 cursor-pointer"
          onClick={() => setMobileOpen(false)}
          onWheel={() => setMobileOpen(false)}
          onTouchMove={() => setMobileOpen(false)}
        />
      )}

      {/* Main content area */}
      <div
        className={cn(
          "transition-all duration-300 pt-14 w-full",
          collapsed ? "lg:ml-[72px] lg:w-[calc(100%-72px)]" : "lg:ml-[260px] lg:w-[calc(100%-260px)]",
          "max-lg:translate-x-0",
          mobileOpen ? "max-lg:translate-x-[260px]" : ""
        )}
      >
        <main className="pt-4 pb-3.5 px-3.5">
          {children}
        </main>
      </div>
    </div>
  );
}
