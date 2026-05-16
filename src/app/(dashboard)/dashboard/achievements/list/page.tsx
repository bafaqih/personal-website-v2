"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Trophy } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { DeleteDialog } from "@/components/dashboard/delete-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AchievementService } from "@/src/services/achievement.service";
import type { Achievement } from "@/src/types/database";

export default function AchievementsListPage() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = () => {
    setLoading(true);
    AchievementService.getAll()
      .then(setItems)
      .catch(() => toast.error("Failed to load achievements"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await AchievementService.delete(deleteId);
      toast.success("Achievement deleted successfully");
      fetchData();
    } catch {
      toast.error("Failed to delete achievement");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const columns: Column<Achievement>[] = [
    { 
      key: "title_en", 
      header: "Title",
      className: "font-medium"
    },
    { 
      key: "publisher", 
      header: "Publisher" 
    },
    { 
      key: "type_id", 
      header: "Type", 
      render: (a) => <Badge variant="secondary">{a.type?.name_en || "-"}</Badge> 
    },
    { 
      key: "issue_date", 
      header: "Date", 
      render: (a) => (
        <span className="text-sm">
          {a.issue_date ? new Date(a.issue_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-"}
        </span>
      ) 
    },
    { 
      key: "is_published", 
      header: "Status", 
      render: (a) => (
        <Badge variant={a.is_published ? "default" : "secondary"}>
          {a.is_published ? "Published" : "Draft"}
        </Badge>
      ) 
    },
  ];

  return (
    <>
      <PageHeader 
        title="Achievements" 
        icon={Trophy}
        description="Manage certifications and awards." 
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" }, 
          { label: "Achievements" }, 
          { label: "List" }
        ]}
        actions={
          <Link href="/dashboard/achievements/add">
            <Button className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
              <Plus className="mr-1.5 h-4 w-4" /> Add Achievement
            </Button>
          </Link>
        } 
      />

      <DataTable 
        data={items} 
        columns={columns} 
        loading={loading}
        searchPlaceholder="Search achievements..."
        actions={(a) => (
          <div className="flex items-center gap-1">
            <Link href={`/dashboard/achievements/${a.id}/edit`}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50" 
              onClick={() => setDeleteId(a.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )} 
      />

      <DeleteDialog 
        open={!!deleteId} 
        onOpenChange={() => setDeleteId(null)} 
        onConfirm={handleDelete} 
        loading={deleting} 
      />
    </>
  );
}
