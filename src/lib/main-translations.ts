export type MainLocale = "en" | "id";

const mainTranslations: Record<MainLocale, Record<string, string>> = {
  en: {
    // Header
    switch_lang: "Bahasa Indonesia",
    theme_light: "Light Mode",
    theme_dark: "Dark Mode",
    hire_me: "Hire Me",
    menu: "Menu",

    // Hero
    available: "Available for opportunities",
    hello: "Hello, i'm",
    lets_work: "Let's Work Together",
    lets_talk: "Let's Talk",
    view_projects: "View Projects",

    // Footer
    navigate: "NAVIGATE",
    get_in_touch: "GET IN TOUCH",
    newsletter: "NEWSLETTER",
    newsletter_desc: "Subscribe to get notified about my latest projects, achievements, and articles.",
    enter_email: "Enter your email",
    subscribe: "Subscribe",
    subscribing: "Subscribing...",
    newsletter_success: "Thank you for subscribing to my newsletter!",
    newsletter_error: "Please enter a valid email address.",
    all_rights: "All Rights Reserved.",
    build_with: "Build with",
    
    // Nav Links
    nav_home: "Home",
    nav_about: "About",
    nav_projects: "Projects",
    nav_achievements: "Achievements",
    nav_blogs: "Blogs",
    nav_contact: "Contact",
  },
  id: {
    // Header
    switch_lang: "English",
    theme_light: "Mode Terang",
    theme_dark: "Mode Gelap",
    hire_me: "Rekrut Saya",
    menu: "Menu",

    // Hero
    available: "Tersedia untuk peluang baru",
    hello: "Halo, saya",
    lets_work: "Mari Bekerja Sama",
    lets_talk: "Mari Bicara",
    view_projects: "Lihat Proyek",

    // Footer
    navigate: "NAVIGASI",
    get_in_touch: "HUBUNGI SAYA",
    newsletter: "BULETIN",
    newsletter_desc: "Berlangganan untuk mendapatkan pemberitahuan tentang proyek, pencapaian, dan artikel terbaru saya.",
    enter_email: "Masukkan email Anda",
    subscribe: "Berlangganan",
    subscribing: "Memproses...",
    newsletter_success: "Terima kasih telah berlangganan buletin saya!",
    newsletter_error: "Silakan masukkan alamat email yang valid.",
    all_rights: "Hak Cipta Dilindungi.",
    build_with: "Dibangun dengan",

    // Nav Links
    nav_home: "Beranda",
    nav_about: "Tentang",
    nav_projects: "Proyek",
    nav_achievements: "Pencapaian",
    nav_blogs: "Blog",
    nav_contact: "Kontak",
  },
};

export function tMain(locale: MainLocale, key: string): string {
  const dict = mainTranslations[locale] || mainTranslations.en;
  return dict[key] || mainTranslations.en[key] || key;
}
