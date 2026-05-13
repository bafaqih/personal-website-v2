"use client";
import { useEffect, useState } from "react"; import { useRouter } from "next/navigation"; import { useForm } from "react-hook-form"; import { zodResolver } from "@hookform/resolvers/zod"; import { z } from "zod"; import { Loader2 } from "lucide-react"; import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header"; import { Button } from "@/components/ui/button"; import { Input } from "@/components/ui/input"; import { Label } from "@/components/ui/label"; import { Switch } from "@/components/ui/switch"; import { Card, CardContent } from "@/components/ui/card"; import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; import { ImageUpload } from "@/components/dashboard/image-upload"; import { RichTextEditor } from "@/components/dashboard/rich-text-editor";
import { BlogService } from "@/src/services/blog.service"; import { StorageService } from "@/src/services/storage.service"; import { STORAGE_PATHS } from "@/src/lib/constants"; import { AuthService } from "@/src/services/auth.service"; import type { BlogType, BlogCategory } from "@/src/types/database";

const schema = z.object({ slug: z.string().min(1), title_id: z.string().min(1), title_en: z.string().min(1), type_id: z.string().optional(), category_id: z.string().optional(), is_published: z.boolean() });
type FormData = z.infer<typeof schema>;

export default function BlogAddPage() {
  const router = useRouter(); const [types, setTypes] = useState<BlogType[]>([]); const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [thumbFile, setThumbFile] = useState<File | null>(null); const [contentId, setContentId] = useState(""); const [contentEn, setContentEn] = useState("");
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { is_published: false } });

  useEffect(() => { BlogService.getTypes().then(setTypes).catch(() => {}); BlogService.getCategories().then(setCategories).catch(() => {}); }, []);

  const onSubmit = async (data: FormData) => {
    try {
      const user = await AuthService.getUser();
      let thumbnail_url: string | null = null;
      if (thumbFile) { const r = await StorageService.uploadImage(STORAGE_PATHS.BLOGS, thumbFile); thumbnail_url = r.publicUrl; }
      await BlogService.create({ ...data, author_id: user?.id, thumbnail_url, content_id: contentId || null, content_en: contentEn || null, likes_count: 0, views_count: 0 });
      toast.success("Created"); router.push("/dashboard/blogs/list");
    } catch (e: unknown) { toast.error("Failed", { description: e instanceof Error ? e.message : undefined }); }
  };

  return (
    <><PageHeader title="Add Blog" breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Blogs", href: "/dashboard/blogs/list" }, { label: "Add" }]} />
    <Card className="border-neutral-200/60 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-neutral-900/80"><CardContent className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label>Slug</Label><Input {...register("slug")} placeholder="my-blog-post" />{errors.slug && <p className="text-xs text-red-500">{errors.slug.message}</p>}</div>
          <div className="space-y-2"><Label>Thumbnail</Label><ImageUpload accept="image" onChange={(f) => setThumbFile(f)} /></div></div>
        <div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label>Title (ID)</Label><Input {...register("title_id")} /></div><div className="space-y-2"><Label>Title (EN)</Label><Input {...register("title_en")} /></div></div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2"><Label>Type</Label><Select onValueChange={(v) => setValue("type_id", v)} value={watch("type_id")}><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger><SelectContent>{types.map((t) => <SelectItem key={t.id} value={t.id}>{t.name_en}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label>Category</Label><Select onValueChange={(v) => setValue("category_id", v)} value={watch("category_id")}><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name_en}</SelectItem>)}</SelectContent></Select></div>
        </div>
        <div className="space-y-2"><Label>Content (ID)</Label><RichTextEditor content={contentId} onChange={setContentId} /></div>
        <div className="space-y-2"><Label>Content (EN)</Label><RichTextEditor content={contentEn} onChange={setContentEn} /></div>
        <div className="flex items-center gap-3"><Switch checked={watch("is_published")} onCheckedChange={(v) => setValue("is_published", v)} /><Label>Published</Label></div>
        <div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button><Button type="submit" disabled={isSubmitting} className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create</Button></div>
      </form>
    </CardContent></Card></>
  );
}
