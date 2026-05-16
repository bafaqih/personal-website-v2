"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, FolderTree, Loader2, Save, X } from "lucide-react";
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
import { ProjectService } from "@/src/services/project.service";
import type { ProjectType } from "@/src/types/database";

export default function ProjectTypesPage() {
  const [types, setTypes] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingType, setEditingType] = useState<ProjectType | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({ name_id: "", name_en: "", is_active: true });

  // Delete state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTypes = () => {
    setLoading(true);
    ProjectService.getTypes()
      .then(setTypes)
      .catch(() => toast.error("Failed to load types"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTypes(); }, []);

  const openAddModal = () => {
    setEditingType(null);
    setFormData({ name_id: "", name_en: "", is_active: true });
    setIsModalOpen(true);
  };

  const openEditModal = (type: ProjectType) => {
    setEditingType(type);
    setFormData({
      name_id: type.name_id,
      name_en: type.name_en,
      is_active: type.is_active,
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
      if (editingType) {
        await ProjectService.updateType(editingType.id, formData);
        toast.success("Type updated");
      } else {
        await ProjectService.createType(formData);
        toast.success("Type created");
      }
      setIsModalOpen(false);
      fetchTypes();
    } catch {
      toast.error(editingType ? "Failed to update type" : "Failed to create type");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await ProjectService.deleteType(deleteId);
      toast.success("Type deleted");
      fetchTypes();
    } catch {
      toast.error("Failed to delete type");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const columns: Column<ProjectType>[] = [
    {
      key: "name_en",
      header: "Name (EN)",
      className: "font-medium",
    },
    {
      key: "name_id",
      header: "Name (ID)",
      render: (type) => <Badge variant="secondary">{type.name_id}</Badge>,
    },
    {
      key: "is_active",
      header: "Status",
      render: (type) => (
        <Badge variant={type.is_active ? "default" : "secondary"}>
          {type.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Project Types"
        icon={FolderTree}
        description="Manage project type classifications."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Projects" },
          { label: "Types" },
        ]}
        actions={
          <Button onClick={openAddModal} className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
            <Plus className="mr-1.5 h-4 w-4" /> Add Type
          </Button>
        }
      />

      <DataTable
        data={types}
        columns={columns}
        searchPlaceholder="Search types..."
        emptyMessage={loading ? "Loading types..." : "No types found."}
        actions={(type) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => openEditModal(type)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
              onClick={() => setDeleteId(type.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingType ? "Edit Type" : "Add Type"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Name (EN)</Label>
              <Input
                placeholder="e.g., Client Work"
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Name (ID)</Label>
              <Input
                placeholder="e.g., Proyek Klien"
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
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              <X className="mr-1.5 h-4 w-4" /> Cancel
            </Button>
            <Button
              onClick={handleModalSubmit}
              disabled={isSubmitting}
              className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
            >
              {isSubmitting ? (
                <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> {editingType ? "Saving..." : "Creating..."}</>
              ) : editingType ? (
                <><Save className="mr-1.5 h-4 w-4" /> Save Changes</>
              ) : (
                <><Plus className="mr-1.5 h-4 w-4" /> Create Type</>
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
