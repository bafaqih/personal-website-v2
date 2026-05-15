"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Briefcase, Save, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUpload } from "@/components/dashboard/image-upload";
import { Skeleton } from "@/components/ui/skeleton";
import { BulletListInput } from "@/components/dashboard/bullet-list-input";
import { MultiSelectSkill } from "@/components/dashboard/multi-select-skill";
import { CareerService } from "@/src/services/career.service";
import { SkillService } from "@/src/services/skill.service";
import { StorageService } from "@/src/services/storage.service";
import { STORAGE_PATHS } from "@/src/lib/constants";

const schema = z.object({
  role_id: z.string().min(1, "Role (ID) is required"),
  role_en: z.string().min(1, "Role (EN) is required"),
  company: z.string().min(1, "Company is required"),
  url: z.string().nullable().optional(),
  location: z.string().optional(),
  type_id: z.string().optional(),
  type_en: z.string().optional(),
  model_id: z.string().optional(),
  model_en: z.string().optional(),
  start_date: z.string().min(1, "Start Date is required"),
  end_date: z.string().optional(),
  detail_points_id: z.array(z.string()).default([]),
  detail_points_en: z.array(z.string()).default([]),
  skill_ids: z.array(z.string()).default([]),
  is_published: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

export default function CareerEditPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string | null>(null);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSkills, setActiveSkills] = useState<{ id: string; name: string }[]>([]);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting, isValid, isDirty } } = useForm<FormData>({ 
    resolver: zodResolver(schema),
    mode: "onChange"
  });

  useEffect(() => {
    Promise.all([CareerService.getById(id), SkillService.getAll()])
      .then(([c, skills]) => {
        setActiveSkills(skills.filter(s => s.is_active).map(s => ({ id: s.id, name: s.name })));
        setCurrentLogoUrl(c.logo_url);
        
        const skillIds = c.career_skills?.map(cs => cs.skill_id) || [];
        
        reset({ 
          role_id: c.role_id, 
          role_en: c.role_en, 
          company: c.company, 
          url: c.url || "",
          location: c.location || "", 
          type_id: c.type_id || "", 
          type_en: c.type_en || "", 
          model_id: c.model_id || "", 
          model_en: c.model_en || "", 
          start_date: c.start_date, 
          end_date: c.end_date || "", 
          detail_points_id: c.detail_points_id || [],
          detail_points_en: c.detail_points_en || [],
          skill_ids: skillIds,
          is_published: c.is_published 
        });
      })
      .catch(() => toast.error("Failed to load"))
      .finally(() => setLoading(false));
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      let logo_url = currentLogoUrl;
      if (logoFile) { 
        const r = await StorageService.uploadImage(STORAGE_PATHS.EXPERIENCES, logoFile); 
        logo_url = r.publicUrl; 
      }
      const { skill_ids, ...careerData } = data;
      await CareerService.update(id, { ...careerData, logo_url }, skill_ids);
      toast.success("Career updated successfully"); 
      router.push("/dashboard/careers");
    } catch (e: unknown) { 
      toast.error("Failed to update", { description: e instanceof Error ? e.message : undefined }); 
    }
  };

  if (loading) return <><PageHeader title="Edit Career" icon={Briefcase} /><Skeleton className="h-64 w-full rounded-xl" /></>;

  return (
    <>
      <PageHeader 
        title="Edit Career" 
        icon={Briefcase}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" }, 
          { label: "Careers", href: "/dashboard/careers" }, 
          { label: "Edit" }
        ]} 
      />
      <Card className="w-full border-neutral-200/60 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-neutral-900/80">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Role (ID)</Label>
                <Input {...register("role_id")} placeholder="e.g., Software Engineer" />
                {errors.role_id && <p className="text-xs text-red-500">{errors.role_id.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Role (EN)</Label>
                <Input {...register("role_en")} placeholder="e.g., Software Engineer" />
                {errors.role_en && <p className="text-xs text-red-500">{errors.role_en.message}</p>}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Company</Label>
                <Input {...register("company")} placeholder="e.g., BAF Corp" />
                {errors.company && <p className="text-xs text-red-500">{errors.company.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Company URL</Label>
                <Input {...register("url")} placeholder="https://example.com" />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Location</Label>
                <Input {...register("location")} placeholder="e.g., Jakarta, Indonesia" />
              </div>
              <div className="space-y-2">
                <Label>Skills Used</Label>
                <MultiSelectSkill
                  options={activeSkills}
                  selected={watch("skill_ids")}
                  onChange={(val) => setValue("skill_ids", val, { shouldValidate: true, shouldDirty: true })}
                  placeholder="Select technical skills..."
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Type (ID)</Label>
                <Input {...register("type_id")} placeholder="e.g., Purna Waktu" />
              </div>
              <div className="space-y-2">
                <Label>Type (EN)</Label>
                <Input {...register("type_en")} placeholder="e.g., Full-time" />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Model (ID)</Label>
                <Input {...register("model_id")} placeholder="e.g., Jarak Jauh" />
              </div>
              <div className="space-y-2">
                <Label>Model (EN)</Label>
                <Input {...register("model_en")} placeholder="e.g., Remote" />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" {...register("start_date")} onClick={(e) => e.currentTarget.showPicker()} />
                {errors.start_date && <p className="text-xs text-red-500">{errors.start_date.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>End Date (leave empty if current)</Label>
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
                  placeholder="Deskripsikan tanggung jawab..."
                />
              </div>
              <div className="space-y-2">
                <Label>Detail Points (EN)</Label>
                <BulletListInput
                  id="detail_en"
                  value={watch("detail_points_en")}
                  onChange={(val) => setValue("detail_points_en", val, { shouldValidate: true, shouldDirty: true })}
                  placeholder="Describe your responsibilities..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Company Logo</Label>
              <ImageUpload 
                accept="image" 
                value={currentLogoUrl || undefined} 
                onChange={(f) => { setLogoFile(f); setIsImageChanged(true); if (!f) setCurrentLogoUrl(null); }} 
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Switch checked={watch("is_published")} onCheckedChange={(v) => setValue("is_published", v, { shouldValidate: true, shouldDirty: true })} />
              <Label>Published</Label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                <X className="mr-1.5 h-4 w-4" /> Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !isValid || (!isDirty && !isImageChanged)} className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                {isSubmitting ? (
                  <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Saving...</>
                ) : (
                  <><Save className="mr-1.5 h-4 w-4" /> Save Changes</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
