"use client";
import { useEffect, useState } from "react"; import { useRouter, useParams } from "next/navigation"; import { useForm } from "react-hook-form"; import { zodResolver } from "@hookform/resolvers/zod"; import { z } from "zod"; import { Loader2 } from "lucide-react"; import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header"; import { Button } from "@/components/ui/button"; import { Input } from "@/components/ui/input"; import { Label } from "@/components/ui/label"; import { Switch } from "@/components/ui/switch"; import { Card, CardContent } from "@/components/ui/card"; import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; import { ImageUpload } from "@/components/dashboard/image-upload"; import { Skeleton } from "@/components/ui/skeleton";
import { AchievementService } from "@/src/services/achievement.service"; import { StorageService } from "@/src/services/storage.service"; import { STORAGE_PATHS } from "@/src/lib/constants"; import type { AchievementType, AchievementCategory } from "@/src/types/database";

const schema = z.object({ title_id: z.string().min(1), title_en: z.string().min(1), publisher: z.string().optional(), issue_date: z.string().optional(), credential_url: z.string().optional(), type_id: z.string().optional(), category_id: z.string().optional(), is_published: z.boolean() });
type FormData = z.infer<typeof schema>;

export default function AchievementEditPage() {
  const router = useRouter(); const { id } = useParams() as { id: string }; const [types, setTypes] = useState<AchievementType[]>([]); const [categories, setCategories] = useState<AchievementCategory[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null); const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null); const [loading, setLoading] = useState(true);
  const { register, handleSubmit, setValue, watch, reset, formState: { isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });
  useEffect(() => {
    Promise.all([AchievementService.getById(id), AchievementService.getTypes(), AchievementService.getCategories()])
      .then(([a, t, c]) => { setTypes(t); setCategories(c); setCurrentImageUrl(a.image_url);
        reset({ title_id: a.title_id, title_en: a.title_en, publisher: a.publisher || "", issue_date: a.issue_date || "", credential_url: a.credential_url || "", type_id: a.type_id || "", category_id: a.category_id || "", is_published: a.is_published });
      }).catch(() => toast.error("Failed")).finally(() => setLoading(false));
  }, [id, reset]);
  const onSubmit = async (data: FormData) => { try { let image_url = currentImageUrl; if (imageFile) { const r = await StorageService.uploadImage(STORAGE_PATHS.ACHIEVEMENTS, imageFile); image_url = r.publicUrl; } await AchievementService.update(id, { ...data, image_url }); toast.success("Updated"); router.push("/dashboard/achievements/list"); } catch (e: unknown) { toast.error("Failed", { description: e instanceof Error ? e.message : undefined }); } };
  if (loading) return <><PageHeader title="Edit Achievement" /><Skeleton className="h-64 max-w-2xl rounded-xl" /></>;
  return (
    <><PageHeader title="Edit Achievement" breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Achievements", href: "/dashboard/achievements/list" }, { label: "Edit" }]} />
    <Card className="max-w-2xl border-neutral-200/60 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-neutral-900/80"><CardContent className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label>Title (ID)</Label><Input {...register("title_id")} /></div><div className="space-y-2"><Label>Title (EN)</Label><Input {...register("title_en")} /></div></div>
        <div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label>Publisher</Label><Input {...register("publisher")} /></div><div className="space-y-2"><Label>Issue Date</Label><Input type="date" {...register("issue_date")} /></div></div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2"><Label>Type</Label><Select onValueChange={(v) => setValue("type_id", v)} value={watch("type_id")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{types.map((t) => <SelectItem key={t.id} value={t.id}>{t.name_en}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label>Category</Label><Select onValueChange={(v) => setValue("category_id", v)} value={watch("category_id")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name_en}</SelectItem>)}</SelectContent></Select></div>
        </div>
        <div className="space-y-2"><Label>Credential URL</Label><Input {...register("credential_url")} /></div>
        <div className="space-y-2"><Label>Certificate Image</Label><ImageUpload accept="image" value={currentImageUrl || undefined} onChange={(f) => { setImageFile(f); if (!f) setCurrentImageUrl(null); }} /></div>
        <div className="flex items-center gap-3"><Switch checked={watch("is_published")} onCheckedChange={(v) => setValue("is_published", v)} /><Label>Published</Label></div>
        <div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button><Button type="submit" disabled={isSubmitting} className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save Changes</Button></div>
      </form>
    </CardContent></Card></>
  );
}
