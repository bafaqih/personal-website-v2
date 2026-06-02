"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/src/lib/track-event";

/**
 * Invisible client component that tracks page views on mount / route change.
 * Drop this into any layout to automatically log 'page_view' events.
 *
 * Usage:
 *   <PageTracker />
 */
export function PageTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    // Avoid double-tracking on the same pathname (React strict mode)
    if (pathname && pathname !== lastTracked.current) {
      lastTracked.current = pathname;
      trackEvent("page_view");
    }
  }, [pathname]);

  return null;
}
