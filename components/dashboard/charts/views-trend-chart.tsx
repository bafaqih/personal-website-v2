"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface ViewsTrendChartProps {
  data: { date: string; views: number }[];
  loading: boolean;
  title: string;
  noDataLabel?: string;
}

/**
 * Area chart showing page view trends over the last 30 days.
 * Adapts gradient and stroke colors to dark/light mode.
 */
export function ViewsTrendChart({
  data,
  loading,
  title,
  noDataLabel = "No data yet",
}: ViewsTrendChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const strokeColor = isDark ? "#e5e5e5" : "#171717";
  const gridColor = isDark ? "#333333" : "#e5e5e5";
  const textColor = isDark ? "#a3a3a3" : "#737373";

  if (loading) {
    return <Skeleton className="h-[350px] w-full rounded-xl" />;
  }

  return (
    <Card className="border border-neutral-200/60 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-neutral-900/80">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          <CardTitle className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[280px] items-center justify-center text-sm text-neutral-400 dark:text-neutral-500">
            {noDataLabel}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={strokeColor}
                    stopOpacity={0.15}
                  />
                  <stop
                    offset="95%"
                    stopColor={strokeColor}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={gridColor}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                stroke={textColor}
                tickFormatter={(val) => {
                  const d = new Date(val);
                  return `${d.getDate()}/${d.getMonth() + 1}`;
                }}
              />
              <YAxis
                fontSize={11}
                tickLine={false}
                axisLine={false}
                stroke={textColor}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: isDark ? "#262626" : "#ffffff",
                  border: `1px solid ${isDark ? "#404040" : "#e5e5e5"}`,
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: isDark ? "#e5e5e5" : "#171717",
                }}
                labelFormatter={(val) => {
                  const d = new Date(val);
                  return d.toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });
                }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke={strokeColor}
                fill="url(#viewsGradient)"
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: strokeColor,
                  stroke: isDark ? "#171717" : "#ffffff",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
