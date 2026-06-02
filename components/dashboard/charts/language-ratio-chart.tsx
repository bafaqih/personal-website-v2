"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Globe } from "lucide-react";

interface LanguageRatioChartProps {
  data: { name: string; value: number }[];
  loading: boolean;
  title: string;
  noDataLabel?: string;
}

/**
 * Donut chart showing language preference ratio (ID vs EN).
 * Features center label with total count and animated segments.
 */
export function LanguageRatioChart({
  data,
  loading,
  title,
  noDataLabel = "No data yet",
}: LanguageRatioChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const colors = isDark
    ? ["#e5e5e5", "#525252"]
    : ["#171717", "#a3a3a3"];

  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (loading) {
    return <Skeleton className="h-[300px] w-full rounded-xl" />;
  }

  return (
    <Card className="border border-neutral-200/60 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-neutral-900/80">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          <CardTitle className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <div className="flex h-[220px] items-center justify-center text-sm text-neutral-400 dark:text-neutral-500">
            {noDataLabel}
          </div>
        ) : (
          <div className="relative">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: isDark ? "#262626" : "#ffffff",
                    border: `1px solid ${isDark ? "#404040" : "#e5e5e5"}`,
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: isDark ? "#e5e5e5" : "#171717",
                  }}
                  formatter={(value: any, name: any) => [
                    `${value} (${total > 0 ? Math.round((Number(value) / total) * 100) : 0}%)`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {total}
                </div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Total
                </div>
              </div>
            </div>
            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-2">
              {data.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span className="text-xs text-neutral-600 dark:text-neutral-400">
                    {entry.name}{" "}
                    <span className="font-medium text-neutral-900 dark:text-white">
                      {entry.value}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
