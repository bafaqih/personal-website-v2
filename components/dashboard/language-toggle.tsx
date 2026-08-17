"use client";

import { Globe } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * Language toggle button — switches between ID and EN.
 * Features a Globe icon with an overlapping badge indicating current language.
 */
export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);

  const toggleLanguage = (e: React.MouseEvent<HTMLButtonElement>) => {
    setLanguage(language === "en" ? "id" : "en");
    setOpen(false); // Hide tooltip on click
    e.currentTarget.blur();
  };

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleLanguage}
          className="h-9 w-9 rounded-lg border border-neutral-200 dark:border-white/10 relative active:bg-neutral-100 dark:active:bg-white/10"
          aria-label="Toggle language"
        >
          <Globe className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
          
          {/* Overlapping Badge */}
          <span className="absolute -bottom-1.5 -right-1.5 z-0 flex h-4 min-w-[16px] items-center justify-center rounded-[4px] bg-neutral-900 px-0.5 text-[8px] font-bold text-white border border-neutral-200 dark:bg-white dark:text-neutral-900 dark:border-neutral-800 leading-none select-none uppercase">
            {language === "en" ? "id" : "en"}
          </span>
          
          <span className="sr-only">Toggle language</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{t("header.lang_tooltip")}</p>
      </TooltipContent>
    </Tooltip>
  );
}
