"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { cn } from "@/src/app/lib/utils";

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: (string | { url: string; name?: string })[];
  initialIndex?: number;
}

/**
 * A professional Image Viewer Modal featuring:
 * - A glassmorphic blurred backdrop.
 * - Custom premium rounded square controls matching the updated X button layout.
 * - Left/Right chevrons for multi-image navigation (keyboard arrow keys supported).
 * - Original file name display in the top-left corner.
 * - Bottom gallery thumbnail strip allowing instant jump to any image.
 * - Smooth transition animations and focus safety.
 */
export function ImageViewerModal({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
}: ImageViewerModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [mounted, setMounted] = useState(false);
  const [isTransparent, setIsTransparent] = useState(false);
  const bottomStripRef = useRef<HTMLDivElement>(null);

  // Sync mounted status on client-side
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const activeImage = images[currentIndex];
  // Helper to get image url safely
  const getImageUrl = (item: string | { url: string; name?: string }): string => {
    if (!item) return "";
    if (typeof item === "string") return item;
    return item.url;
  };
  const activeUrl = activeImage ? getImageUrl(activeImage) : "";

  // Transparency check helper
  useEffect(() => {
    if (!activeUrl) {
      setIsTransparent(false);
      return;
    }
    
    const isTransparentExt = /\.(png|svg|webp)($|\?)/i.test(activeUrl) || 
                             activeUrl.startsWith("data:image/svg") || 
                             activeUrl.startsWith("data:image/png");
                             
    if (!isTransparentExt) {
      setIsTransparent(false);
      return;
    }

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = Math.min(img.width, 50);
        canvas.height = Math.min(img.height, 50);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setIsTransparent(isTransparentExt);
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        for (let i = 3; i < imageData.length; i += 4) {
          if (imageData[i] < 254) {
            setIsTransparent(true);
            return;
          }
        }
        setIsTransparent(false);
      } catch (e) {
        setIsTransparent(isTransparentExt);
      }
    };
    img.onerror = () => {
      setIsTransparent(false);
    };
    img.src = activeUrl;
  }, [activeUrl]);

  // Sync index when modal opens or initialIndex changes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  // Handle keyboard arrow keys & Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      } else if (e.key === "ArrowRight" && currentIndex < images.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      // Prevent background scrolling
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, currentIndex, images.length, onClose]);

  // Center active thumbnail in bottom gallery strip
  useEffect(() => {
    if (bottomStripRef.current) {
      const activeElement = bottomStripRef.current.children[currentIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [currentIndex]);

  if (!isOpen || !images || images.length === 0 || !mounted) return null;

  const getImageName = (item: string | { url: string; name?: string }, index: number): string => {
    if (!item) return "";
    if (typeof item !== "string" && item.name) {
      return item.name;
    }
    const url = typeof item === "string" ? item : item.url;
    if (url.startsWith("data:")) {
      // Local draft / base64 preview fallback
      return `local-draft-image-${index + 1}.png`;
    }
    // Remote URL path extraction
    const parts = url.split("/");
    const lastPart = parts[parts.length - 1];
    return lastPart ? lastPart.split("?")[0] : `image-${index + 1}.png`;
  };

  const activeName = getImageName(activeImage, currentIndex);

  const hasMultiple = images.length > 1;

  return createPortal(
    <div className="fixed inset-0 isolate z-50 flex items-center justify-center p-4">
      {/* Premium Glassmorphic Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/10 backdrop-blur-xs cursor-pointer"
      />

      {/* Floating Filename Display (Top-Left) */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6 z-60 max-w-[calc(100%-8rem)]">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl sm:rounded-2xl bg-white/70 dark:bg-neutral-800/70 backdrop-blur-md border border-neutral-300 dark:border-neutral-600 shadow-lg select-none">
          <div className="p-1 bg-neutral-200/50 dark:bg-neutral-800 rounded-lg flex items-center justify-center shrink-0">
            <ImageIcon className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
          </div>
          <span className="font-medium text-xs sm:text-sm text-neutral-950 dark:text-neutral-50 truncate">
            {activeName}
          </span>
        </div>
      </div>

      {/* Floating Close Button (Top-Right) */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-60">
        <button
          onClick={onClose}
          type="button"
          className={cn(
            "relative flex items-center justify-center w-12 h-12 rounded-xl sm:rounded-2xl",
            "bg-white/70 dark:bg-neutral-800/70 backdrop-blur-md",
            "border border-neutral-300 dark:border-neutral-600 shadow-lg",
            "text-neutral-950 dark:text-neutral-50",
            "hover:bg-white/90 dark:hover:bg-neutral-800/90 active:scale-95",
            "transition-all duration-200 cursor-pointer outline-none group"
          )}
          title="Close viewer"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Floating Left Navigation Chevron */}
      {hasMultiple && currentIndex > 0 && (
        <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-60">
          <button
            onClick={() => setCurrentIndex((prev) => prev - 1)}
            type="button"
            className={cn(
              "relative flex items-center justify-center w-12 h-12 rounded-xl sm:rounded-2xl",
              "bg-white/70 dark:bg-neutral-800/70 backdrop-blur-md",
              "border border-neutral-300 dark:border-neutral-600 shadow-lg",
              "text-neutral-950 dark:text-neutral-50",
              "hover:bg-white/90 dark:hover:bg-neutral-800/90 active:scale-95",
              "transition-all duration-200 cursor-pointer outline-none group"
            )}
            title="Previous image"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      )}

      {/* Floating Right Navigation Chevron */}
      {hasMultiple && currentIndex < images.length - 1 && (
        <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-60">
          <button
            onClick={() => setCurrentIndex((prev) => prev + 1)}
            type="button"
            className={cn(
              "relative flex items-center justify-center w-12 h-12 rounded-xl sm:rounded-2xl",
              "bg-white/70 dark:bg-neutral-800/70 backdrop-blur-md",
              "border border-neutral-300 dark:border-neutral-600 shadow-lg",
              "text-neutral-950 dark:text-neutral-50",
              "hover:bg-white/90 dark:hover:bg-neutral-800/90 active:scale-95",
              "transition-all duration-200 cursor-pointer outline-none group"
            )}
            title="Next image"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      )}

      {/* Primary Image Viewport Container */}
      <div className="relative w-full max-w-[85vw] h-[68vh] flex items-center justify-center z-50 pointer-events-none select-none">
        <img
          src={activeUrl}
          alt={activeName}
          className={cn(
            "max-w-full max-h-full object-contain rounded-2xl pointer-events-auto select-none transition-all duration-300",
            isTransparent
              ? "" 
              : "shadow-2xl border border-neutral-200/10 dark:border-neutral-800/10"
          )}
        />
      </div>

      {/* Bottom Gallery Thumbnail Strip */}
      {hasMultiple && (
        <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-60 max-w-[85vw]">
          <div
            ref={bottomStripRef}
            className={cn(
              "flex items-center gap-2 p-2.5 rounded-2xl sm:rounded-3xl",
              "bg-white/70 dark:bg-neutral-800/70 backdrop-blur-md",
              "border border-neutral-300 dark:border-neutral-600 shadow-xl",
              "overflow-x-auto scrollbar-none scroll-smooth"
            )}
            style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
          >
            {images.map((item, idx) => {
              const url = getImageUrl(item);
              const name = getImageName(item, idx);
              const isActive = idx === currentIndex;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={cn(
                    "relative w-14 h-10 sm:w-16 sm:h-11 rounded-lg overflow-hidden shrink-0 transition-all duration-200 cursor-pointer select-none",
                    isActive
                      ? "ring-2 ring-neutral-900 dark:ring-white border-transparent opacity-100"
                      : "opacity-40 hover:opacity-85"
                  )}
                  title={`View image ${idx + 1}`}
                >
                  <img
                    src={url}
                    alt={name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
