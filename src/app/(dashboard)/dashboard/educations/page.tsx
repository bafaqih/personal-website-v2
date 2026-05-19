"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, GraduationCap, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { DeleteDialog } from "@/components/dashboard/delete-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EducationService } from "@/src/services/education.service";
import type { Education } from "@/src/types/database";
import { useLanguage } from "@/context/language-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function EducationsPage() {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { data: items = [], isLoading, isError } = useQuery({
    queryKey: ["educations"],
    queryFn: EducationService.getAll,
    meta: { resource: "sidebar.Educations" },
  });

  const loading = isLoading;

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await EducationService.delete(deleteId);
      toast.success(t("common.success"));
      queryClient.invalidateQueries({ queryKey: ["educations"] });
    } catch {
      toast.error(t("common.failed"));
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const columns: Column<Education>[] = [
    { key: "school", header: t("educations.school"), className: "font-medium" },
    { 
      key: `level_major_${language}`, 
      header: t("educations.level_major"),
      render: (e) => <span>{(e[`level_major_${language}` as keyof Education] as string) || "-"}</span>
    },
    { key: "gpa", header: t("educations.gpa"), render: (e) => <span>{e.gpa ? `${Number(e.gpa).toFixed(2)}/${e.max_gpa ? Number(e.max_gpa).toFixed(2) : "4.00"}` : "-"}</span> },
    { 
      key: "start_date", 
      header: t("educations.period"), 
      render: (e) => {
        const formatDate = (dateStr: string) => 
          new Date(dateStr).toLocaleDateString(language === "en" ? "en-GB" : "id-ID", { day: "2-digit", month: "short", year: "numeric" });
          
        const isPresent = !e.end_date || new Date(e.end_date) > new Date();
        const start = formatDate(e.start_date);
        const end = isPresent ? t("educations.present") : formatDate(e.end_date as string);
        
        return <span className="text-sm">{start} - {end}</span>;
      } 
    },
    { 
      key: "is_published", 
      header: t("educations.status"), 
      render: (e) => (
        <Badge variant={e.is_published ? "default" : "secondary"}>
          {e.is_published ? t("common.published") : t("common.draft")}
        </Badge>
      ) 
    },
  ];

  return (
    <>
      <PageHeader 
        title={t("educations.title")} 
        icon={GraduationCap} 
        description={t("educations.description")} 
        breadcrumbs={[
          { label: t("dashboard.title"), href: "/dashboard" }, 
          { label: t("educations.title") }
        ]}
        actions={
          <Link href="/dashboard/educations/add">
            <Button className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 gap-1.5 cursor-pointer">
              <Plus className="h-4 w-4" /> {t("educations.add_education")}
            </Button>
          </Link>
        } 
      />
      <DataTable 
        data={items} 
        columns={columns} 
        loading={loading} 
        error={isError}
        searchPlaceholder={t("educations.search_placeholder")}
        filters={[
          {
            key: "is_published",
            label: t("educations.status"),
            options: [
              { label: t("common.published"), value: true },
              { label: t("common.draft"), value: false },
            ],
          },
        ]}
        actions={(e) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 data-[state=open]:bg-neutral-100 dark:data-[state=open]:bg-white/10">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href={`/dashboard/educations/${e.id}/edit`}>
                <DropdownMenuItem className="cursor-pointer">
                  <Pencil className="mr-2 h-4 w-4" />
                  {t("common.edit")}
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem 
                variant="destructive"
                className="cursor-pointer"
                onClick={() => setDeleteId(e.id)}
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
        itemName={language === "en" ? "education" : "pendidikan"} 
      />
    </>
  );
}
