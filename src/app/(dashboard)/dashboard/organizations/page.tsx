"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Users, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { DeleteDialog } from "@/components/dashboard/delete-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrganizationService } from "@/src/services/organization.service";
import type { Organization } from "@/src/types/database";
import { useLanguage } from "@/context/language-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function OrganizationsPage() {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { data: items = [], isLoading, isError } = useQuery({
    queryKey: ["organizations"],
    queryFn: OrganizationService.getAll,
    meta: { resource: "sidebar.Organizations" },
  });

  const loading = isLoading;

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await OrganizationService.delete(deleteId);
      toast.success(t("organizations.deleted_success"));
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    } catch {
      toast.error(t("organizations.deleted_failed"));
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const columns: Column<Organization>[] = [
    { key: "organization", header: t("organizations.organization"), className: "font-medium" },
    { 
      key: `role_${language}`, 
      header: t("organizations.role"),
      render: (o) => <span>{(o[`role_${language}` as keyof Organization] as string) || "-"}</span>
    },
    { 
      key: "start_date", 
      header: t("organizations.period"), 
      render: (o) => {
        const formatDate = (dateStr: string) => 
          new Date(dateStr).toLocaleDateString(language === "en" ? "en-GB" : "id-ID", { day: "2-digit", month: "short", year: "numeric" });
          
        const isPresent = !o.end_date || new Date(o.end_date) > new Date();
        const start = formatDate(o.start_date);
        const end = isPresent ? t("careers.present") : formatDate(o.end_date as string);
        
        return <span className="text-sm">{start} - {end}</span>;
      } 
    },
    { 
      key: "is_published", 
      header: t("organizations.status"), 
      render: (o) => (
        <Badge variant={o.is_published ? "default" : "secondary"}>
          {o.is_published ? t("common.published") : t("common.draft")}
        </Badge>
      ) 
    },
  ];

  return (
    <>
      <PageHeader 
        title={t("organizations.title")} 
        icon={Users} 
        description={t("organizations.description")} 
        breadcrumbs={[
          { label: t("dashboard.title"), href: "/dashboard" }, 
          { label: t("organizations.title") }
        ]}
        actions={
          <Link href="/dashboard/organizations/add">
            <Button className="bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:active:bg-neutral-200 dark:text-neutral-900 gap-1.5 cursor-pointer">
              <Plus className="h-4 w-4" /> {t("organizations.add_organization")}
            </Button>
          </Link>
        } 
      />
      <DataTable 
        data={items} 
        columns={columns} 
        loading={loading} 
        error={isError}
        searchPlaceholder={t("organizations.search_placeholder")}
        filters={[
          {
            key: "is_published",
            label: t("organizations.status"),
            options: [
              { label: t("common.published"), value: true },
              { label: t("common.draft"), value: false },
            ],
          },
        ]}
        actions={(o) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 data-[state=open]:bg-neutral-100 dark:data-[state=open]:bg-white/10">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href={`/dashboard/organizations/${o.id}/edit`}>
                <DropdownMenuItem className="cursor-pointer">
                  <Pencil className="mr-2 h-4 w-4" />
                  {t("common.edit")}
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem 
                variant="destructive"
                className="cursor-pointer"
                onClick={() => setDeleteId(o.id)}
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
        itemName={language === "en" ? "organization" : "organisasi"} 
      />
    </>
  );
}
