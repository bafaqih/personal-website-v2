import { LinksService } from "@/src/services/links.service";
import { MainHeader } from "@/src/components/main/main-header";
import { MainHero } from "@/src/components/main/main-hero";
import { MainFooter } from "@/src/components/main/main-footer";
import type { MainLocale } from "@/src/lib/main-translations";
import { ScrollToTop } from "@/components/scroll-to-top";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as MainLocale;
  const { profile, roles, about, contact } = await LinksService.getAll();

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-neutral-950 font-sans selection:bg-neutral-200 dark:selection:bg-neutral-800 transition-colors duration-300">
      <MainHeader locale={locale} hireMeEmail={contact?.email ?? null} />
      
      <main className="flex-1 w-full">
        <MainHero 
          profile={profile}
          roles={roles}
          about={about}
          contact={contact}
          locale={locale}
        />
        {/* Other sections like about me, skills, experience, project, achievement, blogs will go here in the future */}
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
