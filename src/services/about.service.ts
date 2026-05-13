import { createClient } from "@/src/services/supabase/client";
import type { About } from "@/src/types/database";

/**
 * About service — single-record CRUD for the About section.
 */
export const AboutService = {
  async get(): Promise<About | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("about")
      .select("*")
      .limit(1)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    return data as About | null;
  },

  async update(id: string, payload: Partial<About>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("about")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as About;
  },
};
