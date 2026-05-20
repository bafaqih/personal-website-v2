"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/src/app/lib/utils";

/**
 * Premium ScrollToTop button component.
 * - Styled exactly identical to the custom PDF close button.
 * - Positioned in the bottom-right corner.
 * - Dynamically toggles visibility based on scroll height.
 * - Lightweight fluid fade-up / fade-down Tailwind transition animations.
 */
export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Use setTimeout to ensure Radix UI has finished updating DOM attributes
      setTimeout(() => {
        const isModalOpen = 
          document.body.style.pointerEvents === "none" || 
          document.body.hasAttribute("data-scroll-locked") ||
          document.body.style.overflow === "hidden" ||
          !!document.querySelector('[data-state="open"]');

        // Show button if scrolled down past 300px and no modals/sidebars are open
        if (window.scrollY > 300 && !isModalOpen) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }, 0);
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    
    // Watch for dialog/sheet mounting/unmounting and attribute locks on the document body
    const observer = new MutationObserver(toggleVisibility);
    observer.observe(document.body, { attributes: true, childList: true, subtree: true });

    // Initial check
    toggleVisibility();

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
      observer.disconnect();
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      type="button"
      className={cn(
        "fixed bottom-6 right-6 z-40 flex items-center justify-center w-12 h-12 rounded-xl sm:rounded-2xl",
        "bg-white/70 dark:bg-neutral-800/70 backdrop-blur-md",
        "border border-neutral-300 dark:border-neutral-600 shadow-lg",
        "text-neutral-950 dark:text-neutral-50",
        "hover:bg-white/90 dark:hover:bg-neutral-800/90 active:scale-95",
        "transition-all duration-300 ease-out cursor-pointer outline-none group",
        isVisible 
          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" 
          : "opacity-0 translate-y-4 scale-90 pointer-events-none"
      )}
      title="Scroll to top"
    >
      <ChevronUp className="w-5 h-5 stroke-[2.5] transition-transform duration-300 group-hover:-translate-y-0.5" />
    </button>
  );
}
