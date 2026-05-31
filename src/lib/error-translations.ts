/**
 * Static translations for public error pages (e.g. 404, etc.)
 */

export type ErrorLocale = "en" | "id";

export interface ErrorTranslationKeys {
  oops_title: string;
  desc_404: string;
  go_home: string;
  go_back: string;
  switch_lang: string;
  theme_light: string;
  theme_dark: string;
}

const errorTranslations: Record<ErrorLocale, ErrorTranslationKeys> = {
  en: {
    oops_title: "Oops! Page Not Found",
    desc_404: "The page you're looking for might have been moved or doesn't exist.",
    go_home: "Take me Home",
    go_back: "Go Back",
    switch_lang: "Bahasa Indonesia",
    theme_light: "Light Mode",
    theme_dark: "Dark Mode",
  },
  id: {
    oops_title: "Oops! Halaman Tidak Ditemukan",
    desc_404: "Halaman yang Anda cari mungkin telah dipindahkan atau tidak ada.",
    go_home: "Kembali ke Beranda",
    go_back: "Kembali",
    switch_lang: "English",
    theme_light: "Mode Terang",
    theme_dark: "Mode Gelap",
  }
};

export function tError(locale: ErrorLocale, key: keyof ErrorTranslationKeys): string {
  const dict = errorTranslations[locale] || errorTranslations.en;
  return dict[key] || errorTranslations.en[key] || key;
}
