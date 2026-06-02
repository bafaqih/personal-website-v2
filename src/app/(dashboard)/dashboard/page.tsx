"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Eye, Users, Download, Package,
  FolderKanban, FileText, LayoutDashboard,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { OverviewStatCard } from "@/components/dashboard/charts/overview-stat-card";
import { ViewsTrendChart } from "@/components/dashboard/charts/views-trend-chart";
import { TopItemsChart } from "@/components/dashboard/charts/top-items-chart";
import { LanguageRatioChart } from "@/components/dashboard/charts/language-ratio-chart";
import { TechStackChart } from "@/components/dashboard/charts/tech-stack-chart";
import { ContentStatusChart } from "@/components/dashboard/charts/content-status-chart";
import { ContentOverviewChart } from "@/components/dashboard/charts/content-overview-chart";
import { AnalyticsService } from "@/src/services/analytics.service";
import { StatisticsService } from "@/src/services/statistics.service";
import { useLanguage } from "@/context/language-context";

/**
 * Dashboard overview — analytics hub with stat cards, charts, and content metrics.
 */
export default function DashboardPage() {
  const { t } = useLanguage();

  // ─── Stat card queries ──────────────────────────────────────
  const { data: pageViews = 0, isLoading: l1 } = useQuery({
    queryKey: ["analytics", "pageViews"],
    queryFn: AnalyticsService.getPageViews,
    meta: { silent: true },
  });

  const { data: uniqueVisitors = 0, isLoading: l2 } = useQuery({
    queryKey: ["analytics", "uniqueVisitors"],
    queryFn: AnalyticsService.getUniqueVisitors,
    meta: { silent: true },
  });

  const { data: cvDownloads = 0, isLoading: l3 } = useQuery({
    queryKey: ["analytics", "cvDownloads"],
    queryFn: AnalyticsService.getCvDownloads,
    meta: { silent: true },
  });

  const { data: stats, isLoading: l4 } = useQuery({
    queryKey: ["statistics"],
    queryFn: StatisticsService.getAll,
    meta: { resource: "dashboard.title" },
  });

  const totalContent = stats
    ? stats.total_skills + stats.total_projects + stats.total_achievements +
      stats.total_careers + stats.total_educations + stats.total_organizations +
      stats.total_blogs
    : 0;

  // ─── Chart queries ──────────────────────────────────────────
  const { data: viewsTrend = [], isLoading: l5 } = useQuery({
    queryKey: ["analytics", "viewsTrend"],
    queryFn: () => AnalyticsService.getViewsTrend(30),
    meta: { silent: true },
  });

  const { data: topProjects = [], isLoading: l6 } = useQuery({
    queryKey: ["analytics", "topProjects"],
    queryFn: () => AnalyticsService.getTopProjects(5),
    meta: { silent: true },
  });

  const { data: topBlogs = [], isLoading: l7 } = useQuery({
    queryKey: ["analytics", "topBlogs"],
    queryFn: () => AnalyticsService.getTopBlogs(5),
    meta: { silent: true },
  });

  const { data: langRatio = [], isLoading: l8 } = useQuery({
    queryKey: ["analytics", "languageRatio"],
    queryFn: AnalyticsService.getLanguageRatio,
    meta: { silent: true },
  });

  const { data: techStack = [], isLoading: l9 } = useQuery({
    queryKey: ["analytics", "techStack"],
    queryFn: AnalyticsService.getTechStackDistribution,
    meta: { silent: true },
  });

  const { data: projectStatus = [], isLoading: l10 } = useQuery({
    queryKey: ["analytics", "projectStatus"],
    queryFn: AnalyticsService.getProjectStatusBreakdown,
    meta: { silent: true },
  });

  const { data: blogStatus = [], isLoading: l11 } = useQuery({
    queryKey: ["analytics", "blogStatus"],
    queryFn: AnalyticsService.getBlogStatusBreakdown,
    meta: { silent: true },
  });

  const { data: achievementStatus = [], isLoading: l12 } = useQuery({
    queryKey: ["analytics", "achievementStatus"],
    queryFn: AnalyticsService.getAchievementStatusBreakdown,
    meta: { silent: true },
  });

  const { data: contentOverview = [], isLoading: l13 } = useQuery({
    queryKey: ["analytics", "contentOverview"],
    queryFn: AnalyticsService.getContentOverview,
    meta: { silent: true },
  });

  const noData = t("dashboard.no_data_yet");

  return (
    <>
      <PageHeader
        title={t("dashboard.title")}
        description={t("dashboard.description")}
        icon={LayoutDashboard}
      />

      {/* ─── Row 1: Overview Stat Cards ─────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <OverviewStatCard
          title={t("dashboard.page_views")}
          value={pageViews}
          icon={Eye}
          loading={l1}
        />
        <OverviewStatCard
          title={t("dashboard.unique_visitors")}
          value={uniqueVisitors}
          icon={Users}
          loading={l2}
        />
        <OverviewStatCard
          title={t("dashboard.cv_downloads")}
          value={cvDownloads}
          icon={Download}
          loading={l3}
        />
        <OverviewStatCard
          title={t("dashboard.total_content")}
          value={totalContent}
          icon={Package}
          loading={l4}
        />
      </div>

      {/* ─── Row 2: Views Trend (full width) ────────────────── */}
      <div className="mb-6">
        <ViewsTrendChart
          data={viewsTrend}
          loading={l5}
          title={t("dashboard.views_trend")}
          noDataLabel={noData}
        />
      </div>

      {/* ─── Row 3: Top Projects + Top Blogs ────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <TopItemsChart
          data={topProjects}
          loading={l6}
          title={t("dashboard.top_projects")}
          noDataLabel={noData}
          icon={FolderKanban}
        />
        <TopItemsChart
          data={topBlogs}
          loading={l7}
          title={t("dashboard.top_blogs")}
          noDataLabel={noData}
          icon={FileText}
        />
      </div>

      {/* ─── Row 4: Language Ratio + Tech Stack ─────────────── */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <LanguageRatioChart
          data={langRatio}
          loading={l8}
          title={t("dashboard.language_ratio")}
          noDataLabel={noData}
        />
        <TechStackChart
          data={techStack}
          loading={l9}
          title={t("dashboard.tech_stack")}
          noDataLabel={noData}
        />
      </div>

      {/* ─── Row 5: Content Status (Draft vs Published) ─────── */}
      <div className="mb-6">
        <ContentStatusChart
          projectData={projectStatus}
          blogData={blogStatus}
          achievementData={achievementStatus}
          loading={l10 || l11 || l12}
          title={t("dashboard.content_status")}
          noDataLabel={noData}
        />
      </div>

      {/* ─── Row 6: Content Overview ────────────────────────── */}
      <div className="mb-6">
        <ContentOverviewChart
          data={contentOverview}
          loading={l13}
          title={t("dashboard.content_overview")}
          noDataLabel={noData}
        />
      </div>
    </>
  );
}
