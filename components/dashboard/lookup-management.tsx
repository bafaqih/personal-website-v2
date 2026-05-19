"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { DeleteDialog } from "@/components/dashboard/delete-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import type { LookupItem } from "@/src/types/database";
import { useLanguage } from "@/context/language-context";

interface LookupManagementProps {
  title: string;
  description: string;
  breadcrumbs: { label: string; href?: string }[];
  fetchItems: () => Promise<LookupItem[]>;
  createItem: (payload: Partial<LookupItem>) => Promise<LookupItem>;
  updateItem: (id: string, payload: Partial<LookupItem>) => Promise<LookupItem>;
  deleteItem: (id: string) => Promise<void>;
}

/**
 * Reusable lookup table management component.
 * Used for: skill categories, project types/categories, achievement types/categories, blog types/categories.
 */
export function LookupManagement({
  title,
  description,
  breadcrumbs,
  fetchItems,
  createItem,
  updateItem,
  deleteItem,
}: LookupManagementProps) {
  const { t } = useLanguage();
  const [items, setItems] = useState<LookupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editNameId, setEditNameId] = useState("");
  const [editNameEn, setEditNameEn] = useState("");
  const [addMode, setAddMode] = useState(false);
  const [newNameId, setNewNameId] = useState("");
  const [newNameEn, setNewNameEn] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetch = () => {
    setLoading(true);
    fetchItems()
      .then(setItems)
      .catch(() => toast.error(t("common.lookup.load_failed")))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleAdd = async () => {
    if (!newNameId.trim() || !newNameEn.trim()) return;
    try {
      await createItem({ name_id: newNameId, name_en: newNameEn, is_active: true });
      toast.success(t("common.lookup.created"));
      setAddMode(false); setNewNameId(""); setNewNameEn("");
      fetch();
    } catch { toast.error(t("common.lookup.create_failed")); }
  };

  const handleEdit = async (id: string) => {
    try {
      await updateItem(id, { name_id: editNameId, name_en: editNameEn });
      toast.success(t("common.lookup.updated"));
      setEditId(null);
      fetch();
    } catch { toast.error(t("common.lookup.update_failed")); }
  };

  const handleToggle = async (id: string, is_active: boolean) => {
    try {
      await updateItem(id, { is_active });
      fetch();
    } catch { toast.error(t("common.lookup.update_status_failed")); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteItem(deleteId);
      toast.success(t("common.lookup.deleted"));
      fetch();
    } catch { toast.error(t("common.lookup.delete_failed")); }
    finally { setDeleting(false); setDeleteId(null); }
  };

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
        actions={
          !addMode ? (
            <Button onClick={() => setAddMode(true)} className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
              <Plus className="mr-2 h-4 w-4" /> {t("common.lookup.add")}
            </Button>
          ) : undefined
        }
      />

      <Card className="border-neutral-200/60 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-neutral-900/80">
        <CardContent className="p-4">
          {addMode && (
            <div className="mb-4 flex items-center gap-3 rounded-lg border border-dashed border-neutral-300 p-3 dark:border-white/20">
              <Input placeholder={t("common.lookup.placeholder_id")} value={newNameId} onChange={(e) => setNewNameId(e.target.value)} className="max-w-[200px]" />
              <Input placeholder={t("common.lookup.placeholder_en")} value={newNameEn} onChange={(e) => setNewNameEn(e.target.value)} className="max-w-[200px]" />
              <Button size="icon" variant="ghost" onClick={handleAdd} className="h-8 w-8 text-green-600"><Check className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => { setAddMode(false); setNewNameId(""); setNewNameEn(""); }} className="h-8 w-8"><X className="h-4 w-4" /></Button>
            </div>
          )}

          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg px-4 py-3 transition-colors hover:bg-neutral-50 dark:hover:bg-white/5">
                {editId === item.id ? (
                  <div className="flex flex-1 items-center gap-3">
                    <Input value={editNameId} onChange={(e) => setEditNameId(e.target.value)} className="max-w-[200px]" />
                    <Input value={editNameEn} onChange={(e) => setEditNameEn(e.target.value)} className="max-w-[200px]" />
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(item.id)} className="h-8 w-8 text-green-600"><Check className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => setEditId(null)} className="h-8 w-8"><X className="h-4 w-4" /></Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{item.name_en}</span>
                      <Badge variant="secondary" className="text-xs">{item.name_id}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={item.is_active} onCheckedChange={(v) => handleToggle(item.id, v)} />
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditId(item.id); setEditNameId(item.name_id); setEditNameEn(item.name_en); }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500" onClick={() => setDeleteId(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
            {!loading && items.length === 0 && (
              <p className="py-8 text-center text-sm text-neutral-500">{t("common.lookup.no_items")}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <DeleteDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} />
    </>
  );
}
