import { BlogService } from "@/src/services/blog.service";
import { LinksService } from "@/src/services/links.service";
import { BlogsClient } from "./blogs-client";
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
  const title = locale === "id" ? "Blog | Fadil Bafagih" : "Blogs | Fadil Bafagih";
  const description = locale === "id"
    ? "Tulisan, artikel, pemikiran, dan pembelajaran saya seputar dunia pemrograman dan teknologi."
    : "My writings, articles, thoughts, and learnings about programming and technology.";

  return {
    title,
    description,
  };
}

export default async function BlogsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as MainLocale;

  // Fetch all required data concurrently
  const [blogs, types, categories, { about, contact }] = await Promise.all([
    BlogService.getAll(),
    BlogService.getTypes(),
    BlogService.getCategories(),
    LinksService.getAll(),
  ]);

  // Filter only published blogs for the public page
  const publishedBlogs = blogs.filter((b) => b.is_published);

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-neutral-950 font-sans selection:bg-neutral-200 dark:selection:bg-neutral-800 transition-colors duration-300">
      <MainHeader locale={locale} hireMeEmail={contact?.email ?? null} />

      <main className="w-full pt-14">
        <BlogsClient
          blogs={publishedBlogs}
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
