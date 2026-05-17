"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Briefcase, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { DeleteDialog } from "@/components/dashboard/delete-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CareerService } from "@/src/services/career.service";
import type { Career } from "@/src/types/database";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
        actions={<Link href="/dashboard/careers/add"><Button className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 gap-1.5"><Plus className="h-4 w-4" /> Add Career</Button></Link>} />
      <DataTable data={careers} columns={columns} searchPlaceholder="Search careers..."
        actions={(c) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 data-[state=open]:bg-neutral-100 dark:data-[state=open]:bg-white/10">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href={`/dashboard/careers/${c.id}/edit`}>
                <DropdownMenuItem className="cursor-pointer">
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem 
                variant="destructive"
                className="cursor-pointer"
                onClick={() => setDeleteId(c.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )} />
      <DeleteDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} itemName="career" />
    </>
  );
}
