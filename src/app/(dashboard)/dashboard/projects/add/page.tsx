"use client";
import { useEffect, useState } from "react"; import { useRouter } from "next/navigation"; import { useForm } from "react-hook-form"; import { zodResolver } from "@hookform/resolvers/zod"; import { z } from "zod"; import { Loader2 } from "lucide-react"; import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header"; import { Button } from "@/components/ui/button"; import { Input } from "@/components/ui/input"; import { Label } from "@/components/ui/label"; import { Textarea } from "@/components/ui/textarea"; import { Switch } from "@/components/ui/switch"; import { Card, CardContent } from "@/components/ui/card"; import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; import { ImageUpload } from "@/components/dashboard/image-upload"; import { RichTextEditor } from "@/components/dashboard/rich-text-editor";
import { ProjectService } from "@/src/services/project.service"; import { StorageService } from "@/src/services/storage.service"; import { STORAGE_PATHS } from "@/src/lib/constants"; import type { ProjectType, ProjectCategory } from "@/src/types/database";

const schema = z.object({ slug: z.string().min(1), title_id: z.string().min(1), title_en: z.string().min(1), bio_id: z.string().optional(), bio_en: z.string().optional(), type_id: z.string().optional(), category_id: z.string().optional(), project_date: z.string().optional(), github_url: z.string().optional(), live_url: z.string().optional(), video_url: z.string().optional(), is_published: z.boolean() });
type FormData = z.infer<typeof schema>;

export default function ProjectAddPage() {
  const router = useRouter(); const [types, setTypes] = useState<ProjectType[]>([]); const [categories, setCategories] = useState<ProjectCategory[]>([]); const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [overviewId, setOverviewId] = useState(""); const [overviewEn, setOverviewEn] = useState("");
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { is_published: false } });

  useEffect(() => { ProjectService.getTypes().then(setTypes).catch(() => {}); ProjectService.getCategories().then(setCategories).catch(() => {}); }, []);

  const onSubmit = async (data: FormData) => {
    try {
      let thumbnail_url: string | null = null;
      if (thumbFile) { const r = await StorageService.uploadImage(STORAGE_PATHS.PROJECTS, thumbFile); thumbnail_url = r.publicUrl; }
      await ProjectService.create({ ...data, thumbnail_url, overview_id: overviewId || null, overview_en: overviewEn || null, challenge_points: [], result_points: [], lesson_points: [] });
      toast.success("Created"); router.push("/dashboard/projects/list");
    } catch (e: unknown) { toast.error("Failed", { description: e instanceof Error ? e.message : undefined }); }
  };

  return (
    <><PageHeader title="Add Project" breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Projects", href: "/dashboard/projects/list" }, { label: "Add" }]} />
    <Card className="border-neutral-200/60 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-neutral-900/80"><CardContent className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label>Slug</Label><Input {...register("slug")} placeholder="my-project" />{errors.slug && <p className="text-xs text-red-500">{errors.slug.message}</p>}</div><div className="space-y-2"><Label>Project Date</Label><Input type="date" {...register("project_date")} /></div></div>
        <div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label>Title (ID)</Label><Input {...register("title_id")} /></div><div className="space-y-2"><Label>Title (EN)</Label><Input {...register("title_en")} /></div></div>
        <div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label>Bio (ID)</Label><Textarea {...register("bio_id")} rows={2} /></div><div className="space-y-2"><Label>Bio (EN)</Label><Textarea {...register("bio_en")} rows={2} /></div></div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2"><Label>Type</Label><Select onValueChange={(v) => setValue("type_id", v)} value={watch("type_id")}><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger><SelectContent>{types.map((t) => <SelectItem key={t.id} value={t.id}>{t.name_en}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label>Category</Label><Select onValueChange={(v) => setValue("category_id", v)} value={watch("category_id")}><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name_en}</SelectItem>)}</SelectContent></Select></div>
        </div>
        <div className="grid gap-4 md:grid-cols-3"><div className="space-y-2"><Label>GitHub URL</Label><Input {...register("github_url")} /></div><div className="space-y-2"><Label>Live URL</Label><Input {...register("live_url")} /></div><div className="space-y-2"><Label>Video URL</Label><Input {...register("video_url")} /></div></div>
        <div className="space-y-2"><Label>Thumbnail</Label><ImageUpload accept="image" onChange={(f) => setThumbFile(f)} /></div>
        <div className="space-y-2"><Label>Overview (ID)</Label><RichTextEditor content={overviewId} onChange={setOverviewId} /></div>
        <div className="space-y-2"><Label>Overview (EN)</Label><RichTextEditor content={overviewEn} onChange={setOverviewEn} /></div>
        <div className="flex items-center gap-3"><Switch checked={watch("is_published")} onCheckedChange={(v) => setValue("is_published", v)} /><Label>Published</Label></div>
        <div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button><Button type="submit" disabled={isSubmitting} className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create</Button></div>
      </form>
    </CardContent></Card></>
  );
}
