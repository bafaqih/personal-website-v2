import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/src/app/lib/utils";
import { ThemeProvider } from "@/components/dashboard/theme-provider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard — Fadil Bafagih",
    template: "%s — Admin Dashboard",
  },
  description: "Admin dashboard for managing Fadil Bafagih's personal website content.",
  robots: { index: false, follow: false },
};

/**
 * Root layout for the admin dashboard route group.
 * No i18n — English only. Wraps with ThemeProvider for dark/light mode.
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
          {children}
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
