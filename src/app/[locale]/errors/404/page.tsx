import { Metadata } from "next";
import NotFoundErrorContent from "./NotFoundErrorContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isId = locale === "id";
  return {
    title: isId ? "Oops! Halaman Tidak Ditemukan | Fadil Bafagih" : "Oops! Page Not Found | Fadil Bafagih",
  };
}

export default function NotFoundErrorPage() {
  return <NotFoundErrorContent />;
}
