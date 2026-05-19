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
import type { AchievementType } from "@/src/types/database";
import { useLanguage } from "@/context/language-context";

import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function AchievementTypesPage() {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();

  const { data: types = [], isLoading, isError } = useQuery({
    queryKey: ["achievement-types"],
    queryFn: AchievementService.getTypes,
    meta: { resource: "sidebar.Types" },
  });

  const loading = isLoading;
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingType, setEditingType] = useState<AchievementType | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({ name_id: "", name_en: "", is_active: true });

  // Delete state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openAddModal = () => {
    setEditingType(null);
    setFormData({ name_id: "", name_en: "", is_active: true });
    setIsModalOpen(true);
  };

  const openEditModal = (type: AchievementType) => {
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
      toast.error(language === "en" ? "Please fill in all fields" : "Silakan isi semua kolom");
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (editingType) {
        await AchievementService.updateType(editingType.id, formData);
        toast.success(t("achievements.type_saved"));
      } else {
        await AchievementService.createType(formData);
        toast.success(t("achievements.type_saved"));
      }
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["achievement-types"] });
    } catch {
      toast.error(t("common.failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await AchievementService.deleteType(deleteId);
      toast.success(t("achievements.type_deleted"));
      queryClient.invalidateQueries({ queryKey: ["achievement-types"] });
    } catch {
      toast.error(t("common.failed"));
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const columns: Column<AchievementType>[] = [
    {
      key: "name_en",
      header: language === "en" ? "Name (EN)" : "Nama (EN)",
      className: "font-medium",
    },
    {
      key: "name_id",
      header: language === "en" ? "Name (ID)" : "Nama (ID)",
      render: (type) => <Badge variant="secondary">{type.name_id}</Badge>,
    },
    {
      key: "is_active",
      header: t("common.status"),
      render: (type) => (
        <Badge variant={type.is_active ? "default" : "secondary"}>
          {type.is_active ? (language === "en" ? "Active" : "Aktif") : (language === "en" ? "Inactive" : "Nonaktif")}
        </Badge>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title={t("achievements.types")}
        icon={Award}
        description={language === "en" ? "Manage achievement type classifications." : "Kelola klasifikasi tipe pencapaian."}
        breadcrumbs={[
          { label: t("dashboard.title"), href: "/dashboard" },
          { label: t("achievements.title"), href: "/dashboard/achievements/list" },
          { label: t("projects.types") },
        ]}
        actions={
          <Button onClick={openAddModal} className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 gap-1.5 cursor-pointer">
            <Plus className="h-4 w-4" /> {t("achievements.add_type")}
          </Button>
        }
      />

      <DataTable
        data={types}
        columns={columns}
        loading={loading}
        error={isError}
        searchPlaceholder={language === "en" ? "Search types..." : "Cari tipe..."}
        emptyMessage={loading ? t("common.loading") : t("common.no_data")}
        filters={[
          {
            key: "is_active",
            label: t("common.status"),
            options: [
              { label: language === "en" ? "Active" : "Aktif", value: true },
              { label: language === "en" ? "Inactive" : "Nonaktif", value: false },
            ],
          },
        ]}
        actions={(type) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 data-[state=open]:bg-neutral-100 dark:data-[state=open]:bg-white/10">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer" onClick={() => openEditModal(type)}>
                <Pencil className="mr-2 h-4 w-4" />
                {t("common.edit")}
              </DropdownMenuItem>
              <DropdownMenuItem 
                variant="destructive"
                className="cursor-pointer"
                onClick={() => setDeleteId(type.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t("common.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingType ? t("achievements.edit_type") : t("achievements.add_type")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>{language === "en" ? "Name (EN)" : "Nama (EN)"}</Label>
              <Input
                placeholder="e.g., Award"
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>{language === "en" ? "Name (ID)" : "Nama (ID)"}</Label>
              <Input
                placeholder="e.g., Penghargaan"
                value={formData.name_id}
                onChange={(e) => setFormData({ ...formData, name_id: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Switch
                checked={formData.is_active}
                onCheckedChange={(v) => setFormData({ ...formData, is_active: v })}
              />
              <Label>{language === "en" ? "Active" : "Aktif"}</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="gap-1.5 cursor-pointer">
              <X className="h-4 w-4" /> {t("common.cancel")}
            </Button>
            <Button onClick={handleModalSubmit}
              disabled={isSubmitting}
              className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 gap-1.5 cursor-pointer">
              {isSubmitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> {t("common.saving")}</>
              ) : editingType ? (
                <><Save className="h-4 w-4" /> {t("common.save")}</>
              ) : (
                <><Plus className="h-4 w-4" /> {t("achievements.add_type")}</>
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
        itemName={language === "en" ? "type" : "tipe"}
      />
    </>
  );
}
