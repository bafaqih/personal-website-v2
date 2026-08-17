"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Briefcase, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { DeleteDialog } from "@/components/dashboard/delete-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CareerService } from "@/src/services/career.service";
import type { Career } from "@/src/types/database";
import { useLanguage } from "@/context/language-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function CareersPage() {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { data: careers = [], isLoading, isError } = useQuery({
    queryKey: ["careers"],
    queryFn: CareerService.getAll,
    meta: { resource: "sidebar.Careers" },
  });

  const loading = isLoading;

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await CareerService.delete(deleteId);
      toast.success(t("careers.deleted_success"));
      queryClient.invalidateQueries({ queryKey: ["careers"] });
    } catch {
      toast.error(t("careers.deleted_failed"));
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const columns: Column<Career>[] = [
    { key: "company", header: t("careers.company"), className: "font-medium" },
    { 
      key: `role_${language}`, 
      header: t("careers.role") 
    },
    { 
      key: `type_${language}`, 
      header: t("careers.type"), 
      render: (c) => <Badge variant="secondary">{(c[`type_${language}` as keyof Career] as string) || "-"}</Badge> 
    },
    { 
      key: "start_date", 
      header: t("careers.period"), 
      render: (c) => {
        const formatDate = (dateStr: string) => 
          new Date(dateStr).toLocaleDateString(language === "en" ? "en-GB" : "id-ID", { day: "2-digit", month: "short", year: "numeric" });
          
        const isPresent = !c.end_date || new Date(c.end_date) > new Date();
        const start = formatDate(c.start_date);
        const end = isPresent ? t("careers.present") : formatDate(c.end_date as string);
        
        return <span className="text-sm">{start} - {end}</span>;
      } 
    },
    { 
      key: "is_published", 
      header: t("careers.status"), 
      render: (c) => (
        <Badge variant={c.is_published ? "default" : "secondary"}>
          {c.is_published ? t("common.published") : t("common.draft")}
        </Badge>
      ) 
    },
  ];

  return (
    <>
      <PageHeader 
        title={t("careers.title")} 
        icon={Briefcase} 
        description={t("careers.description")} 
        breadcrumbs={[
          { label: t("dashboard.title"), href: "/dashboard" }, 
          { label: t("careers.title") }
        ]}
        actions={
          <Link href="/dashboard/careers/add">
            <Button className="bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:active:bg-neutral-200 dark:text-neutral-900 gap-1.5">
              <Plus className="h-4 w-4" /> {t("careers.add_career")}
            </Button>
          </Link>
        } 
      />
      <DataTable 
        data={careers} 
        columns={columns} 
        loading={loading} 
        error={isError}
        searchPlaceholder={t("careers.search_placeholder")}
        filters={[
          {
            key: "is_published",
            label: t("careers.status"),
            options: [
              { label: t("common.published"), value: true },
              { label: t("common.draft"), value: false },
            ],
          },
          {
            key: `type_${language}`,
            label: t("careers.type"),
            getLabel: (item) => (item[`type_${language}` as keyof Career] as string) || "-",
          },
          {
            key: `model_${language}`,
            label: t("careers.model"),
            getLabel: (item) => (item[`model_${language}` as keyof Career] as string) || "-",
          },
        ]}
        actions={(c) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 data-[state=open]:bg-neutral-100 dark:data-[state=open]:bg-white/10">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href={`/dashboard/careers/${c.id}/edit`}>
                <DropdownMenuItem className="cursor-pointer">
                  <Pencil className="mr-2 h-4 w-4" />
                  {t("common.edit")}
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem 
                variant="destructive"
                className="cursor-pointer"
                onClick={() => setDeleteId(c.id)}
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
        itemName="career" 
      />
    </>
  );
}
