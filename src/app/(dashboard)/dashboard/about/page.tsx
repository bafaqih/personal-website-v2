"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, User, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUpload } from "@/components/dashboard/image-upload";
import { AboutService } from "@/src/services/about.service";
import { StorageService } from "@/src/services/storage.service";
import { STORAGE_PATHS } from "@/src/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";
import type { About } from "@/src/types/database";

const aboutSchema = z.object({
  description_id: z.string().nullable().optional(),
  description_en: z.string().nullable().optional(),
  badge_id: z.string().nullable().optional(),
  badge_en: z.string().nullable().optional(),
  bio_id: z.string().nullable().optional(),
  bio_en: z.string().nullable().optional(),
  quotes_id: z.string().nullable().optional(),
  quotes_en: z.string().nullable().optional(),
  years_of_experience: z.coerce.number().min(0).optional(),
});

type AboutForm = z.infer<typeof aboutSchema>;

/**
 * About page — inline edit for single-record about data.
 */
export default function AboutPage() {
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<AboutForm>({
    resolver: zodResolver(aboutSchema) as any,
  });

  useEffect(() => {
    AboutService.get()
      .then((data) => {
        setAbout(data);
        if (data) reset(data as unknown as AboutForm);
      })
      .catch(() => toast.error("Failed to load about data"))
      .finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (data: AboutForm) => {
    if (!about) return;
    try {
      let cv_url = about.cv_url;
      if (cvFile) {
        const result = await StorageService.uploadPdf(STORAGE_PATHS.DOCUMENTS, cvFile, "CV-Hasan-Fadlullah");
        cv_url = result.publicUrl;
      }
      await AboutService.update(about.id, { ...data, cv_url });
      toast.success("About updated successfully");
      reset(data); // Mark as not dirty after successful save
      setCvFile(null);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update";
      toast.error("Update Failed", { description: message });
    }
  };

  const onInvalid = (errors: any) => {
    console.error("Form Validation Errors:", errors);
    toast.error("Validation Error", {
      description: "Please check all fields and try again.",
    });
  };

  if (loading) {
    return (
      <>
        <PageHeader title="About" />
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="About"
        description="Edit your personal information and bio."
        icon={User}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "About" },
        ]}
      />

      <Card className="border-neutral-200/60 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-neutral-900/80">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Badge (ID)</Label>
                <Input {...register("badge_id")} placeholder="e.g., Full-Stack Developer" />
              </div>
              <div className="space-y-2">
                <Label>Badge (EN)</Label>
                <Input {...register("badge_en")} placeholder="e.g., Full-Stack Developer" />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Bio (ID)</Label>
                <Textarea {...register("bio_id")} rows={3} placeholder="Short bio in Indonesian" />
              </div>
              <div className="space-y-2">
                <Label>Bio (EN)</Label>
                <Textarea {...register("bio_en")} rows={3} placeholder="Short bio in English" />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Description (ID)</Label>
                <Textarea {...register("description_id")} rows={4} placeholder="Full description in Indonesian" />
              </div>
              <div className="space-y-2">
                <Label>Description (EN)</Label>
                <Textarea {...register("description_en")} rows={4} placeholder="Full description in English" />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Quotes (ID)</Label>
                <Input {...register("quotes_id")} placeholder="Motivational quote in Indonesian" />
              </div>
              <div className="space-y-2">
                <Label>Quotes (EN)</Label>
                <Input {...register("quotes_en")} placeholder="Motivational quote in English" />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Years of Experience</Label>
                <Input type="number" {...register("years_of_experience")} />
              </div>
              <div className="space-y-2">
                <Label>CV / Resume (PDF)</Label>
                <ImageUpload
                  accept="pdf"
                  value={about?.cv_url || undefined}
                  onChange={(file) => setCvFile(file)}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting || (!isDirty && !cvFile)}
                className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-1.5 h-4 w-4" />
                    Save
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
