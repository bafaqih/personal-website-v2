"use client";
import { useEffect, useState } from "react"; import Link from "next/link"; import { Plus, Pencil, Trash2 } from "lucide-react"; import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header"; import { DataTable, type Column } from "@/components/dashboard/data-table"; import { DeleteDialog } from "@/components/dashboard/delete-dialog"; import { Button } from "@/components/ui/button"; import { Badge } from "@/components/ui/badge";
import { ProjectService } from "@/src/services/project.service"; import type { Project } from "@/src/types/database";

export default function ProjectsListPage() {
  const [items, setItems] = useState<Project[]>([]); const [deleteId, setDeleteId] = useState<string | null>(null); const [deleting, setDeleting] = useState(false);
  const fetchData = () => { ProjectService.getAll().then(setItems).catch(() => toast.error("Failed")); };
  useEffect(() => { fetchData(); }, []);
  const handleDelete = async () => { if (!deleteId) return; setDeleting(true); try { await ProjectService.delete(deleteId); toast.success("Deleted"); fetchData(); } catch { toast.error("Failed"); } finally { setDeleting(false); setDeleteId(null); } };
  const columns: Column<Project>[] = [
    { key: "title_en", header: "Title" },
    { key: "slug", header: "Slug", render: (p) => <span className="text-xs text-neutral-500 font-mono">{p.slug}</span> },
    { key: "type_id", header: "Type", render: (p) => <Badge variant="secondary">{p.type?.name_en || "-"}</Badge> },
    { key: "category_id", header: "Category", render: (p) => <Badge variant="secondary">{p.category?.name_en || "-"}</Badge> },
    { key: "is_published", header: "Status", render: (p) => <Badge variant={p.is_published ? "default" : "secondary"}>{p.is_published ? "Published" : "Draft"}</Badge> },
  ];
  return (
    <><PageHeader title="Projects" description="Manage portfolio projects." breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Projects" }, { label: "List" }]}
        actions={<Link href="/dashboard/projects/add"><Button className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"><Plus className="mr-2 h-4 w-4" /> Add Project</Button></Link>} />
      <DataTable data={items} columns={columns} searchPlaceholder="Search projects..."
        actions={(p) => (<div className="flex items-center gap-1"><Link href={`/dashboard/projects/${p.id}/edit`}><Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-4 w-4" /></Button></Link><Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => setDeleteId(p.id)}><Trash2 className="h-4 w-4" /></Button></div>)} />
      <DeleteDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} /></>
  );
}
