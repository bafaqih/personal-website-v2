"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Users, Save, X } from "lucide-react";
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
import { OrganizationService } from "@/src/services/organization.service";
import { StorageService } from "@/src/services/storage.service";
import { STORAGE_PATHS } from "@/src/lib/constants";

const schema = z.object({
  organization: z.string().min(1, "Organization name is required"),
  url: z.string().nullable().optional(),
  location: z.string().optional(),
  role_id: z.string().min(1, "Role (ID) is required"),
  role_en: z.string().min(1, "Role (EN) is required"),
  start_date: z.string().min(1, "Start Date is required"),
  end_date: z.string().optional(),
  detail_points_id: z.array(z.string()).optional(),
  detail_points_en: z.array(z.string()).optional(),
  is_published: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export default function OrganizationEditPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string | null>(null);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting, isValid, isDirty } } = useForm<FormData>({ 
    resolver: zodResolver(schema),
    mode: "onChange"
  });

  useEffect(() => {
    OrganizationService.getById(id)
      .then((o) => {
        setCurrentLogoUrl(o.logo_url);
        
        reset({ 
          organization: o.organization,
          url: o.url || "",
          location: o.location || "",
          role_id: o.role_id, 
          role_en: o.role_en, 
          start_date: o.start_date, 
          end_date: o.end_date || "", 
          detail_points_id: o.detail_points_id || [],
          detail_points_en: o.detail_points_en || [],
          is_published: o.is_published 
        });
      })
      .catch(() => toast.error("Failed to load organization"))
      .finally(() => setLoading(false));
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      let logo_url = currentLogoUrl;
      if (logoFile) { 
        const r = await StorageService.uploadImage(STORAGE_PATHS.EXPERIENCES, logoFile); 
        logo_url = r.publicUrl; 
      }
      
      const payload = {
        ...data,
        end_date: data.end_date || null,
        detail_points_id: data.detail_points_id || [],
        detail_points_en: data.detail_points_en || [],
        logo_url
      };
      
      await OrganizationService.update(id, payload);
      toast.success("Organization updated successfully"); 
      router.push("/dashboard/organizations");
    } catch (e: unknown) { 
      toast.error("Failed to update", { description: e instanceof Error ? e.message : undefined }); 
    }
  };

  if (loading) return <><PageHeader title="Edit Organization" icon={Users} /><Skeleton className="h-64 w-full rounded-xl" /></>;

  return (
    <>
      <PageHeader 
        title="Edit Organization" 
        icon={Users}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" }, 
          { label: "Organizations", href: "/dashboard/organizations" }, 
          { label: "Edit" }
        ]} 
      />
      <Card className="w-full border-neutral-200/60 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-neutral-900/80">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Organization Name</Label>
                <Input {...register("organization")} placeholder="e.g., Google Developer Student Clubs" />
                {errors.organization && <p className="text-xs text-red-500">{errors.organization.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input {...register("location")} placeholder="e.g., Jakarta, Indonesia" />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Organization URL</Label>
                <Input {...register("url")} placeholder="https://example.com" />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Role (ID)</Label>
                <Input {...register("role_id")} placeholder="e.g., Ketua Divisi IT" />
                {errors.role_id && <p className="text-xs text-red-500">{errors.role_id.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Role (EN)</Label>
                <Input {...register("role_en")} placeholder="e.g., Head of IT Division" />
                {errors.role_en && <p className="text-xs text-red-500">{errors.role_en.message}</p>}
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
                  value={watch("detail_points_id") || []}
                  onChange={(val) => setValue("detail_points_id", val, { shouldValidate: true, shouldDirty: true })}
                  placeholder="Ceritakan tanggung jawab atau kontribusi Anda..."
                />
              </div>
              <div className="space-y-2">
                <Label>Detail Points (EN)</Label>
                <BulletListInput
                  id="detail_en"
                  value={watch("detail_points_en") || []}
                  onChange={(val) => setValue("detail_points_en", val, { shouldValidate: true, shouldDirty: true })}
                  placeholder="Describe your responsibilities or contributions..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Organization Logo</Label>
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
              <Button type="button" variant="outline" onClick={() => router.back()} className="gap-1.5">
                <X className="h-4 w-4" /> Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !isValid || (!isDirty && !isImageChanged)} className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 gap-1.5">
                {isSubmitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                ) : (
                  <><Save className="h-4 w-4" /> Save Changes</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
