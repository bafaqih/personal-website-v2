"use client";

import { useEffect, useState } from "react";
import {
  Code2,
  FolderKanban,
  Trophy,
  Briefcase,
  GraduationCap,
  Users,
  FileText,
  LayoutDashboard,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatisticsService } from "@/src/services/statistics.service";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/context/language-context";

import { useQuery } from "@tanstack/react-query";

/**
 * Dashboard overview — displays stat cards with entity counts.
 */
export default function DashboardPage() {
  const { t } = useLanguage();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["statistics"],
    queryFn: StatisticsService.getAll,
    meta: { resource: "dashboard.title" },
  });

  const loading = isLoading;

  const cards = [
    { title: "Skills", key: "total_skills", icon: Code2 },
    { title: "Projects", key: "total_projects", icon: FolderKanban },
    { title: "Achievements", key: "total_achievements", icon: Trophy },
    { title: "Careers", key: "total_careers", icon: Briefcase },
    { title: "Educations", key: "total_educations", icon: GraduationCap },
    { title: "Organizations", key: "total_organizations", icon: Users },
    { title: "Blogs", key: "total_blogs", icon: FileText },
  ];

  return (
    <>
      <PageHeader
        title={t("dashboard.title")}
        description={t("dashboard.description")}
        icon={LayoutDashboard}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((card) => (
          <StatCard
            key={card.key}
            title={t(`sidebar.${card.title}`)}
            value={(stats as any)?.[card.key] ?? 0}
            icon={card.icon}
            loading={loading}
          />
        ))}
      </div>
    </>
  );
}
