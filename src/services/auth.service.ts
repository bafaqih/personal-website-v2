import { createClient } from "@/src/services/supabase/client";
import type { Profile } from "@/src/types/database";

/**
 * Authentication service — handles sign in, sign out, and session management.
 * All methods use the browser Supabase client.
 */
export const AuthService = {
  /** Sign in with email and password */
  async signIn(email: string, password: string) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  /** Sign out and clear session */
  async signOut() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /** Get the current authenticated user */
  async getUser() {
    const supabase = createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  /** Get the profile of the currently authenticated user */
  async getProfile(): Promise<Profile | null> {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) throw error;
    return data as Profile;
  },

  /** Update the profile of the currently authenticated user */
  async updateProfile(id: string, updates: Partial<Profile>): Promise<Profile> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  },

  /** Update the password of the currently authenticated user */
  async updatePassword(oldPassword: string, newPassword: string): Promise<void> {
    const supabase = createClient();
    
    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user || !user.email) {
      throw new Error("User session not found. Please log in again.");
    }

    // Re-authenticate to verify old password
    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: oldPassword,
    });
    if (reauthError) {
      throw new Error("Incorrect old password.");
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
      current_password: oldPassword,
    });
    if (updateError) throw updateError;
  },
};
