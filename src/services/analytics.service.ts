import { createClient } from "@/src/services/supabase/client";

/**
 * Analytics service — handles event tracking (public site) and
 * aggregated data fetching (admin dashboard charts).
 */
export const AnalyticsService = {
  // ─── TRACKING (called from public site) ─────────────────────

  /** Insert a single analytics event. */
  async trackEvent(payload: {
    event_type: string;
    event_key?: string;
    page_path?: string;
    referrer?: string;
    visitor_hash?: string;
  }) {
    const supabase = createClient();
    return supabase.from("analytics_events").insert(payload);
  },

  // ─── DASHBOARD READS ────────────────────────────────────────

  /** Total page views (all time). */
  async getPageViews(): Promise<number> {
    const supabase = createClient();
    const { count } = await supabase
      .from("analytics_events")
      .select("*", { count: "exact", head: true })
      .eq("event_type", "page_view");
    return count ?? 0;
  },

  /** Unique visitors (distinct visitor_hash for page_view). */
  async getUniqueVisitors(): Promise<number> {
    const supabase = createClient();
    const { data } = await supabase
      .from("analytics_events")
      .select("visitor_hash")
      .eq("event_type", "page_view")
      .not("visitor_hash", "is", null);
    const unique = new Set(data?.map((d) => d.visitor_hash));
    return unique.size;
  },

  /** CV download count. */
  async getCvDownloads(): Promise<number> {
    const supabase = createClient();
    const { count } = await supabase
      .from("analytics_events")
      .select("*", { count: "exact", head: true })
      .eq("event_type", "cv_download");
    return count ?? 0;
  },

  /** Top projects by click count. */
  async getTopProjects(limit = 5) {
    const supabase = createClient();
    const { data } = await supabase
      .from("analytics_events")
      .select("event_key")
      .eq("event_type", "project_click");

    const map: Record<string, number> = {};
    data?.forEach((d) => {
      if (d.event_key) map[d.event_key] = (map[d.event_key] || 0) + 1;
    });
    return Object.entries(map)
      .map(([name, clicks]) => ({ name, clicks }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, limit);
  },

  /** Top blogs by click count. */
  async getTopBlogs(limit = 5) {
    const supabase = createClient();
    const { data } = await supabase
      .from("analytics_events")
      .select("event_key")
      .eq("event_type", "blog_click");

    const map: Record<string, number> = {};
    data?.forEach((d) => {
      if (d.event_key) map[d.event_key] = (map[d.event_key] || 0) + 1;
    });
    return Object.entries(map)
      .map(([name, clicks]) => ({ name, clicks }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, limit);
  },

  /** Language preference ratio (id vs en). */
  async getLanguageRatio() {
    const supabase = createClient();
    const { data } = await supabase
      .from("analytics_events")
      .select("page_path")
      .eq("event_type", "page_view");

    const map: Record<string, number> = { id: 0, en: 0 };
    data?.forEach((d) => {
      if (d.page_path) {
        const parts = d.page_path.split("/").filter(Boolean);
        const locale = parts[0]?.toLowerCase();
        if (locale && locale in map) map[locale]++;
      }
    });
    return [
      { name: "Indonesia", value: map.id },
      { name: "English", value: map.en },
    ];
  },

  /** Page views per day (last N days) for trend chart. */
  async getViewsTrend(days = 30) {
    const supabase = createClient();
    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data } = await supabase
      .from("analytics_events")
      .select("created_at")
      .eq("event_type", "page_view")
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: true });

    // Group by date string
    const map: Record<string, number> = {};
    data?.forEach((d) => {
      const date = d.created_at.split("T")[0];
      map[date] = (map[date] || 0) + 1;
    });
    return Object.entries(map).map(([date, views]) => ({ date, views }));
  },

  /** Tech stack distribution (from SQL view). */
  async getTechStackDistribution() {
    const supabase = createClient();
    const { data } = await supabase
      .from("view_tech_stack_distribution")
      .select("*")
      .limit(10);
    return (
      data?.map((d) => ({
        name: d.skill_name,
        value: Number(d.total_used),
      })) ?? []
    );
  },

  /** Project status breakdown (from SQL view). */
  async getProjectStatusBreakdown() {
    const supabase = createClient();
    const { data } = await supabase
      .from("view_project_status_breakdown")
      .select("*");
    return (
      data?.map((d) => ({
        name: d.status,
        value: Number(d.total),
      })) ?? []
    );
  },

  /** Blog status breakdown (from SQL view). */
  async getBlogStatusBreakdown() {
    const supabase = createClient();
    const { data } = await supabase
      .from("view_blog_status_breakdown")
      .select("*");
    return (
      data?.map((d) => ({
        name: d.status,
        value: Number(d.total),
      })) ?? []
    );
  },

  /** Achievement status breakdown (from SQL view). */
  async getAchievementStatusBreakdown() {
    const supabase = createClient();
    const { data } = await supabase
      .from("view_achievement_status_breakdown")
      .select("*");
    return (
      data?.map((d) => ({
        name: d.status,
        value: Number(d.total),
      })) ?? []
    );
  },

  /** Content overview — total items per module (from SQL view). */
  async getContentOverview() {
    const supabase = createClient();
    const { data } = await supabase
      .from("view_content_overview")
      .select("*");
    return (
      data?.map((d) => ({
        module: d.module,
        total: Number(d.total),
        active: Number(d.active),
        inactive: Number(d.inactive),
      })) ?? []
    );
  },
};
