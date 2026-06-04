"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Moon, Sun, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/src/app/lib/utils";
import { tError, type ErrorLocale } from "@/src/lib/error-translations";
import { trackEvent } from "@/src/lib/track-event";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import logoBlack from "@/src/assets/images/fadilbaf-black.svg";
import logoWhite from "@/src/assets/images/fadilbaf-white.svg";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const textBlurVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function NotFoundErrorContent() {
  const params = useParams() as { locale: string };
  const locale = (params.locale === "id" ? "id" : "en") as ErrorLocale;
  const otherLocale = locale === "en" ? "id" : "en";

  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update page title metadata dynamically as fallback
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.title = locale === "id"
        ? "Oops! Halaman Tidak Ditemukan | Fadil Bafagih"
        : "Oops! Page Not Found | Fadil Bafagih";
    }
  }, [locale]);

  // Compute switch language URL path
  const switchLangPath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  const handleGoBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden font-sans select-none">
      {/* Decorative Glow Backgrounds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-neutral-200/50 blur-3xl dark:bg-white/5" />
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-neutral-200/50 blur-3xl dark:bg-white/5" />
      </div>

      <TooltipProvider>
        {/* Header matching LinksHeader spacing and style */}
        <motion.header
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="sticky top-0 z-30 flex h-14 w-full items-center justify-between px-3.5 sm:px-12 md:px-24 lg:px-36 bg-white/70 backdrop-blur-xl border-b border-neutral-200/60 dark:bg-neutral-950/70 dark:border-white/10"
        >
          {/* Logo */}
          <Link href={`/`} className="relative flex items-center h-7 cursor-pointer outline-none">
            <img
              src={logoBlack.src}
              alt="Fadil Bafagih"
              className="dark:hidden h-7 w-auto"
            />
            <img
              src={logoWhite.src}
              alt="Fadil Bafagih"
              className="hidden dark:block h-7 w-auto"
            />
          </Link>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Language Switch */}
            <Tooltip>
              <TooltipTrigger asChild onFocus={(e) => e.preventDefault()}>
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="h-9 w-9 rounded-lg border border-neutral-200 dark:border-white/10 relative cursor-pointer flex items-center justify-center"
                  aria-label={tError(locale, "switch_lang")}
                  onClick={(e) => {
                    e.currentTarget.blur();
                  }}
                >
                  <Link 
                    href={switchLangPath}
                    onClick={() => trackEvent("language_switch", otherLocale)}
                  >
                    <svg
                      className="h-4 w-4 text-neutral-600 dark:text-neutral-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                      <path d="M2 12h20" />
                    </svg>
                    {/* Badge */}
                    <span className="absolute -bottom-1.5 -right-1.5 z-0 flex h-4 min-w-[16px] items-center justify-center rounded-[4px] bg-neutral-900 px-0.5 text-[8px] font-bold text-white border border-neutral-200 dark:bg-white dark:text-neutral-900 dark:border-neutral-800 leading-none select-none uppercase">
                      {otherLocale}
                    </span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{tError(locale, "switch_lang")}</p>
              </TooltipContent>
            </Tooltip>

            {/* Theme Toggle */}
            {mounted && (
              <Tooltip>
                <TooltipTrigger asChild onFocus={(e) => e.preventDefault()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      setTheme(resolvedTheme === "dark" ? "light" : "dark");
                      e.currentTarget.blur();
                    }}
                    className="h-9 w-9 rounded-lg border border-neutral-200 dark:border-white/10 cursor-pointer relative flex items-center justify-center"
                    aria-label={tError(locale, resolvedTheme === "dark" ? "theme_light" : "theme_dark")}
                  >
                    <Moon className="h-4 w-4 text-neutral-600 dark:text-neutral-400 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Sun className="absolute h-4 w-4 text-neutral-600 dark:text-neutral-400 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{tError(locale, resolvedTheme === "dark" ? "theme_light" : "theme_dark")}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </motion.header>
      </TooltipProvider>

      {/* Main Error Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-xl mx-auto text-center flex flex-col items-center"
        >
          {/* Metallic 404 */}
          <motion.h1
            variants={textBlurVariants}
            className="text-7xl sm:text-8xl md:text-[8rem] font-extrabold tracking-tighter bg-linear-to-b from-neutral-800 via-neutral-800/80 via-60% to-background dark:from-white dark:via-white/80 dark:via-60% dark:to-background bg-clip-text text-transparent leading-none select-none"
          >
            404
          </motion.h1>

          {/* Oops Title */}
          <motion.h2
            variants={textBlurVariants}
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight relative -mt-3 sm:-mt-5 md:-mt-6 z-10"
          >
            {tError(locale, "oops_title")}
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={textBlurVariants}
            className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 max-w-md leading-relaxed mb-8 mt-2"
          >
            {tError(locale, "desc_404")}
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            variants={buttonVariants}
            className="flex flex-row items-center justify-center gap-3 w-full sm:w-auto px-4 sm:px-0"
          >
            <Button
              asChild
              className="flex-1 sm:flex-initial w-auto px-6 h-11 bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 gap-2 font-semibold cursor-pointer shadow-none"
            >
              <Link href={`/`}>
                <Home className="h-4 w-4" />
                {tError(locale, "go_home")}
              </Link>
            </Button>

            <Button
              onClick={handleGoBack}
              variant="outline"
              className="flex-1 sm:flex-initial w-auto px-6 h-11 border border-neutral-200 bg-transparent text-neutral-900 hover:bg-transparent hover:text-neutral-700 hover:border-neutral-300 dark:border-white/10 dark:text-white dark:bg-transparent dark:hover:bg-transparent dark:hover:text-neutral-300 dark:hover:border-white/20 gap-2 font-semibold cursor-pointer shadow-none"
            >
              <ArrowLeft className="h-4 w-4" />
              {tError(locale, "go_back")}
            </Button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
