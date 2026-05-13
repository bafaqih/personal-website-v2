"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AuthService } from "@/src/services/auth.service";
import { toast } from "sonner";
import { cn } from "@/src/app/lib/utils";

import logoBlack from "@/src/assets/images/fadilbaf-black.svg";
import logoWhite from "@/src/assets/images/fadilbaf-white.svg";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

/**
 * Admin login page — clean centered card with glassmorphism.
 * Matches the B&W minimalist design with theme-aware logo.
 */
export default function LoginPage() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await AuthService.signIn(data.email, data.password);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Login failed";
      toast.error("Login Failed", { description: message });
    }
  };

  const logo = resolvedTheme === "dark" ? logoWhite : logoBlack;

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 dark:bg-neutral-950">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-neutral-200/50 blur-3xl dark:bg-white/5" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-neutral-200/50 blur-3xl dark:bg-white/5" />
      </div>

      <Card className="relative w-full max-w-md border border-neutral-200/60 bg-white/80 shadow-xl shadow-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/80 dark:shadow-white/5">
        <CardHeader className="flex items-center pb-2 pt-8">
          {mounted && (
            <Image
              src={logo}
              alt="Fadil Bafagih"
              width={140}
              height={40}
              priority
            />
          )}
          <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
            Sign in to admin dashboard
          </p>
        </CardHeader>

        <CardContent className="px-8 pb-8 pt-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                {...register("email")}
                className={cn(errors.email && "border-red-500 focus-visible:ring-red-500")}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                {...register("password")}
                className={cn(
                  errors.password && "border-red-500 focus-visible:ring-red-500"
                )}
              />
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
