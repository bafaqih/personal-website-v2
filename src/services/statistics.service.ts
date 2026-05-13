import { createClient } from "@/src/services/supabase/client";

/**
 * Statistics service — fetches aggregate counts for the dashboard overview.
 */
export const StatisticsService = {
  async getAll() {
    const supabase = createClient();

    const [skills, projects, achievements, careers, educations, organizations, blogs] =
      await Promise.all([
        supabase.from("skills").select("*", { count: "exact", head: true }),
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("achievements").select("*", { count: "exact", head: true }),
        supabase.from("careers").select("*", { count: "exact", head: true }),
        supabase.from("educations").select("*", { count: "exact", head: true }),
        supabase.from("organizations").select("*", { count: "exact", head: true }),
        supabase.from("blogs").select("*", { count: "exact", head: true }),
      ]);

    return {
      total_skills: skills.count ?? 0,
      total_projects: projects.count ?? 0,
      total_achievements: achievements.count ?? 0,
      total_careers: careers.count ?? 0,
      total_educations: educations.count ?? 0,
      total_organizations: organizations.count ?? 0,
      total_blogs: blogs.count ?? 0,
    };
  },
};
