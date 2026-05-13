import { createClient } from "@/src/services/supabase/client";
import type { Project, ProjectType, ProjectCategory } from "@/src/types/database";

/**
 * Project service — CRUD for projects, types, and categories.
 */
export const ProjectService = {
  // --- Projects ---
  async getAll(): Promise<Project[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*, type:project_types(*), category:project_categories(*)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as Project[];
  },

  async getById(id: string): Promise<Project> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*, type:project_types(*), category:project_categories(*)")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as Project;
  },

  async create(payload: Partial<Project>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("projects")
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data as Project;
  },

  async update(id: string, payload: Partial<Project>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("projects")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as Project;
  },

  async delete(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw error;
  },

  // --- Types ---
  async getTypes(): Promise<ProjectType[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("project_types")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as ProjectType[];
  },

  async createType(payload: Partial<ProjectType>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("project_types")
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data as ProjectType;
  },

  async updateType(id: string, payload: Partial<ProjectType>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("project_types")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as ProjectType;
  },

  async deleteType(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("project_types").delete().eq("id", id);
    if (error) throw error;
  },

  // --- Categories ---
  async getCategories(): Promise<ProjectCategory[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("project_categories")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as ProjectCategory[];
  },

  async createCategory(payload: Partial<ProjectCategory>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("project_categories")
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data as ProjectCategory;
  },

  async updateCategory(id: string, payload: Partial<ProjectCategory>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("project_categories")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as ProjectCategory;
  },

  async deleteCategory(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from("project_categories")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },
};
