"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Award, Loader2, Save, X, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { DeleteDialog } from "@/components/dashboard/delete-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AchievementService } from "@/src/services/achievement.service";
import type { AchievementCategory } from "@/src/types/database";

export default function AchievementCategoriesPage() {
  const [categories, setCategories] = useState<AchievementCategory[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AchievementCategory | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({ name_id: "", name_en: "", is_active: true });

  // Delete state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = () => {
    setLoading(true);
    AchievementService.getCategories()
      .then(setCategories)
      .catch(() => toast.error("Failed to load categories"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name_id: "", name_en: "", is_active: true });
    setIsModalOpen(true);
  };

  const openEditModal = (category: AchievementCategory) => {
    setEditingCategory(category);
    setFormData({
      name_id: category.name_id,
      name_en: category.name_en,
      is_active: category.is_active,
    });
    setIsModalOpen(true);
  };

  const handleModalSubmit = async () => {
    if (!formData.name_id.trim() || !formData.name_en.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await AchievementService.updateCategory(editingCategory.id, formData);
        toast.success("Category updated");
      } else {
        await AchievementService.createCategory(formData);
        toast.success("Category created");
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch {
      toast.error(editingCategory ? "Failed to update category" : "Failed to create category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await AchievementService.deleteCategory(deleteId);
      toast.success("Category deleted");
      fetchCategories();
    } catch {
      toast.error("Failed to delete category");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const columns: Column<AchievementCategory>[] = [
    {
      key: "name_en",
      header: "Name (EN)",
      className: "font-medium",
    },
    {
      key: "name_id",
      header: "Name (ID)",
      render: (cat) => <Badge variant="secondary">{cat.name_id}</Badge>,
    },
    {
      key: "is_active",
      header: "Status",
      render: (cat) => (
        <Badge variant={cat.is_active ? "default" : "secondary"}>
          {cat.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Achievement Categories"
        icon={Award}
        description="Manage achievement category classifications."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Achievements" },
          { label: "Categories" },
        ]}
        actions={
          <Button onClick={openAddModal} className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 gap-1.5">
            <Plus className="h-4 w-4" /> Add Category
          </Button>
        }
      />

      <DataTable
        data={categories}
        columns={columns}
        searchPlaceholder="Search categories..."
        loading={loading}
        emptyMessage={loading ? "Loading categories..." : "No categories found."}
        actions={(cat) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 data-[state=open]:bg-neutral-100 dark:data-[state=open]:bg-white/10">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer" onClick={() => openEditModal(cat)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                variant="destructive"
                className="cursor-pointer"
                onClick={() => setDeleteId(cat.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Name (EN)</Label>
              <Input
                placeholder="e.g., Competition"
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Name (ID)</Label>
              <Input
                placeholder="e.g., Kompetisi"
                value={formData.name_id}
                onChange={(e) => setFormData({ ...formData, name_id: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Switch
                checked={formData.is_active}
                onCheckedChange={(v) => setFormData({ ...formData, is_active: v })}
              />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="gap-1.5">
              <X className="h-4 w-4" /> Cancel
            </Button>
            <Button onClick={handleModalSubmit}
              disabled={isSubmitting}
              className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 gap-1.5">
              {isSubmitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> {editingCategory ? "Saving..." : "Creating..."}</>
              ) : editingCategory ? (
                <><Save className="h-4 w-4" /> Save Changes</>
              ) : (
                <><Plus className="h-4 w-4" /> Create Category</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  );
}
