"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, FileText, Heart } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { DeleteDialog } from "@/components/dashboard/delete-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlogService } from "@/src/services/blog.service";
import type { Blog } from "@/src/types/database";

export default function BlogsListPage() {
  const [items, setItems] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = () => {
    setLoading(true);
    BlogService.getAll()
      .then(setItems)
      .catch(() => toast.error("Failed to load blogs"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await BlogService.delete(deleteId);
      toast.success("Blog post deleted successfully");
      fetchData();
    } catch {
      toast.error("Failed to delete blog post");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const columns: Column<Blog>[] = [
    { 
      key: "title_en", 
      header: "Title",
      render: (b) => (
        <span className="font-medium text-neutral-900 dark:text-white block max-w-[280px] truncate" title={b.title_en}>
          {b.title_en}
        </span>
      )
    },
    {
      key: "title_id",
      header: "Title ID",
      className: "hidden",
    },
    {
      key: "type_id",
      header: "Type",
      render: (b) => (
        <Badge variant="secondary" className="bg-neutral-100 hover:bg-neutral-200 dark:bg-white/10 dark:hover:bg-white/20 text-neutral-900 dark:text-neutral-100 border-none">
          {b.type?.name_en || "-"}
        </Badge>
      )
    },
    {
      key: "category_id",
      header: "Category",
      render: (b) => (
        <Badge variant="secondary" className="bg-neutral-100 hover:bg-neutral-200 dark:bg-white/10 dark:hover:bg-white/20 text-neutral-900 dark:text-neutral-100 border-none">
          {b.category?.name_en || "-"}
        </Badge>
      )
    },
    {
      key: "views_count",
      header: "Views & Likes",
      render: (b) => (
        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5 opacity-60" />
            {b.views_count}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5 opacity-60 text-red-500 fill-red-500/20" />
            {b.likes_count}
          </span>
        </div>
      )
    },
    {
      key: "is_published",
      header: "Status",
      render: (b) => (
        <Badge variant={b.is_published ? "default" : "secondary"}>
          {b.is_published ? "Published" : "Draft"}
        </Badge>
      )
    },
  ];

  return (
    <>
      <PageHeader
        title="Blogs"
        icon={FileText}
        description="Manage your blog articles and publications."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Blogs" },
          { label: "List" },
        ]}
        actions={
          <Link href="/dashboard/blogs/add">
            <Button className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
              <Plus className="mr-1.5 h-4 w-4" /> Add Blog
            </Button>
          </Link>
        }
      />

      <DataTable
        data={items}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search blogs..."
        actions={(b) => (
          <div className="flex items-center gap-1">
            <Link href={`/dashboard/blogs/${b.id}/edit`}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50" 
              onClick={() => setDeleteId(b.id)}
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
