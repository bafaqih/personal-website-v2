import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/src/app/lib/utils";
import { ThemeProvider } from "@/components/dashboard/theme-provider";
import NotFoundErrorPage from "./[locale]/errors/404/page";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default function RootNotFound() {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full antialiased font-sans", inter.variable)}
    >
      <head>
        <title>Oops! Page Not Found | Fadil Bafagih</title>
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NotFoundErrorPage />
        </ThemeProvider>
      </body>
    </html>
  );
}
