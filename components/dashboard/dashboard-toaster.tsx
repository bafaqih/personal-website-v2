"use client";

import { useTheme } from "next-themes";
import { Toaster as SonnerToaster } from "sonner";

export function DashboardToaster() {
  const { resolvedTheme } = useTheme();

  return (
    <SonnerToaster
      position="top-right"
      duration={5000}
      closeButton
      expand={true}
      theme={resolvedTheme as "light" | "dark" | "system"}
      toastOptions={{
        className: "font-sans pr-10",
        classNames: {
          toast: "group toast dark:bg-neutral-950 dark:text-neutral-50 dark:border-neutral-800 bg-white text-neutral-950 border-neutral-200 shadow-lg border",
          description: "dark:text-neutral-400 text-neutral-500 text-xs mt-1",
          actionButton: "bg-neutral-900 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900 font-medium text-xs rounded-md px-3 py-1",
          closeButton: "dark:bg-neutral-950 dark:text-neutral-400 bg-white text-neutral-500 border dark:border-neutral-800 border-neutral-200",
        }
      }}
    />
  );
}
