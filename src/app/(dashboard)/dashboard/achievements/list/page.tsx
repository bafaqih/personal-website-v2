"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Trophy, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { DeleteDialog } from "@/components/dashboard/delete-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AchievementService } from "@/src/services/achievement.service";
import type { Achievement } from "@/src/types/database";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/context/language-context";

import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function AchievementsListPage() {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { data: items = [], isLoading, isError } = useQuery({
    queryKey: ["achievements"],
    queryFn: AchievementService.getAll,
    meta: { resource: "sidebar.Achievements" },
  });

  const loading = isLoading;

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await AchievementService.delete(deleteId);
      toast.success(t("achievements.deleted_success"));
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
    } catch {
      toast.error(t("achievements.deleted_failed"));
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const columns: Column<Achievement>[] = [
    { 
      key: language === "en" ? "title_en" : "title_id", 
      header: language === "en" ? "Title" : "Judul",
      className: "font-medium",
      render: (a) => (
        <span>
          {language === "en" ? a.title_en : a.title_id}
        </span>
      )
    },
    { 
      key: "publisher", 
      header: t("achievements.publisher") 
    },
    { 
      key: "type_id", 
      header: t("projects.type"), 
      render: (a) => <Badge variant="secondary">{a.type?.[language === "en" ? "name_en" : "name_id"] || "-"}</Badge> 
    },
    { 
      key: "issue_date", 
      header: language === "en" ? "Date" : "Tanggal", 
      render: (a) => (
        <span className="text-sm">
          {a.issue_date ? new Date(a.issue_date).toLocaleDateString(language === "en" ? "en-GB" : "id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-"}
        </span>
      ) 
    },
    { 
      key: "is_published", 
      header: t("common.status"), 
      render: (a) => (
        <Badge variant={a.is_published ? "default" : "secondary"}>
          {a.is_published ? t("common.published") : t("common.draft")}
        </Badge>
      ) 
    },
  ];

  return (
    <>
      <PageHeader 
        title={t("achievements.title")} 
        icon={Trophy}
        description={t("achievements.description")} 
        breadcrumbs={[
          { label: t("dashboard.title"), href: "/dashboard" }, 
          { label: t("achievements.title") }, 
          { label: t("sidebar.List") }
        ]}
        actions={
          <Link href="/dashboard/achievements/add">
            <Button className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 gap-1.5 cursor-pointer">
              <Plus className="h-4 w-4" /> {t("achievements.add_achievement")}
            </Button>
          </Link>
        } 
      />

      <DataTable 
        data={items} 
        columns={columns} 
        loading={loading}
        error={isError}
        searchPlaceholder={t("achievements.search_placeholder")}
        emptyMessage={loading ? t("common.loading") : t("common.no_data")}
        filters={[
          {
            key: "is_published",
            label: t("common.status"),
            options: [
              { label: t("common.published"), value: true },
              { label: t("common.draft"), value: false },
            ],
          },
          {
            key: "type_id",
            label: t("projects.type"),
            getLabel: (item) => item.type?.[language === "en" ? "name_en" : "name_id"] || "-",
          },
          {
            key: "category_id",
            label: t("projects.category"),
            getLabel: (item) => item.category?.[language === "en" ? "name_en" : "name_id"] || "-",
          },
        ]}
        actions={(a) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 data-[state=open]:bg-neutral-100 dark:data-[state=open]:bg-white/10">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href={`/dashboard/achievements/${a.id}/edit`}>
                <DropdownMenuItem className="cursor-pointer">
                  <Pencil className="mr-2 h-4 w-4" />
                  {t("common.edit")}
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem 
                variant="destructive"
                className="cursor-pointer"
                onClick={() => setDeleteId(a.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t("common.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )} 
      />

      <DeleteDialog 
        open={!!deleteId} 
        onOpenChange={() => setDeleteId(null)} 
        onConfirm={handleDelete} 
        loading={deleting} 
        itemName={language === "en" ? "achievement" : "pencapaian"}
      />
    </>
  );
}
