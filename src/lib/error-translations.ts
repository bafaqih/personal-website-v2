/**
 * Static translations for public error pages (e.g. 404, etc.)
 */

export type ErrorLocale = "en" | "id";

export interface ErrorTranslationKeys {
  oops_title: string;
  oops_title_500: string;
  desc_404: string;
  desc_500: string;
  go_home: string;
  go_back: string;
  try_again: string;
  switch_lang: string;
  theme_light: string;
  theme_dark: string;
}

const errorTranslations: Record<ErrorLocale, ErrorTranslationKeys> = {
  en: {
    oops_title: "Oops! Page Not Found",
    oops_title_500: "Oops! Something Went Wrong",
    desc_404: "The page you're looking for might have been moved or doesn't exist.",
    desc_500: "An internal server error occurred. Please try again or head back home.",
    go_home: "Take me Home",
    go_back: "Go Back",
    try_again: "Try Again",
    switch_lang: "Bahasa Indonesia",
    theme_light: "Light Mode",
    theme_dark: "Dark Mode",
  },
  id: {
    oops_title: "Oops! Halaman Tidak Ditemukan",
    oops_title_500: "Oops! Terjadi Kesalahan",
    desc_404: "Halaman yang Anda cari mungkin telah dipindahkan atau tidak ada.",
    desc_500: "Terjadi kesalahan server internal. Silakan coba lagi atau kembali ke beranda.",
    go_home: "Kembali ke Beranda",
    go_back: "Kembali",
    try_again: "Coba Lagi",
    switch_lang: "English",
    theme_light: "Mode Terang",
    theme_dark: "Mode Gelap",
  }
};

export function tError(locale: ErrorLocale, key: keyof ErrorTranslationKeys): string {
  const dict = errorTranslations[locale] || errorTranslations.en;
  return dict[key] || errorTranslations.en[key] || key;
}
