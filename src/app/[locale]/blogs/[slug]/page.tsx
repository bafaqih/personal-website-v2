import { BlogService } from "@/src/services/blog.service";
import { LinksService } from "@/src/services/links.service";
import { notFound } from "next/navigation";
import { BlogDetailClient } from "./blog-detail-client";
import { MainHeader } from "@/src/components/main/main-header";
import { MainFooter } from "@/src/components/main/main-footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import type { MainLocale } from "@/src/lib/main-translations";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  try {
    const blog = await BlogService.getBySlug(slug);
    if (!blog || !blog.is_published) {
      return {};
    }

    const title = locale === "id"
      ? `${blog.title_id} | Blog Fadil Bafagih`
      : `${blog.title_en} | Blog by Fadil Bafagih`;
    const description = locale === "id"
      ? blog.title_id
      : blog.title_en;

    const ogImage = blog.image_url || "/opengraph-image.png";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [{ url: ogImage }],
      },
    };
  } catch {
    return {};
  }
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as MainLocale;

  let blog;
  try {
    blog = await BlogService.getBySlug(slug);
  } catch {
    notFound();
  }

  if (!blog || !blog.is_published) {
    notFound();
  }

  const { about, contact } = await LinksService.getAll();

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-neutral-950 font-sans transition-colors duration-300">
      <MainHeader locale={locale} hireMeEmail={contact?.email ?? null} />

      <main className="w-full pt-14">
        <BlogDetailClient
          blog={blog}
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
