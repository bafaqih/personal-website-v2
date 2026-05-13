"use client";
import { useRouter } from "next/navigation"; import { useForm } from "react-hook-form"; import { zodResolver } from "@hookform/resolvers/zod"; import { z } from "zod"; import { Loader2 } from "lucide-react"; import { toast } from "sonner"; import { useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header"; import { Button } from "@/components/ui/button"; import { Input } from "@/components/ui/input"; import { Label } from "@/components/ui/label"; import { Switch } from "@/components/ui/switch"; import { Card, CardContent } from "@/components/ui/card"; import { ImageUpload } from "@/components/dashboard/image-upload";
import { EducationService } from "@/src/services/education.service"; import { StorageService } from "@/src/services/storage.service"; import { STORAGE_PATHS } from "@/src/lib/constants";

const schema = z.object({ school: z.string().min(1), level_major_id: z.string().min(1), level_major_en: z.string().min(1), gpa: z.number().optional(), max_gpa: z.number().optional(), start_date: z.string().min(1), end_date: z.string().optional(), is_published: z.boolean() });
type FormData = z.infer<typeof schema>;

export default function EducationAddPage() {
  const router = useRouter(); const [logoFile, setLogoFile] = useState<File | null>(null);
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { is_published: false } });
  const onSubmit = async (data: FormData) => { try { let logo_url: string | null = null; if (logoFile) { const r = await StorageService.uploadImage(STORAGE_PATHS.EXPERIENCES, logoFile); logo_url = r.publicUrl; } await EducationService.create({ ...data, logo_url, detail_points: [] }); toast.success("Created"); router.push("/dashboard/educations"); } catch (e: unknown) { toast.error("Failed", { description: e instanceof Error ? e.message : undefined }); } };
  return (
    <><PageHeader title="Add Education" breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Educations", href: "/dashboard/educations" }, { label: "Add" }]} />
    <Card className="max-w-2xl border-neutral-200/60 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-neutral-900/80"><CardContent className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2"><Label>School</Label><Input {...register("school")} />{errors.school && <p className="text-xs text-red-500">{errors.school.message}</p>}</div>
        <div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label>Level / Major (ID)</Label><Input {...register("level_major_id")} /></div><div className="space-y-2"><Label>Level / Major (EN)</Label><Input {...register("level_major_en")} /></div></div>
        <div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label>GPA</Label><Input type="number" step="0.01" {...register("gpa")} /></div><div className="space-y-2"><Label>Max GPA</Label><Input type="number" step="0.01" {...register("max_gpa")} /></div></div>
        <div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label>Start Date</Label><Input type="date" {...register("start_date")} /></div><div className="space-y-2"><Label>End Date</Label><Input type="date" {...register("end_date")} /></div></div>
        <div className="space-y-2"><Label>School Logo</Label><ImageUpload accept="image" onChange={(f) => setLogoFile(f)} /></div>
        <div className="flex items-center gap-3"><Switch checked={watch("is_published")} onCheckedChange={(v) => setValue("is_published", v)} /><Label>Published</Label></div>
        <div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button><Button type="submit" disabled={isSubmitting} className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create</Button></div>
      </form>
    </CardContent></Card></>
  );
}
