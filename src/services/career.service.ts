import { createClient } from "@/src/services/supabase/client";
import type { Career } from "@/src/types/database";

/**
 * Career service — CRUD operations for career/work experience records.
 */
export const CareerService = {
  async getAll(): Promise<Career[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("careers")
      .select("*")
      .order("start_date", { ascending: false });
    if (error) throw error;
    return data as Career[];
  },

  async getById(id: string): Promise<Career> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("careers")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as Career;
  },

  async create(payload: Partial<Career>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("careers")
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data as Career;
  },

  async update(id: string, payload: Partial<Career>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("careers")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as Career;
  },

  async delete(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("careers").delete().eq("id", id);
    if (error) throw error;
  },
};
