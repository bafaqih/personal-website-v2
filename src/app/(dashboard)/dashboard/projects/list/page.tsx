"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, FolderKanban, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { DeleteDialog } from "@/components/dashboard/delete-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProjectService } from "@/src/services/project.service";
import type { Project, ProjectType, ProjectCategory } from "@/src/types/database";
import { useLanguage } from "@/context/language-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function ProjectsListPage() {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { data: items = [], isLoading, isError } = useQuery({
    queryKey: ["projects"],
    queryFn: ProjectService.getAll,
    meta: { resource: "sidebar.Projects" },
  });

  const loading = isLoading;

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await ProjectService.delete(deleteId);
      toast.success(t("projects.deleted_success"));
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    } catch {
      toast.error(t("projects.deleted_failed"));
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const columns: Column<Project>[] = [
    { 
      key: `title_${language}`, 
      header: t("projects.form_title"),
      render: (p) => <span>{(p[`title_${language}` as keyof Project] as string) || "-"}</span>
    },
    {
      key: "project_date",
      header: t("projects.form_date"),
      render: (p) => (
        <span className="text-sm">
          {p.project_date ? new Date(p.project_date).toLocaleDateString(language === "en" ? "en-GB" : "id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-"}
        </span>
      )
    },
    {
      key: "type_id",
      header: t("projects.type"),
      render: (p) => (
        <Badge variant="secondary">{(p.type?.[`name_${language}` as keyof ProjectType] as string) || "-"}</Badge>
      )
    },
    {
      key: "category_id",
      header: t("projects.category"),
      render: (p) => (
        <Badge variant="secondary">{(p.category?.[`name_${language}` as keyof ProjectCategory] as string) || "-"}</Badge>
      )
    },
    {
      key: "is_published",
      header: t("projects.status"),
      render: (p) => (
        <Badge variant={p.is_published ? "default" : "secondary"}>
          {p.is_published ? t("common.published") : t("common.draft")}
        </Badge>
      )
    },
  ];

  return (
    <>
      <PageHeader
        title={t("projects.title")}
        icon={FolderKanban}
        description={t("projects.description")}
        breadcrumbs={[
          { label: t("dashboard.title"), href: "/dashboard" },
          { label: t("projects.title") },
          { label: t("common.all") },
        ]}
        actions={
          <Link href="/dashboard/projects/add">
            <Button className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 gap-1.5 cursor-pointer">
              <Plus className="h-4 w-4" /> {t("projects.add_project")}
            </Button>
          </Link>
        }
      />

      <DataTable
        data={items}
        columns={columns}
        loading={loading}
        error={isError}
        searchPlaceholder={t("projects.search_placeholder")}
        filters={[
          {
            key: "is_published",
            label: t("projects.status"),
            options: [
              { label: t("common.published"), value: true },
              { label: t("common.draft"), value: false },
            ],
          },
          {
            key: "type_id",
            label: t("projects.type"),
            getLabel: (item) => (item.type?.[`name_${language}` as keyof ProjectType] as string) || "-",
          },
          {
            key: "category_id",
            label: t("projects.category"),
            getLabel: (item) => (item.category?.[`name_${language}` as keyof ProjectCategory] as string) || "-",
          },
        ]}
        actions={(p) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 data-[state=open]:bg-neutral-100 dark:data-[state=open]:bg-white/10">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href={`/dashboard/projects/${p.id}/edit`}>
                <DropdownMenuItem className="cursor-pointer">
                  <Pencil className="mr-2 h-4 w-4" />
                  {t("common.edit")}
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem 
                variant="destructive"
                className="cursor-pointer"
                onClick={() => setDeleteId(p.id)}
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
        itemName={language === "en" ? "project" : "proyek"}
      />
    </>
  );
}
