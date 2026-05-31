"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Moon, Sun, Share2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/src/app/lib/utils";
import { tLinks, type LinksLocale } from "@/src/lib/links-translations";
import type { Contact } from "@/src/types/database";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

import logoBlack from "@/src/assets/images/fadilbaf-black.svg";
import logoWhite from "@/src/assets/images/fadilbaf-white.svg";

/** Inline SVG brand icons for share dropdown */
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

interface LinksHeaderProps {
  locale: LinksLocale;
  contact: Contact | null;
}

/**
 * Header for the /links page.
 * Mirrors dashboard mobile header style with logo, language switch, theme toggle, and share dropdown.
 */
export function LinksHeader({ locale, contact }: LinksHeaderProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Wait for client-side mount to avoid hydration mismatch with theme
  useEffect(() => {
    setMounted(true);
  }, []);

  const otherLocale = locale === "en" ? "id" : "en";

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(tLinks(locale, "copied"), {
        description: tLinks(locale, "copied_desc"),
      });
      setDropdownOpen(false);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      toast.success(tLinks(locale, "copied"), {
        description: tLinks(locale, "copied_desc"),
      });
      setDropdownOpen(false);
    }
  };

  const handleSocialShare = (platform: "X" | "Facebook" | "LinkedIn") => {
    const url = window.location.href;
    const text =
      locale === "id"
        ? "Hubungi Fadil Bafagih di semua platform!"
        : "Connect with Fadil Bafagih across all platforms!";

    let shareUrl = "";
    if (platform === "X") {
      shareUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    } else if (platform === "Facebook") {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    } else if (platform === "LinkedIn") {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
      setDropdownOpen(false);
    }
  };

  const shareChannels = [
    { name: "X" as const, icon: XIcon, label: "X" },
    { name: "Facebook" as const, icon: FacebookIcon, label: "Facebook" },
    { name: "LinkedIn" as const, icon: LinkedInIcon, label: "LinkedIn" },
  ];

  return (
    <TooltipProvider>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-30 flex h-14 items-center justify-between px-3.5 bg-white/70 backdrop-blur-xl border-b border-neutral-200/60 dark:bg-neutral-950/70 dark:border-white/10"
      >
        {/* Logo */}
        <Link href={`/${locale}/links`} className="relative flex items-center h-7">
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

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* 1. Language switch */}
          <Tooltip>
            <TooltipTrigger asChild onFocus={(e) => e.preventDefault()}>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="h-9 w-9 rounded-lg border border-neutral-200 dark:border-white/10 relative cursor-pointer flex items-center justify-center"
                aria-label={tLinks(locale, "switch_lang")}
                onClick={(e) => {
                  e.currentTarget.blur();
                }}
              >
                <Link href={`/${otherLocale}/links`}>
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
              <p>{tLinks(locale, "switch_lang")}</p>
            </TooltipContent>
          </Tooltip>

          {/* 2. Theme toggle */}
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
                  aria-label={tLinks(locale, resolvedTheme === "dark" ? "theme_light" : "theme_dark")}
                >
                  <Moon className="h-4 w-4 text-neutral-600 dark:text-neutral-400 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Sun className="absolute h-4 w-4 text-neutral-600 dark:text-neutral-400 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{tLinks(locale, resolvedTheme === "dark" ? "theme_light" : "theme_dark")}</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* 3. Share button (as DropdownMenu) */}
          <Tooltip open={dropdownOpen ? false : undefined}>
            <DropdownMenu onOpenChange={setDropdownOpen} open={dropdownOpen}>
              <TooltipTrigger asChild onFocus={(e) => e.preventDefault()}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-lg border border-neutral-200 dark:border-white/10 cursor-pointer text-neutral-600 dark:text-neutral-400 relative flex items-center justify-center"
                    aria-label={tLinks(locale, "share")}
                    onClick={(e) => {
                      e.currentTarget.blur();
                    }}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[200px] p-2.5"
                onCloseAutoFocus={(e) => e.preventDefault()}
              >
                <DropdownMenuLabel className="text-xs font-semibold px-2 py-1 text-neutral-500 dark:text-neutral-400">
                  {tLinks(locale, "share_links")}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1.5" />

                {/* Social Share Grid (X, Facebook, LinkedIn) */}
                <div className="grid grid-cols-3 gap-1.5 mb-2">
                  {shareChannels.map(({ name, icon: Icon, label }) => (
                    <button
                      key={name}
                      onClick={() => handleSocialShare(name)}
                      className="flex h-9 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-600 transition-all duration-200 hover:bg-neutral-100 hover:scale-105 dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 cursor-pointer"
                      aria-label={label}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  ))}
                </div>

                {/* Copy Link Button (using Copy icon) */}
                <button
                  onClick={handleCopyUrl}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-700 transition-all hover:bg-neutral-100 dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5" />
                  {tLinks(locale, "copy_url")}
                </button>
              </DropdownMenuContent>
            </DropdownMenu>
            <TooltipContent side="bottom">
              <p>{tLinks(locale, "share")}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </motion.header>
    </TooltipProvider>
  );
}
