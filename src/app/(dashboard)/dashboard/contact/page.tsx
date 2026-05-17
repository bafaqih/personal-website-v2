"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Mail, Save } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ContactService } from "@/src/services/contact.service";
import type { Contact } from "@/src/types/database";

const schema = z.object({
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  instagram_url: z.string().optional().or(z.literal("")),
  tiktok_url: z.string().optional().or(z.literal("")),
  linkedin_url: z.string().optional().or(z.literal("")),
  github_url: z.string().optional().or(z.literal("")),
  whatsapp_url: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal(""))
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);

  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors, isSubmitting, isDirty } 
  } = useForm<FormData>({ 
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      instagram_url: "",
      tiktok_url: "",
      linkedin_url: "",
      github_url: "",
      whatsapp_url: "",
      location: ""
    }
  });

  useEffect(() => {
    ContactService.get()
      .then((data) => {
        setContact(data);
        if (data) {
          const initialData = {
            email: data.email || "",
            instagram_url: data.instagram_url || "",
            tiktok_url: data.tiktok_url || "",
            linkedin_url: data.linkedin_url || "",
            github_url: data.github_url || "",
            whatsapp_url: data.whatsapp_url || "",
            location: data.location || ""
          };
          reset(initialData);
        }
      })
      .catch(() => toast.error("Failed to load contact information"))
      .finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (data: FormData) => {
    try {
      if (contact) {
        await ContactService.update(contact.id, data);
        toast.success("Contact information updated successfully");
      } else {
        const newContact = await ContactService.create(data);
        setContact(newContact);
        toast.success("Contact information created successfully");
      }
      reset(data); 
    } catch (e: unknown) {
      toast.error("Failed to update contact information", { 
        description: e instanceof Error ? e.message : "An unexpected error occurred" 
      });
    }
  };

  const onInvalid = (errors: any) => {
    console.error("Form Errors:", errors);
    toast.error("Validation Error", {
      description: "Please check your inputs, especially the email format."
    });
  };

  return (
    <>
      <PageHeader 
        title="Contact" 
        icon={Mail}
        description="Edit your contact information and social links."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" }, 
          { label: "Contact" }
        ]} 
      />
      
      <div className="w-full">
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
          <Card className="border-neutral-200/60 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-neutral-900/80">
            <CardContent className="p-6 space-y-6">
              {/* Primary Info */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Email</Label>
                  {loading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Input 
                      {...register("email")} 
                      type="text" 
                      placeholder="e.g., mail@example.com" 
                    />
                  )}
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>WhatsApp URL</Label>
                  {loading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Input 
                      {...register("whatsapp_url")} 
                      placeholder="e.g., https://wa.me/628123456789" 
                    />
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label>Location</Label>
                {loading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Input 
                    {...register("location")} 
                    placeholder="e.g., Jakarta, Indonesia" 
                  />
                )}
              </div>

              {/* Social Links */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>GitHub URL</Label>
                  {loading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Input 
                      {...register("github_url")} 
                      placeholder="https://github.com/username" 
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn URL</Label>
                  {loading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Input 
                      {...register("linkedin_url")} 
                      placeholder="https://linkedin.com/in/username" 
                    />
                  )}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Instagram URL</Label>
                  {loading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Input 
                      {...register("instagram_url")} 
                      placeholder="https://instagram.com/username" 
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <Label>TikTok URL</Label>
                  {loading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Input 
                      {...register("tiktok_url")} 
                      placeholder="https://tiktok.com/@username" 
                    />
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                {loading ? (
                  <Skeleton className="h-10 w-32 ml-auto" />
                ) : (
                  <Button type="submit" 
                    disabled={isSubmitting || !isDirty} 
                    className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 gap-1.5">
                    {isSubmitting ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                    ) : (
                      <><Save className="h-4 w-4" /> Save Changes</>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </>
  );
}
