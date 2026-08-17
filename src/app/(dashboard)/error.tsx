"use client";

import { useEffect } from "react";
import { RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error("Dashboard error caught by boundary:", error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-8xl font-black tracking-tighter bg-linear-to-b from-red-600 to-red-400 bg-clip-text text-transparent select-none">
          500
        </h1>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Terjadi Kesalahan / An Error Occurred
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
          Terdapat masalah saat memuat bagian dashboard ini. Silakan coba memuat ulang halaman atau kembali ke beranda dashboard.
          / There was a problem loading this section of the dashboard. Please try reloading or go back to the dashboard home.
        </p>
        {error.message && (
          <div className="p-3 bg-neutral-100 dark:bg-neutral-900 rounded-lg text-left overflow-x-auto max-h-36">
            <code className="text-xs text-red-500 font-mono block whitespace-pre-wrap">
              {error.message}
            </code>
          </div>
        )}
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => reset()}
            className="px-6 h-10 bg-neutral-900 text-white hover:bg-neutral-800 active:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 dark:active:bg-neutral-200 gap-2 font-semibold shadow-none cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Button
            onClick={() => window.location.href = "/dashboard"}
            variant="outline"
            className="px-6 h-10 border border-neutral-200 bg-transparent text-neutral-900 hover:bg-neutral-50 active:bg-neutral-50 dark:border-white/10 dark:text-white dark:hover:bg-neutral-800 dark:active:bg-neutral-800 gap-2 font-semibold shadow-none cursor-pointer"
          >
            <Home className="h-4 w-4" />
            Dashboard Home
          </Button>
        </div>
      </div>
    </div>
  );
}
