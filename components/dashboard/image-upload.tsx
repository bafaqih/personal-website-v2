"use client";

import { useCallback, useState } from "react";
import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";
import { cn } from "@/src/app/lib/utils";
import {
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_PDF_TYPES,
  MAX_FILE_SIZE,
} from "@/src/lib/constants";
import Image from "next/image";

interface ImageUploadProps {
  value?: string;
  onChange: (file: File | null, previewUrl: string | null) => void;
  accept?: "image" | "pdf";
  className?: string;
  disabled?: boolean;
}

/**
 * File upload component with drag & drop and preview support.
 * - Images: jpg, png, webp, svg (max 5MB) with image preview
 * - PDF: pdf only (max 5MB) with file name preview
 */
export function ImageUpload({
  value,
  onChange,
  accept = "image",
  className,
  disabled = false,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const acceptedTypes =
    accept === "pdf" ? ACCEPTED_PDF_TYPES : ACCEPTED_IMAGE_TYPES;
  const acceptString =
    accept === "pdf"
      ? ".pdf"
      : ".jpg,.jpeg,.png,.webp,.svg";

  const handleFile = useCallback(
    (file: File) => {
      setError(null);

      // Validate type
      if (!acceptedTypes.includes(file.type)) {
        setError(
          `Invalid file type. Accepted: ${accept === "pdf" ? "PDF" : "JPG, PNG, WebP, SVG"}`
        );
        return;
      }

      // Validate size
      if (file.size > MAX_FILE_SIZE) {
        setError(
          `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max: 5MB`
        );
        return;
      }

      setFileName(file.name);

      if (accept === "image") {
        const reader = new FileReader();
        reader.onload = (e) => {
          const url = e.target?.result as string;
          setPreview(url);
          onChange(file, url);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
        onChange(file, null);
      }
    },
    [accept, acceptedTypes, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleRemove = () => {
    setPreview(null);
    setFileName(null);
    setError(null);
    onChange(null, null);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {/* Preview */}
      {(preview || fileName) && (
        <div className="relative inline-block">
          {accept === "image" && preview ? (
            <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-neutral-200 dark:border-white/10">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 dark:border-white/10">
              <FileText className="h-4 w-4 text-neutral-500" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                {fileName}
              </span>
            </div>
          )}
          {!disabled && (
            <button
              onClick={handleRemove}
              className="absolute -right-2 -top-2 rounded-full bg-neutral-900 p-1 text-white shadow-sm transition-colors hover:bg-red-600 dark:bg-white dark:text-neutral-900 dark:hover:bg-red-500 dark:hover:text-white"
              type="button"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      )}

      {/* Drop zone */}
      {!preview && !fileName && (
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-8 transition-all",
            dragOver
              ? "border-neutral-900 bg-neutral-50 dark:border-white dark:bg-white/5"
              : "border-neutral-300 hover:border-neutral-400 dark:border-white/20 dark:hover:border-white/40",
            disabled && "pointer-events-none opacity-50"
          )}
        >
          <input
            type="file"
            accept={acceptString}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
            className="hidden"
            disabled={disabled}
          />
          {accept === "image" ? (
            <ImageIcon className="mb-2 h-8 w-8 text-neutral-400" />
          ) : (
            <Upload className="mb-2 h-8 w-8 text-neutral-400" />
          )}
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            Drop file here or{" "}
            <span className="text-neutral-900 underline dark:text-white">
              browse
            </span>
          </p>
          <p className="mt-1 text-xs text-neutral-400">
            {accept === "pdf"
              ? "PDF only, max 5MB"
              : "JPG, PNG, WebP, SVG — max 5MB"}
          </p>
        </label>
      )}

      {/* Error */}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
