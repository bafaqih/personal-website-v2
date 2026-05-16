"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Trophy, Save, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ImageUpload } from "@/components/dashboard/image-upload";
import { Skeleton } from "@/components/ui/skeleton";
import { AchievementService } from "@/src/services/achievement.service";
import { StorageService } from "@/src/services/storage.service";
import { STORAGE_PATHS } from "@/src/lib/constants";
import type { AchievementType, AchievementCategory } from "@/src/types/database";

const schema = z.object({
  title_id: z.string().min(1, "Title (ID) is required"),
  title_en: z.string().min(1, "Title (EN) is required"),
  publisher: z.string().min(1, "Publisher is required"),
  issue_date: z.string().min(1, "Issue date is required"),
  credential_url: z.string().optional().or(z.literal("")),
  type_id: z.string().min(1, "Type is required"),
  category_id: z.string().min(1, "Category is required"),
  is_published: z.boolean()
});

type FormData = z.infer<typeof schema>;

export default function AchievementEditPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [types, setTypes] = useState<AchievementType[]>([]);
  const [categories, setCategories] = useState<AchievementCategory[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch, 
    reset, 
    formState: { errors, isSubmitting, isValid, isDirty } 
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  useEffect(() => {
    Promise.all([
      AchievementService.getById(id),
      AchievementService.getTypes(),
      AchievementService.getCategories()
    ]).then(([achievement, typeList, categoryList]) => {
      setTypes(typeList);
      setCategories(categoryList);
      setCurrentImageUrl(achievement.image_url);
      
      reset({
        title_id: achievement.title_id,
        title_en: achievement.title_en,
        publisher: achievement.publisher || "",
        issue_date: achievement.issue_date || "",
        credential_url: achievement.credential_url || "",
        type_id: achievement.type_id || "",
        category_id: achievement.category_id || "",
        is_published: achievement.is_published
      });
    }).catch(() => {
      toast.error("Failed to load achievement data");
    }).finally(() => {
      setLoading(false);
    });
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      let image_url = currentImageUrl;
      if (imageFile) {
        const r = await StorageService.uploadImage(STORAGE_PATHS.ACHIEVEMENTS, imageFile);
        image_url = r.publicUrl;
      }
      
      await AchievementService.update(id, { 
        ...data, 
        image_url,
        credential_url: data.credential_url || null
      });
      
      toast.success("Achievement updated successfully");
      router.push("/dashboard/achievements/list");
    } catch (e: unknown) {
      toast.error("Failed to update achievement", { 
        description: e instanceof Error ? e.message : "An unexpected error occurred" 
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Achievement" icon={Trophy} />
        <Card className="w-full border-neutral-200/60 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-neutral-900/80">
          <CardContent className="p-6 space-y-6">
            <Skeleton className="h-10 w-full" />
            <div className="grid gap-6 md:grid-cols-2">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <PageHeader 
        title="Edit Achievement" 
        icon={Trophy}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" }, 
          { label: "Achievements", href: "/dashboard/achievements/list" }, 
          { label: "Edit" }
        ]} 
      />
      
      <div className="w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card className="border-neutral-200/60 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-neutral-900/80">
            <CardContent className="p-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Title (ID)</Label>
                  <Input 
                    {...register("title_id")} 
                    placeholder="Judul sertifikat..."
                  />
                  {errors.title_id && <p className="text-xs text-red-500">{errors.title_id.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Title (EN)</Label>
                  <Input 
                    {...register("title_en")} 
                    placeholder="Certificate title..."
                  />
                  {errors.title_en && <p className="text-xs text-red-500">{errors.title_en.message}</p>}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Publisher</Label>
                  <Input 
                    {...register("publisher")} 
                    placeholder="e.g., Google, Microsoft, Udemy"
                  />
                  {errors.publisher && <p className="text-xs text-red-500">{errors.publisher.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Issue Date</Label>
                  <Input 
                    type="date" 
                    {...register("issue_date")} 
                    onClick={(e) => e.currentTarget.showPicker()}
                  />
                  {errors.issue_date && <p className="text-xs text-red-500">{errors.issue_date.message}</p>}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select 
                    onValueChange={(v) => setValue("type_id", v, { shouldValidate: true, shouldDirty: true })} 
                    value={watch("type_id")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map((t) => (
                        <SelectItem key={t.id} value={t.id}>{t.name_en}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type_id && <p className="text-xs text-red-500">{errors.type_id.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select 
                    onValueChange={(v) => setValue("category_id", v, { shouldValidate: true, shouldDirty: true })} 
                    value={watch("category_id")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name_en}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category_id && <p className="text-xs text-red-500">{errors.category_id.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Credential URL</Label>
                <Input 
                  {...register("credential_url")} 
                  placeholder="https://verify.example.com/certificate/123" 
                />
              </div>

              <div className="space-y-2">
                <Label>Certificate Image</Label>
                <ImageUpload 
                  accept="image" 
                  value={currentImageUrl || undefined}
                  onChange={(f) => {
                    setImageFile(f);
                    if (!f && !currentImageUrl) {
                      // Handled by ImageUpload component internal state usually
                    }
                  }} 
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Switch 
                  checked={watch("is_published")} 
                  onCheckedChange={(v) => setValue("is_published", v, { shouldDirty: true })} 
                />
                <Label>Published</Label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.back()}
                >
                  <X className="mr-1.5 h-4 w-4" /> Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !isValid || (!isDirty && !imageFile)} 
                  className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                >
                  {isSubmitting ? (
                    <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Saving...</>
                  ) : (
                    <><Save className="mr-1.5 h-4 w-4" /> Save Changes</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </>
  );
}
