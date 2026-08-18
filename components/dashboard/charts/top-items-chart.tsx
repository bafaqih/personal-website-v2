"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Trophy } from "lucide-react";

interface TopItemsChartProps {
  data: { name: string; clicks: number }[];
  loading: boolean;
  title: string;
  noDataLabel?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

/**
 * Horizontal bar chart for top-clicked projects or blogs.
 * Shows up to 5 items sorted by click count.
 */
export function TopItemsChart({
  data,
  loading,
  title,
  noDataLabel = "No data yet",
  icon: IconComp = Trophy,
}: TopItemsChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const textColor = isDark ? "#a3a3a3" : "#737373";
  const barColors = isDark
    ? ["#e5e5e5", "#d4d4d4", "#a3a3a3", "#737373", "#525252"]
    : ["#171717", "#262626", "#404040", "#525252", "#737373"];

  if (loading) {
    return <Skeleton className="h-[300px] w-full rounded-xl" />;
  }

  return (
    <Card className="border-neutral-200/60 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-neutral-900/80">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <IconComp className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          <CardTitle className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[220px] items-center justify-center text-sm text-neutral-400 dark:text-neutral-500">
            {noDataLabel}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
            >
              <XAxis
                type="number"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                stroke={textColor}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                stroke={textColor}
                width={100}
                tickFormatter={(val) =>
                  val.length > 14 ? val.slice(0, 14) + "…" : val
                }
              />
              <Tooltip
                contentStyle={{
                  background: isDark ? "#262626" : "#ffffff",
                  border: `1px solid ${isDark ? "#404040" : "#e5e5e5"}`,
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: isDark ? "#e5e5e5" : "#171717",
                }}
                cursor={{ fill: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)" }}
              />
              <Bar dataKey="clicks" radius={[0, 4, 4, 0]} maxBarSize={28}>
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={barColors[index % barColors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
