"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { GitCompareArrows } from "lucide-react";

interface ContentStatusChartProps {
  projectData: { name: string; value: number }[];
  blogData: { name: string; value: number }[];
  achievementData: { name: string; value: number }[];
  loading: boolean;
  title: string;
  noDataLabel?: string;
}

export function ContentStatusChart({
  projectData, blogData, achievementData, loading, title,
  noDataLabel = "No data yet",
}: ContentStatusChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const textColor = isDark ? "#a3a3a3" : "#737373";

  const chartData = [
    {
      module: "Projects",
      Published: projectData.find((d) => d.name === "Published")?.value ?? 0,
      Draft: projectData.find((d) => d.name === "Draft")?.value ?? 0,
    },
    {
      module: "Blogs",
      Published: blogData.find((d) => d.name === "Published")?.value ?? 0,
      Draft: blogData.find((d) => d.name === "Draft")?.value ?? 0,
    },
    {
      module: "Achievements",
      Published: achievementData.find((d) => d.name === "Published")?.value ?? 0,
      Draft: achievementData.find((d) => d.name === "Draft")?.value ?? 0,
    },
  ];

  const hasData = chartData.some((d) => d.Published > 0 || d.Draft > 0);

  if (loading) return <Skeleton className="h-[350px] w-full rounded-xl" />;

  return (
    <Card className="border border-neutral-200/60 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-neutral-900/80">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <GitCompareArrows className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          <CardTitle className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex h-[260px] items-center justify-center text-sm text-neutral-400 dark:text-neutral-500">
            {noDataLabel}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="module" fontSize={12} tickLine={false} axisLine={false} stroke={textColor} />
              <YAxis fontSize={11} tickLine={false} axisLine={false} stroke={textColor} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: isDark ? "#262626" : "#ffffff",
                  border: `1px solid ${isDark ? "#404040" : "#e5e5e5"}`,
                  borderRadius: "8px", fontSize: "12px",
                  color: isDark ? "#e5e5e5" : "#171717",
                }}
                cursor={{ fill: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)" }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", color: textColor }} iconType="circle" iconSize={8} />
              <Bar dataKey="Published" fill={isDark ? "#e5e5e5" : "#171717"} radius={[4, 4, 0, 0]} maxBarSize={36} />
              <Bar dataKey="Draft" fill={isDark ? "#525252" : "#a3a3a3"} radius={[4, 4, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
