"use client";
import { useEffect, useState } from "react"; import { useRouter, useParams } from "next/navigation"; import { useForm } from "react-hook-form"; import { zodResolver } from "@hookform/resolvers/zod"; import { z } from "zod"; import { Loader2 } from "lucide-react"; import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header"; import { Button } from "@/components/ui/button"; import { Input } from "@/components/ui/input"; import { Label } from "@/components/ui/label"; import { Switch } from "@/components/ui/switch"; import { Card, CardContent } from "@/components/ui/card"; import { ImageUpload } from "@/components/dashboard/image-upload"; import { Skeleton } from "@/components/ui/skeleton";
import { EducationService } from "@/src/services/education.service"; import { StorageService } from "@/src/services/storage.service"; import { STORAGE_PATHS } from "@/src/lib/constants";

const schema = z.object({ school: z.string().min(1), level_major_id: z.string().min(1), level_major_en: z.string().min(1), gpa: z.number().optional(), max_gpa: z.number().optional(), start_date: z.string().min(1), end_date: z.string().optional(), is_published: z.boolean() });
type FormData = z.infer<typeof schema>;

export default function EducationEditPage() {
  const router = useRouter(); const { id } = useParams() as { id: string }; const [logoFile, setLogoFile] = useState<File | null>(null); const [currentLogoUrl, setCurrentLogoUrl] = useState<string | null>(null); const [loading, setLoading] = useState(true);
  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });
  useEffect(() => { EducationService.getById(id).then((e) => { setCurrentLogoUrl(e.logo_url); reset({ school: e.school, level_major_id: e.level_major_id, level_major_en: e.level_major_en, gpa: e.gpa ?? undefined, max_gpa: e.max_gpa ?? undefined, start_date: e.start_date, end_date: e.end_date || "", is_published: e.is_published }); }).catch(() => toast.error("Failed")).finally(() => setLoading(false)); }, [id, reset]);
  const onSubmit = async (data: FormData) => { try { let logo_url = currentLogoUrl; if (logoFile) { const r = await StorageService.uploadImage(STORAGE_PATHS.EXPERIENCES, logoFile); logo_url = r.publicUrl; } await EducationService.update(id, { ...data, logo_url }); toast.success("Updated"); router.push("/dashboard/educations"); } catch (e: unknown) { toast.error("Failed", { description: e instanceof Error ? e.message : undefined }); } };
  if (loading) return <><PageHeader title="Edit Education" /><Skeleton className="h-64 max-w-2xl rounded-xl" /></>;
  return (
    <><PageHeader title="Edit Education" breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Educations", href: "/dashboard/educations" }, { label: "Edit" }]} />
    <Card className="max-w-2xl border-neutral-200/60 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-neutral-900/80"><CardContent className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2"><Label>School</Label><Input {...register("school")} /></div>
        <div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label>Level / Major (ID)</Label><Input {...register("level_major_id")} /></div><div className="space-y-2"><Label>Level / Major (EN)</Label><Input {...register("level_major_en")} /></div></div>
        <div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label>GPA</Label><Input type="number" step="0.01" {...register("gpa")} /></div><div className="space-y-2"><Label>Max GPA</Label><Input type="number" step="0.01" {...register("max_gpa")} /></div></div>
        <div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label>Start Date</Label><Input type="date" {...register("start_date")} /></div><div className="space-y-2"><Label>End Date</Label><Input type="date" {...register("end_date")} /></div></div>
        <div className="space-y-2"><Label>School Logo</Label><ImageUpload accept="image" value={currentLogoUrl || undefined} onChange={(f) => { setLogoFile(f); if (!f) setCurrentLogoUrl(null); }} /></div>
        <div className="flex items-center gap-3"><Switch checked={watch("is_published")} onCheckedChange={(v) => setValue("is_published", v)} /><Label>Published</Label></div>
        <div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button><Button type="submit" disabled={isSubmitting} className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save Changes</Button></div>
      </form>
    </CardContent></Card></>
  );
}
