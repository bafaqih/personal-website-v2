import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isId = locale === "id";

  return {
    title: "Links | Fadil Bafagih",
    description: isId
      ? "Link in bio — Terhubung dengan Fadil Bafagih di semua platform."
      : "Link in bio — Connect with Fadil Bafagih across all platforms.",
    robots: { index: true, follow: true },
  };
}

/**
 * Layout for the /links page.
 * Adds custom LinksToaster for contact form toast feedback.
 */
export default function LinksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
