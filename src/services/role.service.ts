import { createClient } from "@/src/services/supabase/client";
import type { Role } from "@/src/types/database";

/**
 * Role service — CRUD operations for professional roles.
 */
export const RoleService = {
  async getAll(): Promise<Role[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("roles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as Role[];
  },

  async getById(id: string): Promise<Role> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("roles")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as Role;
  },

  async create(payload: Partial<Role>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("roles")
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data as Role;
  },

  async update(id: string, payload: Partial<Role>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("roles")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as Role;
  },

  async delete(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("roles").delete().eq("id", id);
    if (error) throw error;
  },
};
