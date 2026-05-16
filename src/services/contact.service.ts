import { createClient } from "@/src/services/supabase/client";
import type { Contact } from "@/src/types/database";

/**
 * Contact service — single-record CRUD for contact info.
 */
export const ContactService = {
  async get(): Promise<Contact | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .limit(1)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    return data as Contact | null;
  },

  async update(id: string, payload: Partial<Contact>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("contacts")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as Contact;
  },

  async create(payload: Partial<Contact>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("contacts")
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data as Contact;
  },
};
