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

    // About
    about_me: "About Me",
    about_subtitle: "Turning visions into creative digital realities",
    skills: "Skills",
    skills_desc: "Technologies and tools I master",
    total_projects: "Total Projects",
    total_achievements: "Achievements",
    years_experience: "Years of Experience",
    download_cv: "Download CV",
    my_activity: "My Activity",
    all_skills: "All",
    view_all: "View All",

    // Experiences
    experiences_title: "Experiences",
    experiences_desc: "My professional journey, work, education, and organizational history",
    tab_career: "Work Experience",
    tab_education: "Educational",
    tab_organizations: "Organizational",
    show_details: "Show details",
    hide_details: "Hide details",
    present: "Present",
    gpa: "GPA",
    year: "Year",
    years: "Years",
    month: "Month",
    months: "Months",
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

    // About
    about_me: "Tentang Saya",
    about_subtitle: "Mengubah visi menjadi realitas digital yang kreatif",
    skills: "Keahlian",
    skills_desc: "Teknologi dan alat yang saya kuasai",
    total_projects: "Total Proyek",
    total_achievements: "Pencapaian",
    years_experience: "Tahun Pengalaman",
    download_cv: "Unduh CV",
    my_activity: "Aktivitas Saya",
    all_skills: "Semua",
    view_all: "Lihat Semua",

    // Experiences
    experiences_title: "Pengalaman",
    experiences_desc: "Perjalanan profesional, pekerjaan, pendidikan, dan riwayat organisasi saya",
    tab_career: "Pengalaman Kerja",
    tab_education: "Pendidikan",
    tab_organizations: "Organisasi",
    show_details: "Tampilkan detail",
    hide_details: "Sembunyikan detail",
    present: "Sekarang",
    gpa: "IPK",
    year: "Tahun",
    years: "Tahun",
    month: "Bulan",
    months: "Bulan",
  },
};

export function tMain(locale: MainLocale, key: string): string {
  const dict = mainTranslations[locale] || mainTranslations.en;
  return dict[key] || mainTranslations.en[key] || key;
}
