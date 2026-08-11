import { ProjectService } from "@/src/services/project.service";
import { LinksService } from "@/src/services/links.service";
import { ProjectsClient } from "./projects-client";
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
  const title = locale === "id" ? "Proyek | Fadil Bafagih" : "Projects | Fadil Bafagih";
  const description = locale === "id"
    ? "Kumpulan karya terbaru dan proyek sampingan saya secara lengkap."
    : "Showcase of my work and side projects.";

  return {
    title,
    description,
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as MainLocale;

  // Fetch all required data concurrently
  const [projects, types, categories, { about, contact }] = await Promise.all([
    ProjectService.getAll(),
    ProjectService.getTypes(),
    ProjectService.getCategories(),
    LinksService.getAll(),
  ]);

  // Filter only published projects for the public page
  const publishedProjects = projects.filter((p) => p.is_published);

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-neutral-950 font-sans transition-colors duration-300">
      <MainHeader locale={locale} hireMeEmail={contact?.email ?? null} />

      <main className="w-full pt-14">
        <ProjectsClient
          projects={publishedProjects}
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
