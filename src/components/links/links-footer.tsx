"use client";

import { motion } from "framer-motion";
import { tLinks, type LinksLocale } from "@/src/lib/links-translations";

interface LinksFooterProps {
  locale: LinksLocale;
}

/**
 * Footer for the /links page.
 * Shows copyright and "Build with Bafdev" credit — same style as login page footer.
 */
export function LinksFooter({ locale }: LinksFooterProps) {
  return (
    <motion.footer
      className="py-6 px-6 space-y-1 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    >
      <p className="text-xs text-neutral-400 dark:text-neutral-500">
        © {new Date().getFullYear()} Fadil Bafagih. {tLinks(locale, "all_rights")}
      </p>
      <p className="text-xs text-neutral-400 dark:text-neutral-500">
        {tLinks(locale, "build_with")}{" "}
        <a
          href="https://bafdev.id/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-neutral-900 hover:underline dark:text-white transition-colors"
        >
          Bafdev
        </a>
      </p>
    </motion.footer>
  );
}
