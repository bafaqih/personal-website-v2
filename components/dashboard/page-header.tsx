"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}

/**
 * Reusable page header with title, optional description,
 * breadcrumb navigation, and action buttons.
 */
export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  icon: Icon,
}: PageHeaderProps) {
  return (
    <div className="mb-8 space-y-2">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center space-x-1 text-sm text-neutral-500 dark:text-neutral-400">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.label} className="flex items-center">
              {index > 0 && <ChevronRight className="mx-1 h-3.5 w-3.5" />}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="transition-colors hover:text-neutral-900 dark:hover:text-white"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-neutral-900 dark:text-white">
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </nav>
      )}

      {/* Title & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-neutral-900 dark:text-white">
            {Icon && <Icon className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />}
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
