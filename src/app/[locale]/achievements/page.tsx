import { AchievementService } from "@/src/services/achievement.service";
import { LinksService } from "@/src/services/links.service";
import { AchievementsClient } from "./achievements-client";
import { MainHeader } from "@/src/components/main/main-header";
import { MainFooter } from "@/src/components/main/main-footer";
import type { MainLocale } from "@/src/lib/main-translations";
import { ScrollToTop } from "@/components/scroll-to-top";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const title = locale === "id" ? "Pencapaian | Fadil Bafagih" : "Achievements | Fadil Bafagih";
  const description = locale === "id"
    ? "Kumpulan pencapaian, sertifikat, lisensi, penghargaan, dan apresiasi saya secara lengkap."
    : "Showcase of my achievements, certificates, licenses, awards, and appreciation.";

  return {
    title,
    description,
  };
}

export default async function AchievementsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as MainLocale;

  // Fetch all required data concurrently
  const [achievements, types, categories, { about, contact }] = await Promise.all([
    AchievementService.getAll(),
    AchievementService.getTypes(),
    AchievementService.getCategories(),
    LinksService.getAll(),
  ]);

  // Filter only published achievements for the public page
  const publishedAchievements = achievements.filter((a) => a.is_published);

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-neutral-950 font-sans selection:bg-neutral-200 dark:selection:bg-neutral-800 transition-colors duration-300">
      <MainHeader locale={locale} hireMeEmail={contact?.email ?? null} />

      <main className="flex-1 w-full pt-14">
        <AchievementsClient
          achievements={publishedAchievements}
          types={types}
          categories={categories}
          locale={locale}
        />
      </main>

      <MainFooter
        about={about}
        contact={contact}
        locale={locale}
      />
      <ScrollToTop />
    </div>
  );
}
