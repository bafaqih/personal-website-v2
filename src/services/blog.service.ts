import { createClient } from "@/src/services/supabase/client";
import type { Blog, BlogType, BlogCategory } from "@/src/types/database";

/**
 * Blog service — CRUD for blogs, types, and categories.
 */
export const BlogService = {
  async getAll(): Promise<Blog[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blogs")
      .select("*, type:blog_types(*), category:blog_categories(*), author:profiles(*)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as Blog[];
  },

  async getById(id: string): Promise<Blog> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blogs")
      .select("*, type:blog_types(*), category:blog_categories(*), author:profiles(*)")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as Blog;
  },

  async create(payload: Partial<Blog>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blogs")
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data as Blog;
  },

  async update(id: string, payload: Partial<Blog>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blogs")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as Blog;
  },

  async delete(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("blogs").delete().eq("id", id);
    if (error) throw error;
  },

  // --- Types ---
  async getTypes(): Promise<BlogType[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blog_types")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as BlogType[];
  },

  async createType(payload: Partial<BlogType>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blog_types")
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data as BlogType;
  },

  async updateType(id: string, payload: Partial<BlogType>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blog_types")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as BlogType;
  },

  async deleteType(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("blog_types").delete().eq("id", id);
    if (error) throw error;
  },

  // --- Categories ---
  async getCategories(): Promise<BlogCategory[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blog_categories")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as BlogCategory[];
  },

  async createCategory(payload: Partial<BlogCategory>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blog_categories")
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data as BlogCategory;
  },

  async updateCategory(id: string, payload: Partial<BlogCategory>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blog_categories")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as BlogCategory;
  },

  async deleteCategory(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from("blog_categories")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },

  // --- Tags ---
  async getUniqueTags(): Promise<string[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blog_tags")
      .select("tag");
    
    if (error) throw error;
    
    // Extract unique tags and sort alphabetically
    const tags = data.map((t) => t.tag);
    return Array.from(new Set(tags)).sort();
  },

  async syncTags(blogId: string, tags: string[]) {
    const supabase = createClient();
    
    // 1. Delete old tags
    const { error: deleteError } = await supabase
      .from("blog_tags")
      .delete()
      .eq("blog_id", blogId);
    
    if (deleteError) throw deleteError;

    // 2. Insert new tags
    if (tags.length > 0) {
      const tagRows = tags.map((tag) => ({
        blog_id: blogId,
        tag: tag.trim(),
      }));
      
      const { error: insertError } = await supabase
        .from("blog_tags")
        .insert(tagRows);
      
      if (insertError) throw insertError;
    }
  },

  async getTagsByBlogId(blogId: string): Promise<string[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blog_tags")
      .select("tag")
      .eq("blog_id", blogId);
    
    if (error) throw error;
    return data.map((t) => t.tag);
  },
};
