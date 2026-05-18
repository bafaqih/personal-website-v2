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
import type { Project } from "@/src/types/database";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProjectsListPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = () => {
    setLoading(true);
    ProjectService.getAll()
      .then(setItems)
      .catch(() => toast.error("Failed to load projects"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await ProjectService.delete(deleteId);
      toast.success("Project deleted successfully");
      fetchData();
    } catch {
      toast.error("Failed to delete project");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const columns: Column<Project>[] = [
    { 
      key: "title_en", 
      header: "Title" 
    },
    {
      key: "project_date",
      header: "Date",
      render: (p) => (
        <span className="text-sm">
          {p.project_date ? new Date(p.project_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-"}
        </span>
      )
    },
    {
      key: "type_id",
      header: "Type",
      render: (p) => (
        <Badge variant="secondary">{p.type?.name_en || "-"}</Badge>
      )
    },
    {
      key: "category_id",
      header: "Category",
      render: (p) => (
        <Badge variant="secondary">{p.category?.name_en || "-"}</Badge>
      )
    },
    {
      key: "is_published",
      header: "Status",
      render: (p) => (
        <Badge variant={p.is_published ? "default" : "secondary"}>
          {p.is_published ? "Published" : "Draft"}
        </Badge>
      )
    },
  ];

  return (
    <>
      <PageHeader
        title="Projects"
        icon={FolderKanban}
        description="Manage your portfolio and showcase your work."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Projects" },
          { label: "List" },
        ]}
        actions={
          <Link href="/dashboard/projects/add">
            <Button className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 gap-1.5">
              <Plus className="h-4 w-4" /> Add Project
            </Button>
          </Link>
        }
      />

      <DataTable
        data={items}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search projects..."
        filters={[
          {
            key: "is_published",
            label: "Status",
            options: [
              { label: "Published", value: true },
              { label: "Draft", value: false },
            ],
          },
          {
            key: "type_id",
            label: "Type",
            getLabel: (item) => item.type?.name_en || "-",
          },
          {
            key: "category_id",
            label: "Category",
            getLabel: (item) => item.category?.name_en || "-",
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
                  Edit
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem 
                variant="destructive"
                className="cursor-pointer"
                onClick={() => setDeleteId(p.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
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
        itemName="project"
      />
    </>
  );
}
