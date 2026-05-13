"use client";
import { useEffect, useState } from "react"; import { useForm } from "react-hook-form"; import { zodResolver } from "@hookform/resolvers/zod"; import { z } from "zod"; import { Loader2 } from "lucide-react"; import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header"; import { Button } from "@/components/ui/button"; import { Input } from "@/components/ui/input"; import { Label } from "@/components/ui/label"; import { Card, CardContent } from "@/components/ui/card"; import { Skeleton } from "@/components/ui/skeleton";
import { ContactService } from "@/src/services/contact.service"; import type { Contact } from "@/src/types/database";

const schema = z.object({ email: z.string().email().optional().or(z.literal("")), instagram_url: z.string().optional(), tiktok_url: z.string().optional(), linkedin_url: z.string().optional(), github_url: z.string().optional(), whatsapp_url: z.string().optional(), location_id: z.string().optional(), location_en: z.string().optional() });
type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const [contact, setContact] = useState<Contact | null>(null); const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => { ContactService.get().then((data) => { setContact(data); if (data) reset(data as unknown as FormData); }).catch(() => toast.error("Failed")).finally(() => setLoading(false)); }, [reset]);

  const onSubmit = async (data: FormData) => { if (!contact) return; try { await ContactService.update(contact.id, data); toast.success("Contact updated"); } catch (e: unknown) { toast.error("Failed", { description: e instanceof Error ? e.message : undefined }); } };

  if (loading) return <><PageHeader title="Contact" /><div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}</div></>;

  return (
    <><PageHeader title="Contact" description="Edit your contact information and social links." breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Contact" }]} />
    <Card className="max-w-2xl border-neutral-200/60 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-neutral-900/80"><CardContent className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2"><Label>Email</Label><Input {...register("email")} type="email" placeholder="you@example.com" /></div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2"><Label>Location (ID)</Label><Input {...register("location_id")} /></div>
          <div className="space-y-2"><Label>Location (EN)</Label><Input {...register("location_en")} /></div>
        </div>
        <div className="space-y-2"><Label>GitHub URL</Label><Input {...register("github_url")} placeholder="https://github.com/..." /></div>
        <div className="space-y-2"><Label>LinkedIn URL</Label><Input {...register("linkedin_url")} placeholder="https://linkedin.com/in/..." /></div>
        <div className="space-y-2"><Label>Instagram URL</Label><Input {...register("instagram_url")} placeholder="https://instagram.com/..." /></div>
        <div className="space-y-2"><Label>TikTok URL</Label><Input {...register("tiktok_url")} placeholder="https://tiktok.com/@..." /></div>
        <div className="space-y-2"><Label>WhatsApp URL</Label><Input {...register("whatsapp_url")} placeholder="https://wa.me/..." /></div>
        <div className="flex justify-end"><Button type="submit" disabled={isSubmitting} className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save Changes</Button></div>
      </form>
    </CardContent></Card></>
  );
}
