"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Code2, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { DeleteDialog } from "@/components/dashboard/delete-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SkillService } from "@/src/services/skill.service";
import type { Skill } from "@/src/types/database";
import { useLanguage } from "@/context/language-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function SkillsListPage() {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { data: skills = [], isLoading, isError } = useQuery({
    queryKey: ["skills"],
    queryFn: SkillService.getAll,
    meta: { resource: "sidebar.Skills" },
  });

  const loading = isLoading;

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await SkillService.delete(deleteId);
      toast.success(t("skills.deleted_success"));
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    } catch {
      toast.error(t("skills.deleted_failed"));
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const columns: Column<Skill>[] = [
    {
      key: "icon_url",
      header: t("skills.icon"),
      searchable: false,
      className: "w-[60px]",
      render: (skill) =>
        skill.icon_url ? (
          <Image
            src={skill.icon_url}
            alt={skill.name}
            width={28}
            height={28}
            className="rounded object-contain brightness-0 dark:invert"
            unoptimized
          />
        ) : (
          <div className="h-7 w-7 rounded bg-neutral-100 dark:bg-white/10" />
        ),
    },
    { key: "name", header: t("skills.name") },
    {
      key: "category_id",
      header: t("skills.category"),
      render: (skill) => (
        <Badge variant="secondary">
          {(skill.category?.[`name_${language}` as keyof typeof skill.category] as string) || "-"}
        </Badge>
      ),
    },
    {
      key: "is_active",
      header: t("skills.status"),
      render: (skill) => (
        <Badge variant={skill.is_active ? "default" : "secondary"}>
          {skill.is_active ? t("skills.active") : t("skills.inactive")}
        </Badge>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title={t("skills.title")}
        icon={Code2}
        description={t("skills.description")}
        breadcrumbs={[
          { label: t("dashboard.title"), href: "/dashboard" },
          { label: t("skills.title") },
          { label: t("sidebar.List") },
        ]}
        actions={
          <Link href="/dashboard/skills/add">
            <Button className="bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:active:bg-neutral-200 dark:text-neutral-900 gap-1.5">
              <Plus className="h-4 w-4" /> {t("skills.add_skill")}
            </Button>
          </Link>
        }
      />

      <DataTable
        data={skills}
        columns={columns}
        loading={loading}
        error={isError}
        searchPlaceholder={t("skills.search_placeholder")}
        filters={[
          {
            key: "is_active",
            label: t("skills.status"),
            options: [
              { label: t("skills.active"), value: true },
              { label: t("skills.inactive"), value: false },
            ],
          },
          {
            key: "category_id",
            label: t("skills.category"),
            getLabel: (item) => (item.category?.[`name_${language}` as keyof typeof item.category] as string) || "-",
          },
        ]}
        actions={(skill) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 data-[state=open]:bg-neutral-100 dark:data-[state=open]:bg-white/10">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href={`/dashboard/skills/${skill.id}/edit`}>
                <DropdownMenuItem className="cursor-pointer">
                  <Pencil className="mr-2 h-4 w-4" />
                  {t("common.edit")}
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem 
                variant="destructive"
                className="cursor-pointer"
                onClick={() => setDeleteId(skill.id)}
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
        itemName={t("skills.title").toLowerCase()} 
      />
    </>
  );
}
