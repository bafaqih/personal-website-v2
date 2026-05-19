"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, User } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUpload } from "@/components/dashboard/image-upload";
import { PdfViewerModal } from "@/components/dashboard/pdf-viewer-modal";
import { AboutService } from "@/src/services/about.service";
import { StorageService } from "@/src/services/storage.service";
import { STORAGE_PATHS } from "@/src/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/context/language-context";

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
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [viewPdfUrl, setViewPdfUrl] = useState<string | null>(null);

  const { data: about, isLoading } = useQuery({
    queryKey: ["about"],
    queryFn: AboutService.get,
    meta: { resource: "sidebar.About" },
  });

  const loading = isLoading;

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<AboutForm>({
    resolver: zodResolver(aboutSchema) as any,
  });

  useEffect(() => {
    if (about) {
      reset(about as unknown as AboutForm);
    }
  }, [about, reset]);

  const onSubmit = async (data: AboutForm) => {
    if (!about) return;
    try {
      let cv_url = about.cv_url;
      if (cvFile) {
        const result = await StorageService.uploadPdf(STORAGE_PATHS.DOCUMENTS, cvFile, "CV-Hasan-Fadlullah");
        cv_url = result.publicUrl;
      }
      await AboutService.update(about.id, { ...data, cv_url });
      toast.success(t("about.saved_success"));
      queryClient.invalidateQueries({ queryKey: ["about"] });
      reset(data); // Mark as not dirty after successful save
      setCvFile(null);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t("about.saved_failed");
      toast.error(t("about.saved_failed"), { description: message });
    }
  };

  const onInvalid = (errors: any) => {
    console.error("Form Validation Errors:", errors);
    toast.error(t("common.failed"), {
      description: t("common.required_field"),
    });
  };

  return (
    <>
      <PageHeader
        title={t("about.title")}
        description={t("about.description")}
        icon={User}
        breadcrumbs={[
          { label: t("dashboard.title"), href: "/dashboard" },
          { label: t("sidebar.About") },
        ]}
      />

      <Card className="border-neutral-200/60 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-neutral-900/80">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{t("about.badge")} (ID)</Label>
                {loading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Input {...register("badge_id")} placeholder="e.g., Full-Stack Developer" />
                )}
              </div>
              <div className="space-y-2">
                <Label>{t("about.badge")} (EN)</Label>
                {loading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Input {...register("badge_en")} placeholder="e.g., Full-Stack Developer" />
                )}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{t("about.bio")} (ID)</Label>
                {loading ? (
                  <Skeleton className="h-20 w-full" />
                ) : (
                  <Textarea {...register("bio_id")} rows={3} placeholder="Short bio in Indonesian" />
                )}
              </div>
              <div className="space-y-2">
                <Label>{t("about.bio")} (EN)</Label>
                {loading ? (
                  <Skeleton className="h-20 w-full" />
                ) : (
                  <Textarea {...register("bio_en")} rows={3} placeholder="Short bio in English" />
                )}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{t("about.desc")} (ID)</Label>
                {loading ? (
                  <Skeleton className="h-24 w-full" />
                ) : (
                  <Textarea {...register("description_id")} rows={4} placeholder="Full description in Indonesian" />
                )}
              </div>
              <div className="space-y-2">
                <Label>{t("about.desc")} (EN)</Label>
                {loading ? (
                  <Skeleton className="h-24 w-full" />
                ) : (
                  <Textarea {...register("description_en")} rows={4} placeholder="Full description in English" />
                )}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{t("about.quotes")} (ID)</Label>
                {loading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Input {...register("quotes_id")} placeholder="Motivational quote in Indonesian" />
                )}
              </div>
              <div className="space-y-2">
                <Label>{t("about.quotes")} (EN)</Label>
                {loading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Input {...register("quotes_en")} placeholder="Motivational quote in English" />
                )}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{t("about.experience")}</Label>
                {loading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Input type="number" {...register("years_of_experience")} />
                )}
              </div>
              <div className="space-y-2">
                <Label>{t("about.cv")}</Label>
                {loading ? (
                  <Skeleton className="h-32 w-full" />
                ) : (
                  <ImageUpload
                    accept="pdf"
                    value={about?.cv_url || undefined}
                    onChange={(file) => setCvFile(file)}
                    onViewPdf={(url) => setViewPdfUrl(url)}
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end">
              {loading ? (
                <Skeleton className="h-10 w-32" />
              ) : (
                <Button type="submit"
                  disabled={isSubmitting || (!isDirty && !cvFile)}
                  className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 gap-1.5 cursor-pointer">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t("common.saving")}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      {t("common.save_changes")}
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {viewPdfUrl && (
        <PdfViewerModal
          isOpen={!!viewPdfUrl}
          onClose={() => setViewPdfUrl(null)}
          pdfUrl={viewPdfUrl}
          fileName="CV-Hasan-Fadlullah.pdf"
        />
      )}
    </>
  );
}
