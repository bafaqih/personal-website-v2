"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Code2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/dashboard/image-upload";
import { SkillService } from "@/src/services/skill.service";
import { StorageService } from "@/src/services/storage.service";
import { STORAGE_PATHS } from "@/src/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";
import type { SkillCategory } from "@/src/types/database";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  category_id: z.string().min(1, "Category is required"),
  is_active: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export default function SkillEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [currentIconUrl, setCurrentIconUrl] = useState<string | null>(null);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting, isValid, isDirty } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    Promise.all([SkillService.getById(id), SkillService.getCategories()])
      .then(([skill, cats]) => {
        setCategories(cats);
        setCurrentIconUrl(skill.icon_url);
        reset({ name: skill.name, category_id: skill.category_id, is_active: skill.is_active });
      })
      .catch(() => toast.error("Failed to load skill"))
      .finally(() => setLoading(false));
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      let icon_url = currentIconUrl;
      if (iconFile) {
        const result = await StorageService.uploadImage(STORAGE_PATHS.SKILLS, iconFile);
        icon_url = result.publicUrl;
      }
      await SkillService.update(id, { ...data, icon_url });
      toast.success("Skill updated");
      router.push("/dashboard/skills/list");
    } catch (error: unknown) {
      toast.error("Failed to update", { description: error instanceof Error ? error.message : undefined });
    }
  };

  if (loading) return <><PageHeader title="Edit Skill" icon={Code2} /><Skeleton className="h-64 w-full rounded-xl" /></>;

  return (
    <>
      <PageHeader
        title="Edit Skill"
        icon={Code2}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Skills", href: "/dashboard/skills/list" },
          { label: "Edit" },
        ]}
      />
      <Card className="border-neutral-200/60 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-neutral-900/80">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input {...register("name")} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select onValueChange={(v) => setValue("category_id", v)} value={watch("category_id")}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (<SelectItem key={cat.id} value={cat.id}>{cat.name_en}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Icon</Label>
              <ImageUpload accept="image" value={currentIconUrl || undefined} onChange={(file) => { setIconFile(file); setIsImageChanged(true); if (!file) setCurrentIconUrl(null); }} />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={watch("is_active")} onCheckedChange={(v) => setValue("is_active", v)} />
              <Label>Active</Label>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !isValid || (!isDirty && !isImageChanged)} className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
