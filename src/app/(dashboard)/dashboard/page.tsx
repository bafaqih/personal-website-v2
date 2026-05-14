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

/**
 * Dashboard overview — displays stat cards with entity counts.
 */
export default function DashboardPage() {
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    StatisticsService.getAll()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
        title="Dashboard"
        description="Overview of your website content."
        icon={LayoutDashboard}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-[104px] rounded-xl" />
            ))
          : cards.map((card) => (
              <StatCard
                key={card.key}
                title={card.title}
                value={stats?.[card.key] ?? 0}
                icon={card.icon}
              />
            ))}
      </div>
    </>
  );
}
