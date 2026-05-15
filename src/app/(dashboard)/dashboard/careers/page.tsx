"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { DeleteDialog } from "@/components/dashboard/delete-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CareerService } from "@/src/services/career.service";
import type { Career } from "@/src/types/database";

export default function CareersPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetch = () => {
    setLoading(true);
    CareerService.getAll().then(setCareers).catch(() => toast.error("Failed to load")).finally(() => setLoading(false));
  };
  useEffect(() => { fetch(); }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try { await CareerService.delete(deleteId); toast.success("Deleted"); fetch(); }
    catch { toast.error("Failed to delete"); }
    finally { setDeleting(false); setDeleteId(null); }
  };

  const columns: Column<Career>[] = [
    { key: "company", header: "Company", className: "font-medium" },
    { key: "role_en", header: "Role" },
    { key: "type_en", header: "Type", render: (c) => <Badge variant="secondary">{c.type_en || "-"}</Badge> },
    { 
      key: "start_date", 
      header: "Period", 
      render: (c) => {
        const formatDate = (dateStr: string) => 
          new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
          
        const isPresent = !c.end_date || new Date(c.end_date) > new Date();
        const start = formatDate(c.start_date);
        const end = isPresent ? "Present" : formatDate(c.end_date as string);
        
        return <span className="text-sm">{start} - {end}</span>;
      } 
    },
    { key: "is_published", header: "Status", render: (c) => <Badge variant={c.is_published ? "default" : "secondary"}>{c.is_published ? "Published" : "Draft"}</Badge> },
  ];

  return (
    <>
      <PageHeader title="Careers" icon={Briefcase} description="Manage work experience." breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Careers" }]}
        actions={<Link href="/dashboard/careers/add"><Button className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"><Plus className="mr-1.5 h-4 w-4" /> Add Career</Button></Link>} />
      <DataTable data={careers} columns={columns} searchPlaceholder="Search careers..."
        actions={(c) => (
          <div className="flex items-center gap-1">
            <Link href={`/dashboard/careers/${c.id}/edit`}><Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-4 w-4" /></Button></Link>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50" onClick={() => setDeleteId(c.id)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        )} />
      <DeleteDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} />
    </>
  );
}
