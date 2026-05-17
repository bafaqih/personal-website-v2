"use client";

import { useEffect, useState } from "react";
import { cn } from "@/src/app/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
  loading?: boolean;
}

/**
 * Dashboard statistics card with glassmorphism effect.
 * Displays a metric count with icon and label.
 */
export function StatCard({ title, value, icon: Icon, className, loading }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) {
      setDisplayValue(end);
      return;
    }

    // Animation duration in ms
    const duration = 1000;
    const increment = end / (duration / 16); // 16ms per frame (60fps)

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border border-neutral-200/60 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5",
        "dark:border-white/10 dark:bg-neutral-900/80 dark:hover:shadow-white/5",
        className
      )}
    >
      <CardContent className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              {title}
            </p>
            <div className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {loading ? (
                <Skeleton className="h-9 w-12 mt-1" />
              ) : (
                displayValue
              )}
            </div>
          </div>
          <div className="rounded-xl bg-neutral-100 p-2.5 transition-colors group-hover:bg-neutral-900 group-hover:text-white dark:bg-white/10 dark:group-hover:bg-white dark:group-hover:text-neutral-900">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
