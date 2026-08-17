import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/src/app/lib/utils";
import { ThemeProvider } from "@/components/dashboard/theme-provider";
import { LanguageProvider } from "@/context/language-context";
import { DashboardToaster } from "@/components/dashboard/dashboard-toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NextTopLoader from "nextjs-toploader";

import QueryProvider from "@/src/providers/query-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Admin Dashboard | Fadil Bafagih",
  description: "Admin dashboard for managing personal website content.",
  robots: { index: false, follow: false },
};

/**
 * Root layout for the admin dashboard route group.
 * Wraps with ThemeProvider for dark/light mode and LanguageProvider for translation support.
 */
export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(inter.variable, "font-sans antialiased")}>
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader color="var(--foreground)" showSpinner={false} shadow={false} showForHashAnchor={false} />
          <LanguageProvider>
            <QueryProvider>
              <TooltipProvider>
                {children}
              </TooltipProvider>
            </QueryProvider>
          </LanguageProvider>
          <DashboardToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
