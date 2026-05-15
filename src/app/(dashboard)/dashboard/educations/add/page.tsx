"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, GraduationCap, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUpload } from "@/components/dashboard/image-upload";
import { BulletListInput } from "@/components/dashboard/bullet-list-input";
import { EducationService } from "@/src/services/education.service";
import { StorageService } from "@/src/services/storage.service";
import { STORAGE_PATHS } from "@/src/lib/constants";

const schema = z.object({
  school: z.string().min(1, "School name is required"),
  location: z.string().optional(),
  url: z.string().nullable().optional(),
  level_major_id: z.string().min(1, "Level/Major (ID) is required"),
  level_major_en: z.string().min(1, "Level/Major (EN) is required"),
  gpa: z.string().optional().nullable(),
  max_gpa: z.string().optional().nullable(),
  start_date: z.string().min(1, "Start Date is required"),
  end_date: z.string().optional(),
  detail_points_id: z.array(z.string()).optional(),
  detail_points_en: z.array(z.string()).optional(),
  is_published: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export default function EducationAddPage() {
  const router = useRouter();
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting, isValid } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { is_published: true, detail_points_id: [], detail_points_en: [] },
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    try {
      let logo_url: string | null = null;
      if (logoFile) {
        const r = await StorageService.uploadImage(STORAGE_PATHS.EXPERIENCES, logoFile);
        logo_url = r.publicUrl;
      }

      const payload = {
        ...data,
        detail_points_id: data.detail_points_id || [],
        detail_points_en: data.detail_points_en || [],
        gpa: data.gpa ? Number(data.gpa) : null,
        max_gpa: data.max_gpa ? Number(data.max_gpa) : null,
        logo_url
      };

      await EducationService.create(payload);
      toast.success("Education created successfully");
      router.push("/dashboard/educations");
    } catch (e: unknown) {
      toast.error("Failed to create", { description: e instanceof Error ? e.message : undefined });
    }
  };

  return (
    <>
      <PageHeader
        title="Add Education"
        icon={GraduationCap}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Educations", href: "/dashboard/educations" },
          { label: "Add" },
        ]}
      />
      <Card className="w-full border-neutral-200/60 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-neutral-900/80">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>School</Label>
                <Input {...register("school")} placeholder="e.g., Universitas Indonesia" />
                {errors.school && <p className="text-xs text-red-500">{errors.school.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input {...register("location")} placeholder="e.g., Depok, Indonesia" />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>School URL</Label>
                <Input {...register("url")} placeholder="https://example.edu" />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Level / Major (ID)</Label>
                <Input {...register("level_major_id")} placeholder="e.g., S1 Ilmu Komputer" />
                {errors.level_major_id && <p className="text-xs text-red-500">{errors.level_major_id.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Level / Major (EN)</Label>
                <Input {...register("level_major_en")} placeholder="e.g., B.Sc. in Computer Science" />
                {errors.level_major_en && <p className="text-xs text-red-500">{errors.level_major_en.message}</p>}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>GPA</Label>
                <Input type="number" step="0.01" {...register("gpa")} placeholder="e.g., 3.85" />
              </div>
              <div className="space-y-2">
                <Label>Max GPA</Label>
                <Input type="number" step="0.01" {...register("max_gpa")} placeholder="e.g., 4.00" />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" {...register("start_date")} onClick={(e) => e.currentTarget.showPicker()} />
                {errors.start_date && <p className="text-xs text-red-500">{errors.start_date.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" {...register("end_date")} onClick={(e) => e.currentTarget.showPicker()} />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Detail Points (ID)</Label>
                <BulletListInput
                  id="detail_id"
                  value={watch("detail_points_id")}
                  onChange={(val) => setValue("detail_points_id", val, { shouldValidate: true, shouldDirty: true })}
                  placeholder="Ceritakan aktivitas, beasiswa, atau pengalaman studi..."
                />
              </div>
              <div className="space-y-2">
                <Label>Detail Points (EN)</Label>
                <BulletListInput
                  id="detail_en"
                  value={watch("detail_points_en")}
                  onChange={(val) => setValue("detail_points_en", val, { shouldValidate: true, shouldDirty: true })}
                  placeholder="Describe your activities, scholarships, or study experiences..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>School Logo</Label>
              <ImageUpload accept="image" onChange={(f) => setLogoFile(f)} />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Switch checked={watch("is_published")} onCheckedChange={(v) => setValue("is_published", v, { shouldValidate: true, shouldDirty: true })} />
              <Label>Published</Label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                <X className="mr-1.5 h-4 w-4" /> Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !isValid} className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                {isSubmitting ? (
                  <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Creating...</>
                ) : (
                  <><Plus className="mr-1.5 h-4 w-4" /> Create Education</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
