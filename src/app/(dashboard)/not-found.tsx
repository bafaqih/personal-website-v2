"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardNotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="max-w-md w-full space-y-6">
        {/* Visual 404 badge */}
        <h1 className="text-8xl font-black tracking-tighter bg-linear-to-b from-neutral-800 to-neutral-500 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent select-none">
          404
        </h1>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Halaman Tidak Ditemukan / Page Not Found
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
          Halaman yang Anda cari di dashboard admin tidak ditemukan atau telah dipindahkan.
          / The page you are looking for in the admin dashboard does not exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            asChild
            className="px-6 h-10 bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 gap-2 font-semibold shadow-none cursor-pointer"
          >
            <Link href="/dashboard">
              <Home className="h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="px-6 h-10 border border-neutral-200 bg-transparent text-neutral-900 hover:bg-neutral-50 dark:border-white/10 dark:text-white dark:hover:bg-neutral-800 gap-2 font-semibold shadow-none cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
