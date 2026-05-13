"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * Links page — Coming Soon.
 * Redirects back and shows a toast notification.
 */
export default function LinksPage() {
  const router = useRouter();

  useEffect(() => {
    toast.info("Coming Soon", {
      description: "The Links feature is currently under development.",
    });
    router.back();
  }, [router]);

  return null;
}
