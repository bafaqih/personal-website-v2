"use client";
import { useEffect, useState } from "react"; import Link from "next/link"; import { Plus, Pencil, Trash2, Users, MoreHorizontal } from "lucide-react"; import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header"; import { DataTable, type Column } from "@/components/dashboard/data-table"; import { DeleteDialog } from "@/components/dashboard/delete-dialog"; import { Button } from "@/components/ui/button"; import { Badge } from "@/components/ui/badge";
import { OrganizationService } from "@/src/services/organization.service"; import type { Organization } from "@/src/types/database";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function OrganizationsPage() {
  const [items, setItems] = useState<Organization[]>([]); const [deleteId, setDeleteId] = useState<string | null>(null); const [deleting, setDeleting] = useState(false);
  const fetchData = () => { OrganizationService.getAll().then(setItems).catch(() => toast.error("Failed")); };
  useEffect(() => { fetchData(); }, []);
  const handleDelete = async () => { if (!deleteId) return; setDeleting(true); try { await OrganizationService.delete(deleteId); toast.success("Deleted"); fetchData(); } catch { toast.error("Failed"); } finally { setDeleting(false); setDeleteId(null); } };
  const columns: Column<Organization>[] = [
    { key: "organization", header: "Organization", className: "font-medium" }, { key: "role_en", header: "Role" },
    { 
      key: "start_date", 
      header: "Period", 
      render: (o) => {
        const formatDate = (dateStr: string) => 
          new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
          
        const isPresent = !o.end_date || new Date(o.end_date) > new Date();
        const start = formatDate(o.start_date);
        const end = isPresent ? "Present" : formatDate(o.end_date as string);
        
        return <span className="text-sm">{start} - {end}</span>;
      } 
    },
    { key: "is_published", header: "Status", render: (o) => <Badge variant={o.is_published ? "default" : "secondary"}>{o.is_published ? "Published" : "Draft"}</Badge> },
  ];
  return (
    <><PageHeader title="Organizations" icon={Users} description="Manage organization experience." breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Organizations" }]}
        actions={<Link href="/dashboard/organizations/add"><Button className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"><Plus className="mr-1.5 h-4 w-4" /> Add Organization</Button></Link>} />
      <DataTable data={items} columns={columns} searchPlaceholder="Search organizations..."
        actions={(o) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 data-[state=open]:bg-neutral-100 dark:data-[state=open]:bg-white/10">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href={`/dashboard/organizations/${o.id}/edit`}>
                <DropdownMenuItem className="cursor-pointer">
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem 
                variant="destructive"
                className="cursor-pointer"
                onClick={() => setDeleteId(o.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )} />
      <DeleteDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} /></>
  );
}
