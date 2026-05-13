import { createClient } from "@/src/services/supabase/client";
import {
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_PDF_TYPES,
  MAX_FILE_SIZE,
  STORAGE_BUCKETS,
} from "@/src/lib/constants";

/**
 * Storage service — handles file uploads to Supabase Storage.
 * Validates file type and size before upload.
 */
export const StorageService = {
  /**
   * Upload an image file to the specified folder.
   * Accepts: jpg, png, webp, svg. Max 5MB.
   */
  async uploadImage(folder: string, file: File, fileName?: string) {
    validateFile(file, ACCEPTED_IMAGE_TYPES);
    return upload(folder, file, fileName);
  },

  /**
   * Upload a PDF document (CV/Resume).
   * Accepts: pdf only. Max 5MB.
   */
  async uploadPdf(folder: string, file: File, fileName?: string) {
    validateFile(file, ACCEPTED_PDF_TYPES);
    return upload(folder, file, fileName);
  },

  /** Get the public URL for a file in storage */
  getPublicUrl(path: string) {
    const supabase = createClient();
    const { data } = supabase.storage
      .from(STORAGE_BUCKETS.ASSETS)
      .getPublicUrl(path);
    return data.publicUrl;
  },

  /** Delete a file from storage */
  async delete(path: string) {
    const supabase = createClient();
    const { error } = await supabase.storage
      .from(STORAGE_BUCKETS.ASSETS)
      .remove([path]);
    if (error) throw error;
  },
};

// --- Helpers ---

function validateFile(file: File, acceptedTypes: string[]) {
  if (!acceptedTypes.includes(file.type)) {
    throw new Error(
      `Invalid file type: ${file.type}. Accepted: ${acceptedTypes.join(", ")}`
    );
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Max: 5MB`
    );
  }
}

async function upload(folder: string, file: File, fileName?: string) {
  const supabase = createClient();
  const ext = file.name.split(".").pop();
  const name = fileName || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const path = `${folder}/${name}.${ext}`;

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKETS.ASSETS)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  // Return the public URL
  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKETS.ASSETS)
    .getPublicUrl(data.path);

  return {
    path: data.path,
    publicUrl: urlData.publicUrl,
  };
}
