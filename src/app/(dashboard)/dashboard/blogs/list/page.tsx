"use client";
import { useEffect, useState } from "react"; import Link from "next/link"; import { Plus, Pencil, Trash2, Eye } from "lucide-react"; import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header"; import { DeleteDialog } from "@/components/dashboard/delete-dialog"; import { Button } from "@/components/ui/button"; import { Badge } from "@/components/ui/badge"; import { Card, CardContent } from "@/components/ui/card"; import { Input } from "@/components/ui/input"; import { Search } from "lucide-react";
import { BlogService } from "@/src/services/blog.service"; import type { Blog } from "@/src/types/database";

export default function BlogsListPage() {
  const [items, setItems] = useState<Blog[]>([]); const [search, setSearch] = useState(""); const [deleteId, setDeleteId] = useState<string | null>(null); const [deleting, setDeleting] = useState(false);
  const fetchData = () => { BlogService.getAll().then(setItems).catch(() => toast.error("Failed")); };
  useEffect(() => { fetchData(); }, []);
  const handleDelete = async () => { if (!deleteId) return; setDeleting(true); try { await BlogService.delete(deleteId); toast.success("Deleted"); fetchData(); } catch { toast.error("Failed"); } finally { setDeleting(false); setDeleteId(null); } };

  const filtered = items.filter((b) => b.title_en.toLowerCase().includes(search.toLowerCase()) || b.title_id.toLowerCase().includes(search.toLowerCase()));

  return (
    <><PageHeader title="Blogs" description="Manage blog articles." breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Blogs" }, { label: "List" }]}
        actions={<Link href="/dashboard/blogs/add"><Button className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"><Plus className="mr-2 h-4 w-4" /> Add Blog</Button></Link>} />
      <div className="relative mb-6 max-w-sm"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" /><Input placeholder="Search blogs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((blog) => (
          <Card key={blog.id} className="group overflow-hidden border-neutral-200/60 bg-white/80 backdrop-blur-sm transition-all hover:shadow-md dark:border-white/10 dark:bg-neutral-900/80">
            <CardContent className="p-5">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-900 dark:text-white line-clamp-2">{blog.title_en}</h3>
                  <p className="mt-1 text-xs text-neutral-500">{blog.title_id}</p>
                </div>
                <Badge variant={blog.is_published ? "default" : "secondary"} className="ml-2 shrink-0">{blog.is_published ? "Published" : "Draft"}</Badge>
              </div>
              <div className="mb-3 flex items-center gap-3 text-xs text-neutral-500">
                {blog.type && <Badge variant="outline" className="text-xs">{blog.type.name_en}</Badge>}
                {blog.category && <Badge variant="outline" className="text-xs">{blog.category.name_en}</Badge>}
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <Eye className="h-3.5 w-3.5" /> {blog.views_count} views · {blog.likes_count} likes
              </div>
              <div className="mt-4 flex items-center gap-1 border-t border-neutral-100 pt-3 dark:border-white/5">
                <Link href={`/dashboard/blogs/${blog.id}/edit`}><Button variant="ghost" size="sm" className="h-8"><Pencil className="mr-1 h-3.5 w-3.5" /> Edit</Button></Link>
                <Button variant="ghost" size="sm" className="h-8 text-red-500" onClick={() => setDeleteId(blog.id)}><Trash2 className="mr-1 h-3.5 w-3.5" /> Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <p className="col-span-full py-12 text-center text-sm text-neutral-500">No blogs found.</p>}
      </div>
      <DeleteDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} /></>
  );
}
