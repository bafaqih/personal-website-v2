"use client";
import { useEffect, useState } from "react"; import { useRouter, useParams } from "next/navigation"; import { useForm } from "react-hook-form"; import { zodResolver } from "@hookform/resolvers/zod"; import { z } from "zod"; import { Loader2 } from "lucide-react"; import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header"; import { Button } from "@/components/ui/button"; import { Input } from "@/components/ui/input"; import { Label } from "@/components/ui/label"; import { Textarea } from "@/components/ui/textarea"; import { Switch } from "@/components/ui/switch"; import { Card, CardContent } from "@/components/ui/card"; import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; import { ImageUpload } from "@/components/dashboard/image-upload"; import { RichTextEditor } from "@/components/dashboard/rich-text-editor"; import { Skeleton } from "@/components/ui/skeleton";
import { ProjectService } from "@/src/services/project.service"; import { StorageService } from "@/src/services/storage.service"; import { STORAGE_PATHS } from "@/src/lib/constants"; import type { ProjectType, ProjectCategory } from "@/src/types/database";

const schema = z.object({ slug: z.string().min(1), title_id: z.string().min(1), title_en: z.string().min(1), bio_id: z.string().optional(), bio_en: z.string().optional(), type_id: z.string().optional(), category_id: z.string().optional(), project_date: z.string().optional(), github_url: z.string().optional(), live_url: z.string().optional(), video_url: z.string().optional(), is_published: z.boolean() });
type FormData = z.infer<typeof schema>;

export default function ProjectEditPage() {
  const router = useRouter(); const { id } = useParams() as { id: string }; const [types, setTypes] = useState<ProjectType[]>([]); const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [thumbFile, setThumbFile] = useState<File | null>(null); const [currentThumbUrl, setCurrentThumbUrl] = useState<string | null>(null);
  const [overviewId, setOverviewId] = useState(""); const [overviewEn, setOverviewEn] = useState(""); const [loading, setLoading] = useState(true);
  const { register, handleSubmit, setValue, watch, reset, formState: { isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    Promise.all([ProjectService.getById(id), ProjectService.getTypes(), ProjectService.getCategories()])
      .then(([p, t, c]) => { setTypes(t); setCategories(c); setCurrentThumbUrl(p.thumbnail_url); setOverviewId(p.overview_id || ""); setOverviewEn(p.overview_en || "");
        reset({ slug: p.slug, title_id: p.title_id, title_en: p.title_en, bio_id: p.bio_id || "", bio_en: p.bio_en || "", type_id: p.type_id || "", category_id: p.category_id || "", project_date: p.project_date || "", github_url: p.github_url || "", live_url: p.live_url || "", video_url: p.video_url || "", is_published: p.is_published });
      }).catch(() => toast.error("Failed")).finally(() => setLoading(false));
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    try { let thumbnail_url = currentThumbUrl; if (thumbFile) { const r = await StorageService.uploadImage(STORAGE_PATHS.PROJECTS, thumbFile); thumbnail_url = r.publicUrl; }
      await ProjectService.update(id, { ...data, thumbnail_url, overview_id: overviewId || null, overview_en: overviewEn || null });
      toast.success("Updated"); router.push("/dashboard/projects/list");
    } catch (e: unknown) { toast.error("Failed", { description: e instanceof Error ? e.message : undefined }); }
  };

  if (loading) return <><PageHeader title="Edit Project" /><Skeleton className="h-96 rounded-xl" /></>;
  return (
    <><PageHeader title="Edit Project" breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Projects", href: "/dashboard/projects/list" }, { label: "Edit" }]} />
    <Card className="border-neutral-200/60 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-neutral-900/80"><CardContent className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label>Slug</Label><Input {...register("slug")} /></div><div className="space-y-2"><Label>Project Date</Label><Input type="date" {...register("project_date")} /></div></div>
        <div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label>Title (ID)</Label><Input {...register("title_id")} /></div><div className="space-y-2"><Label>Title (EN)</Label><Input {...register("title_en")} /></div></div>
        <div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label>Bio (ID)</Label><Textarea {...register("bio_id")} rows={2} /></div><div className="space-y-2"><Label>Bio (EN)</Label><Textarea {...register("bio_en")} rows={2} /></div></div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2"><Label>Type</Label><Select onValueChange={(v) => setValue("type_id", v)} value={watch("type_id")}><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger><SelectContent>{types.map((t) => <SelectItem key={t.id} value={t.id}>{t.name_en}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label>Category</Label><Select onValueChange={(v) => setValue("category_id", v)} value={watch("category_id")}><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name_en}</SelectItem>)}</SelectContent></Select></div>
        </div>
        <div className="grid gap-4 md:grid-cols-3"><div className="space-y-2"><Label>GitHub URL</Label><Input {...register("github_url")} /></div><div className="space-y-2"><Label>Live URL</Label><Input {...register("live_url")} /></div><div className="space-y-2"><Label>Video URL</Label><Input {...register("video_url")} /></div></div>
        <div className="space-y-2"><Label>Thumbnail</Label><ImageUpload accept="image" value={currentThumbUrl || undefined} onChange={(f) => { setThumbFile(f); if (!f) setCurrentThumbUrl(null); }} /></div>
        <div className="space-y-2"><Label>Overview (ID)</Label><RichTextEditor content={overviewId} onChange={setOverviewId} /></div>
        <div className="space-y-2"><Label>Overview (EN)</Label><RichTextEditor content={overviewEn} onChange={setOverviewEn} /></div>
        <div className="flex items-center gap-3"><Switch checked={watch("is_published")} onCheckedChange={(v) => setValue("is_published", v)} /><Label>Published</Label></div>
        <div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button><Button type="submit" disabled={isSubmitting} className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save Changes</Button></div>
      </form>
    </CardContent></Card></>
  );
}
