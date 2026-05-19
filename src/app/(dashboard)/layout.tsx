import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/src/app/lib/utils";
import { ThemeProvider } from "@/components/dashboard/theme-provider";
import { LanguageProvider } from "@/context/language-context";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

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
          <LanguageProvider>
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </LanguageProvider>
          <Toaster
            position="top-right"
            duration={5000}
            closeButton
            expand={true}
            richColors
            toastOptions={{
              className: "font-sans pr-10",
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
