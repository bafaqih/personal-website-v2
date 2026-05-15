"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Code2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { DeleteDialog } from "@/components/dashboard/delete-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SkillService } from "@/src/services/skill.service";
import type { Skill } from "@/src/types/database";

export default function SkillsListPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSkills = () => {
    setLoading(true);
    SkillService.getAll()
      .then(setSkills)
      .catch(() => toast.error("Failed to load skills"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSkills(); }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await SkillService.delete(deleteId);
      toast.success("Skill deleted");
      fetchSkills();
    } catch { toast.error("Failed to delete"); }
    finally { setDeleting(false); setDeleteId(null); }
  };

  const columns: Column<Skill>[] = [
    {
      key: "icon_url",
      header: "Icon",
      searchable: false,
      className: "w-[60px]",
      render: (skill) =>
        skill.icon_url ? (
          <Image src={skill.icon_url} alt={skill.name} width={28} height={28} className="rounded" unoptimized />
        ) : (
          <div className="h-7 w-7 rounded bg-neutral-100 dark:bg-white/10" />
        ),
    },
    { key: "name", header: "Name" },
    {
      key: "category_id",
      header: "Category",
      render: (skill) => (
        <Badge variant="secondary">{skill.category?.name_en || "-"}</Badge>
      ),
    },
    {
      key: "is_active",
      header: "Status",
      render: (skill) => (
        <Badge variant={skill.is_active ? "default" : "secondary"}>
          {skill.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Skills"
        icon={Code2}
        description="Manage your technical skills."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Skills" },
          { label: "List" },
        ]}
        actions={
          <Link href="/dashboard/skills/add">
            <Button className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
              <Plus className="mr-1.5 h-4 w-4" /> Add Skill
            </Button>
          </Link>
        }
      />

      <DataTable
        data={skills}
        columns={columns}
        searchPlaceholder="Search skills..."
        actions={(skill) => (
          <div className="flex items-center gap-1">
            <Link href={`/dashboard/skills/${skill.id}/edit`}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => setDeleteId(skill.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      />

      <DeleteDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} />
    </>
  );
}
