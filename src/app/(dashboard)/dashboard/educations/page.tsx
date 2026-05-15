"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { DeleteDialog } from "@/components/dashboard/delete-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EducationService } from "@/src/services/education.service";
import type { Education } from "@/src/types/database";

export default function EducationsPage() {
  const [items, setItems] = useState<Education[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const fetchData = () => { EducationService.getAll().then(setItems).catch(() => toast.error("Failed to load")); };
  useEffect(() => { fetchData(); }, []);
  const handleDelete = async () => { if (!deleteId) return; setDeleting(true); try { await EducationService.delete(deleteId); toast.success("Deleted"); fetchData(); } catch { toast.error("Failed"); } finally { setDeleting(false); setDeleteId(null); } };

  const columns: Column<Education>[] = [
    { key: "school", header: "School", className: "font-medium" },
    { key: "level_major_en", header: "Level / Major" },
    { key: "gpa", header: "GPA", render: (e) => <span>{e.gpa ? `${Number(e.gpa).toFixed(2)}/${e.max_gpa ? Number(e.max_gpa).toFixed(2) : '4.00'}` : "-"}</span> },
    { 
      key: "start_date", 
      header: "Period", 
      render: (e) => {
        const formatDate = (dateStr: string) => 
          new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
          
        const isPresent = !e.end_date || new Date(e.end_date) > new Date();
        const start = formatDate(e.start_date);
        const end = isPresent ? "Present" : formatDate(e.end_date as string);
        
        return <span className="text-sm">{start} - {end}</span>;
      } 
    },
    { key: "is_published", header: "Status", render: (e) => <Badge variant={e.is_published ? "default" : "secondary"}>{e.is_published ? "Published" : "Draft"}</Badge> },
  ];

  return (
    <>
      <PageHeader title="Educations" icon={GraduationCap} description="Manage education records." breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Educations" }]}
        actions={<Link href="/dashboard/educations/add"><Button className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"><Plus className="mr-1.5 h-4 w-4" /> Add Education</Button></Link>} />
      <DataTable data={items} columns={columns} searchPlaceholder="Search educations..."
        actions={(e) => (<div className="flex items-center gap-1"><Link href={`/dashboard/educations/${e.id}/edit`}><Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-4 w-4" /></Button></Link><Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50" onClick={() => setDeleteId(e.id)}><Trash2 className="h-4 w-4" /></Button></div>)} />
      <DeleteDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} />
    </>
  );
}
