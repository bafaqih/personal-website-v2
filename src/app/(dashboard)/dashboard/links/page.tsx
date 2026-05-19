"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLanguage } from "@/context/language-context";

/**
 * Links page — Coming Soon.
 * Redirects back and shows a toast notification.
 */
export default function LinksPage() {
  const router = useRouter();
  const { language } = useLanguage();

  useEffect(() => {
    toast.info(language === "en" ? "Coming Soon" : "Segera Hadir", {
      description: language === "en" 
        ? "The Links feature is currently under development." 
        : "Fitur Tautan saat ini sedang dalam pengembangan.",
    });
    router.back();
  }, [router, language]);

  return null;
}
