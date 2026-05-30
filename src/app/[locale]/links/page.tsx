"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { LinksHeader } from "@/src/components/links/links-header";
import { LinksProfile } from "@/src/components/links/links-profile";
import { LinksSection } from "@/src/components/links/links-section";
import { LinksContact } from "@/src/components/links/links-contact";
import { LinksFooter } from "@/src/components/links/links-footer";
import { LinksService, type LinksPageData } from "@/src/services/links.service";
import type { LinksLocale } from "@/src/lib/links-translations";
import { ScrollToTop } from "@/components/scroll-to-top";

/**
 * Skeleton loader displayed while data is being fetched.
 */
function LinksSkeleton() {
  return (
    <div className="space-y-6 px-6 py-8">
      {/* Avatar */}
      <div className="flex flex-col items-center gap-3">
        <Skeleton className="h-28 w-28 rounded-2xl" />
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2 mt-2">
          <Skeleton className="h-7 w-36 rounded-full" />
          <Skeleton className="h-7 w-32 rounded-full" />
        </div>
        <div className="flex gap-3 mt-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-11 w-11 rounded-full" />
          ))}
        </div>
      </div>
      {/* Links */}
      <Skeleton className="h-px w-full" />
      <div className="space-y-2.5">
        <Skeleton className="h-4 w-16 mx-auto" />
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
      <div className="space-y-2.5">
        <Skeleton className="h-4 w-24 mx-auto" />
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

/**
 * /links page — Link in Bio / Linktree.
 *
 * - Mobile: full-width content, no card wrapper.
 * - Desktop: login-page style background with centered card container.
 * - Data fetched from Supabase (profiles, roles, contacts, about).
 */
export default function LinksPage() {
  const params = useParams();
  const locale = (params?.locale as LinksLocale) || "en";
  const [data, setData] = useState<LinksPageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    LinksService.getAll()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 md:bg-neutral-50 md:dark:bg-neutral-950 relative">
      {/* Desktop background pattern — matches login page */}
      <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-neutral-200/50 blur-3xl dark:bg-white/5" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-neutral-200/50 blur-3xl dark:bg-white/5" />
      </div>

      {/* Centered container */}
      <div className="relative min-h-screen flex flex-col md:items-center md:justify-start md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md mx-auto md:border md:border-neutral-200/60 md:bg-white/80 md:shadow-xl md:shadow-black/5 md:backdrop-blur-xl md:dark:border-white/10 md:dark:bg-neutral-900/80 md:dark:shadow-white/5 md:rounded-2xl md:overflow-hidden flex flex-col min-h-screen md:min-h-0"
        >
          {/* Header */}
          <LinksHeader locale={locale} contact={data?.contact ?? null} />

          {/* Content */}
          {loading ? (
            <LinksSkeleton />
          ) : (
            <div className="flex-1">
              <LinksProfile
                profile={data?.profile ?? null}
                roles={data?.roles ?? []}
                contact={data?.contact ?? null}
                locale={locale}
              />

              <LinksSection
                contact={data?.contact ?? null}
                locale={locale}
              />

              <LinksContact locale={locale} />

              <LinksFooter locale={locale} />
            </div>
          )}
        </motion.div>
      </div>

      <ScrollToTop />
    </div>
  );
}
