"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { LayoutGrid } from "lucide-react";

interface ContentOverviewChartProps {
  data: { module: string; total: number; active: number; inactive: number }[];
  loading: boolean;
  title: string;
  noDataLabel?: string;
}

export function ContentOverviewChart({ data, loading, title, noDataLabel = "No data yet" }: ContentOverviewChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const textColor = isDark ? "#a3a3a3" : "#737373";
  const barColor = isDark ? "#d4d4d4" : "#262626";

  if (loading) return <Skeleton className="h-[350px] w-full rounded-xl" />;

  const chartData = data.map((d) => ({
    name: d.module.charAt(0).toUpperCase() + d.module.slice(1),
    total: d.total,
  }));

  return (
    <Card className="border border-neutral-200/60 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-neutral-900/80">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          <CardTitle className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex h-[260px] items-center justify-center text-sm text-neutral-400 dark:text-neutral-500">
            {noDataLabel}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} stroke={textColor} />
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
              <Bar dataKey="total" radius={[4, 4, 0, 0]} maxBarSize={36}>
                {chartData.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={barColor} fillOpacity={1 - i * 0.08} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
