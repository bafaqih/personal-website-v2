"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Share2, Globe } from "lucide-react";
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

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.88 0 1.441 1.441 0 012.88 0z" />
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
  const [shareTooltipOpen, setShareTooltipOpen] = useState(false);

  // Wait for client-side mount to avoid hydration mismatch with theme
  useState(() => {
    setMounted(true);
  });

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

  const socialLinks = [
    { url: contact?.linkedin_url, icon: LinkedInIcon, label: "LinkedIn" },
    { url: contact?.github_url, icon: GitHubIcon, label: "GitHub" },
    { url: contact?.instagram_url, icon: InstagramIcon, label: "Instagram" },
  ].filter((link) => link.url);

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between px-3.5 bg-white/70 backdrop-blur-xl border-b border-neutral-200/60 dark:bg-neutral-950/70 dark:border-white/10">
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
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="h-9 w-9 rounded-lg border border-neutral-200 dark:border-white/10 relative cursor-pointer flex items-center justify-center"
                aria-label={tLinks(locale, "switch_lang")}
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
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setTheme(resolvedTheme === "dark" ? "light" : "dark")
                  }
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
          <Tooltip
            open={dropdownOpen ? false : shareTooltipOpen}
            onOpenChange={setShareTooltipOpen}
          >
            <DropdownMenu onOpenChange={setDropdownOpen} open={dropdownOpen}>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-lg border border-neutral-200 dark:border-white/10 cursor-pointer text-neutral-600 dark:text-neutral-400 relative flex items-center justify-center"
                    aria-label={tLinks(locale, "share")}
                    onClick={(e) => {
                      setShareTooltipOpen(false);
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

                {socialLinks.length > 0 && (
                  <div className="grid grid-cols-3 gap-1.5 mb-2">
                    {socialLinks.map(({ url, icon: Icon, label }) => (
                      <a
                        key={label}
                        href={url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-600 transition-all duration-200 hover:bg-neutral-100 hover:scale-105 dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
                        aria-label={label}
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    ))}
                  </div>
                )}

                <button
                  onClick={handleCopyUrl}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-700 transition-all hover:bg-neutral-100 dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 cursor-pointer"
                >
                  <Globe className="h-3.5 w-3.5" />
                  {tLinks(locale, "copy_url")}
                </button>
              </DropdownMenuContent>
            </DropdownMenu>
            <TooltipContent side="bottom">
              <p>{tLinks(locale, "share")}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </header>
    </TooltipProvider>
  );
}
