"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Trophy, Plus, X, Save } from "lucide-react";
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

export default function AchievementAddPage() {
  const router = useRouter();
  const [types, setTypes] = useState<AchievementType[]>([]);
  const [categories, setCategories] = useState<AchievementCategory[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch, 
    formState: { errors, isSubmitting, isValid } 
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      is_published: true,
      title_id: "",
      title_en: "",
      publisher: "",
      issue_date: "",
      credential_url: "",
    }
  });

  useEffect(() => {
    AchievementService.getTypes().then(setTypes).catch(() => {});
    AchievementService.getCategories().then(setCategories).catch(() => {});
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      let image_url: string | null = null;
      if (imageFile) {
        const r = await StorageService.uploadImage(STORAGE_PATHS.ACHIEVEMENTS, imageFile);
        image_url = r.publicUrl;
      }
      
      await AchievementService.create({ 
        ...data, 
        image_url,
        credential_url: data.credential_url || null
      });
      
      toast.success("Achievement created successfully");
      router.push("/dashboard/achievements/list");
    } catch (e: unknown) {
      toast.error("Failed to create achievement", { 
        description: e instanceof Error ? e.message : "An unexpected error occurred" 
      });
    }
  };

  return (
    <>
      <PageHeader 
        title="Add Achievement" 
        icon={Trophy}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" }, 
          { label: "Achievements", href: "/dashboard/achievements/list" }, 
          { label: "Add" }
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
                  onChange={(f) => setImageFile(f)} 
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Switch 
                  checked={watch("is_published")} 
                  onCheckedChange={(v) => setValue("is_published", v)} 
                />
                <Label>Published</Label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" 
                  variant="outline" 
                  onClick={() => router.back()} className="gap-1.5">
                  <X className="h-4 w-4" /> Cancel
                </Button>
                <Button type="submit" 
                  disabled={isSubmitting || !isValid} 
                  className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 gap-1.5">
                  {isSubmitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Creating...</>
                  ) : (
                    <><Plus className="h-4 w-4" /> Create Achievement</>
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
