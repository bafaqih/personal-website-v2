"use client";

import { useState, useEffect, useRef, cloneElement } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { useTheme } from "next-themes";
import { Globe, MapPin, Download, Quote, LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react";
import { tMain, type MainLocale } from "@/src/lib/main-translations";
import type { Profile, Role, Contact, About, Statistics, Skill, SkillCategory } from "@/src/types/database";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GitHubCalendar } from "react-github-calendar";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

/** Verified badge (blue checkmark) */
function VerifiedBadge() {
  return (
    <svg className="h-5 w-5 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5a.749.749 0 01-1.041.208l-.115-.094-2.415-2.415a.75.75 0 111.06-1.06l1.77 1.767 3.825-5.74a.75.75 0 011.25.833z" />
    </svg>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    if (isInView) {
      const animation = animate(count, value, { duration: 2, ease: "easeOut" });
      return animation.stop;
    }
  }, [value, count, isInView]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

interface MainAboutProps {
  profile: Profile | null;
  roles: Role[];
  about: About | null;
  contact: Contact | null;
  statistics: Statistics;
  skills: Skill[];
  skillCategories: SkillCategory[];
  locale: MainLocale;
}

const sentenceVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

function TypingQuote({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { once: true });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isInView || !mounted) return;

    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [isInView, mounted, text]);

  return (
    <span ref={containerRef} className={`inline-block ${!mounted ? "opacity-0" : ""}`}>
      &ldquo;{mounted ? displayedText : text}&rdquo;
    </span>
  );
}

import { trackEvent } from "@/src/lib/track-event";

export function MainAbout({
  profile,
  roles,
  about,
  contact,
  statistics,
  skills,
  skillCategories,
  locale,
}: MainAboutProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Modals & States
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activityYear, setActivityYear] = useState<number>(() => new Date().getFullYear() || 2026);
  const [hoveredActivity, setHoveredActivity] = useState<{ date: string; count: number } | null>(null);

  const formatDate = (dateStr: string) => {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  const padActivityData = (data: Array<{ date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }>) => {
    const paddedData: Array<{ date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }> = [];
    const d = new Date(activityYear, 0, 1);
    const dataMap = new Map(data.map((item) => [item.date, item]));

    while (d.getFullYear() === activityYear) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;

      if (dataMap.has(dateStr)) {
        paddedData.push(dataMap.get(dateStr)!);
      } else {
        paddedData.push({
          date: dateStr,
          count: 0,
          level: 0,
        });
      }

      d.setDate(d.getDate() + 1);
    }
    return paddedData;
  };

  const bioText = locale === "id" ? about?.description_id : about?.description_en;
  const quotesText = locale === "id" ? about?.quotes_id : about?.quotes_en;
  const currentRole = roles.length > 0 
    ? (locale === "id" ? roles[currentRoleIndex]?.role_id : roles[currentRoleIndex]?.role_en)
    : "";

  useEffect(() => {
    if (roles.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [roles.length]);

  // Extract GitHub Username
  const githubUsername = contact?.github_url 
    ? contact.github_url.split("/").pop() || "FadilBaf" 
    : "FadilBaf";

  const githubChartUrl = `https://ghchart.rshah.org/${resolvedTheme === "dark" ? "10b981" : "10b981"}/${githubUsername}`;

  // Filter Active Skills & Categories
  const activeCategories = skillCategories.filter((c) => c.is_active);
  const activeSkills = skills.filter((s) => s.is_active && activeCategories.some(c => c.id === s.category_id));

  // Determine top 16 skills for the preview, and use Modal if more than 16
  const MAX_PREVIEW_SKILLS = 16;
  const hasMoreSkills = activeSkills.length > MAX_PREVIEW_SKILLS;
  
  // Filter for Modal
  const modalSkills = selectedCategory === "all"
    ? activeSkills
    : activeSkills.filter((s) => s.category_id === selectedCategory);

  return (
    <section className="w-full px-3.5 sm:px-12 md:px-24 lg:px-36 py-12 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: Profile, Stats, Quotes, CV, Github Activity */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* 1. Main Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-5 sm:p-6 rounded-2xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-900/50 flex flex-col gap-4"
          >
            {/* Top: Avatar & Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              {/* Avatar */}
              {profile?.photo_url && (
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                  className="cursor-pointer shrink-0"
                >
                  <div className="profile-photo-shimmer relative h-28 w-28 rounded-2xl overflow-hidden border-2 border-neutral-200 dark:border-white/15 bg-neutral-100 dark:bg-neutral-900">
                    {isImageLoading && (
                      <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 animate-pulse z-10" />
                    )}
                    <Image
                      src={profile.photo_url}
                      alt={profile.full_name || "Profile"}
                      fill
                      className="object-cover"
                      sizes="112px"
                      priority
                      onLoad={() => setIsImageLoading(false)}
                    />
                  </div>
                </motion.div>
              )}

              {/* Info */}
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left mt-1">
                <h2 className="text-[26px] leading-tight font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-1.5">
                  {profile?.full_name || "Fadil Bafagih"}
                  <VerifiedBadge />
                </h2>
                
                <div className="h-6 mt-1 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={currentRoleIndex}
                      initial={{ y: 12, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -12, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="text-[15px] font-regular text-neutral-500 dark:text-neutral-400"
                    >
                      {currentRole}
                    </motion.p>
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-2 mt-3.5 flex-wrap justify-center sm:justify-start w-full">
                  {contact?.location && (
                    <span className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-600 border border-neutral-200 dark:text-neutral-400 dark:border-white/10">
                      <MapPin className="h-3.5 w-3.5" />
                      {contact.location}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-600 border border-neutral-200 dark:text-neutral-400 dark:border-white/10">
                    <Globe className="h-3.5 w-3.5" />
                    Open to Remote
                  </span>
                </div>
              </div>
            </div>

            <hr className="border-neutral-200 dark:border-white/10" />

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-900/50 text-center">
                <span className="text-[22px] leading-none font-bold text-neutral-900 dark:text-white">
                  <AnimatedNumber value={statistics.total_projects || 0} />
                </span>
                <span className="text-[11px] text-neutral-500 mt-1.5 font-medium">{tMain(locale, "total_projects")}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-900/50 text-center">
                <span className="text-[22px] leading-none font-bold text-neutral-900 dark:text-white">
                  <AnimatedNumber value={statistics.total_achievements || 0} />
                </span>
                <span className="text-[11px] text-neutral-500 mt-1.5 font-medium">{tMain(locale, "total_achievements")}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-900/50 text-center">
                <span className="text-[22px] leading-none font-bold text-neutral-900 dark:text-white">
                  <AnimatedNumber value={about?.years_of_experience || 0} />
                </span>
                <span className="text-[11px] text-neutral-500 mt-1.5 font-medium">{tMain(locale, "years_experience")}</span>
              </div>
            </div>

            {/* Quotes */}
            {quotesText && (
              <div className="py-3 px-4 rounded-xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-900/50 text-center flex flex-col items-center justify-center">
                <div className="flex items-start gap-2 justify-center">
                  <Quote className="h-4.5 w-4.5 text-neutral-400 dark:text-neutral-500 shrink-0 mt-1" strokeWidth={1.5} />
                  <p className="text-[15px] font-medium text-neutral-900 dark:text-white font-sans leading-relaxed text-left">
                    <TypingQuote text={quotesText} />
                  </p>
                </div>
              </div>
            )}

            {/* Download CV Button */}
            {about?.cv_url && (
              <a
                href={about.cv_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("cv_download")}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-black px-4 py-3 text-[15px] font-semibold text-white transition-transform hover:scale-[1.02] dark:bg-white dark:text-neutral-900 cursor-pointer"
              >
                <Download className="h-5 w-5" />
                {tMain(locale, "download_cv")}
              </a>
            )}
          </motion.div>

          {/* 2. Github Activity Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-3"
          >
            {/* Header: Icon, Title & Year Nav (Outside the box) */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2.5">
                <GitHubIcon className="h-[22px] w-[22px] text-neutral-900 dark:text-white" />
                <h3 className="text-lg font-medium text-neutral-900 dark:text-white">{tMain(locale, "my_activity")}</h3>
              </div>
              <div className="flex items-center gap-3 select-none">
                 <button
                   onClick={() => setActivityYear((prev) => prev - 1)}
                   className="h-8 w-8 rounded-lg border border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-900/50 flex items-center justify-center text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white cursor-pointer transition-colors"
                 >
                   <ChevronLeft className="h-4 w-4" />
                 </button>
                 <span className="text-[15px] font-medium text-neutral-900 dark:text-white min-w-[36px] text-center">{activityYear}</span>
                 <button
                   onClick={() => setActivityYear((prev) => prev + 1)}
                   disabled={activityYear >= new Date().getFullYear()}
                   className="h-8 w-8 rounded-lg border border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-900/50 flex items-center justify-center text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                 >
                   <ChevronRight className="h-4 w-4" />
                 </button>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-900/50">
              <div className="w-full py-2 min-h-[140px] flex items-center">
                {mounted ? (
                  <GitHubCalendar
                    username={githubUsername}
                    year={activityYear}
                    transformData={padActivityData}
                    colorScheme={resolvedTheme === "dark" ? "dark" : "light"}
                    blockSize={11}
                    blockMargin={4}
                    fontSize={12}
                    labels={{
                      totalCount: hoveredActivity
                        ? (locale === "id"
                            ? `${hoveredActivity.count} kontribusi pada ${formatDate(hoveredActivity.date)}`
                            : `${hoveredActivity.count} contributions on ${formatDate(hoveredActivity.date)}`)
                        : (locale === "id"
                            ? `{{count}} kontribusi di {{year}}`
                            : `{{count}} contributions in {{year}}`),
                      legend: {
                        less: locale === "id" ? "Kurang" : "Less",
                        more: locale === "id" ? "Lebih" : "More"
                      }
                    }}
                    renderBlock={(block, activity) =>
                      cloneElement(block, {
                        onMouseEnter: () => setHoveredActivity({ date: activity.date, count: activity.count }),
                        onMouseLeave: () => setHoveredActivity(null)
                      })
                    }
                  />
                ) : (
                  <div className="w-full h-[120px] bg-neutral-100 dark:bg-neutral-800/50 animate-pulse rounded-xl" />
                )}
              </div>
            </div>
          </motion.div>

        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: About Me, Skills */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 flex flex-col gap-10">
          
          {/* About Me Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col"
          >
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2.5">
                <Globe className="h-[26px] w-[26px] text-neutral-900 dark:text-white" />
                <h2 className="text-[28px] leading-none font-medium tracking-tight text-neutral-900 dark:text-white">
                  {tMain(locale, "about_me")}
                </h2>
              </div>
              {about?.badge_en && (
                <p className="text-[15px] font-medium text-neutral-500 dark:text-neutral-400">
                  {locale === "id" ? about.badge_id : about.badge_en}
                </p>
              )}
            </div>
            
            <hr className="border-neutral-200 dark:border-white/10 my-5" />

            {bioText && (
              <div 
                className="prose prose-neutral dark:prose-invert max-w-none text-[15px] text-neutral-600 dark:text-neutral-400 leading-[1.8]"
                dangerouslySetInnerHTML={{ __html: bioText.replace(/\n/g, '<br />') }}
              />
            )}
          </motion.div>

          {/* Skills Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col"
          >
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2.5">
                <Globe className="h-[26px] w-[26px] text-neutral-900 dark:text-white" />
                <h2 className="text-[28px] leading-none font-mediumtracking-tight text-neutral-900 dark:text-white">
                  {tMain(locale, "skills")}
                </h2>
              </div>
              <p className="text-[15px] font-medium text-neutral-500 dark:text-neutral-400">
                {tMain(locale, "skills_desc")}
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-900/50 p-5 sm:p-6">
              
              {/* Category Nav */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`text-[13px] font-semibold transition-colors whitespace-nowrap px-4 py-1.5 rounded-xl ${
                    selectedCategory === "all"
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                  }`}
                >
                  {tMain(locale, "all_skills")}
                </button>
                {activeCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`text-[13px] font-semibold transition-colors whitespace-nowrap px-4 py-1.5 rounded-xl ${
                      selectedCategory === cat.id
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                    }`}
                  >
                    {locale === "id" ? cat.name_id : cat.name_en}
                  </button>
                ))}
              </div>

              {/* Skills Pills */}
              <div className="flex flex-wrap gap-2.5">
                {activeSkills.slice(0, MAX_PREVIEW_SKILLS).map((skill) => (
                  <div 
                    key={skill.id}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-800 shadow-sm text-[13px] font-medium text-neutral-700 dark:text-neutral-300 transition-colors hover:border-neutral-300 dark:hover:border-white/20"
                  >
                    {skill.icon_url ? (
                      <img src={skill.icon_url} alt={skill.name} className="w-3.5 h-3.5 object-contain" />
                    ) : (
                      <Globe className="w-3.5 h-3.5 text-neutral-400" />
                    )}
                    <span>{skill.name}</span>
                  </div>
                ))}
                
                {/* View All Pill */}
                {hasMoreSkills && (
                  <button
                    onClick={() => setIsSkillsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-200 bg-neutral-50 dark:bg-neutral-800/50 dark:border-white/5 text-[13px] font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-300 transition-colors cursor-pointer"
                  >
                    {tMain(locale, "view_all").replace("{count}", `+${activeSkills.length - MAX_PREVIEW_SKILLS}`)}
                  </button>
                )}
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Skills Modal using shadcn Dialog */}
      <Dialog open={isSkillsModalOpen} onOpenChange={setIsSkillsModalOpen}>
        <DialogContent className="max-w-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border-neutral-200/60 dark:border-white/10">
          <DialogHeader className="mb-4">
            <div className="flex items-center gap-3 mb-1">
              <LayoutGrid className="h-6 w-6 text-neutral-900 dark:text-white" />
              <DialogTitle className="text-2xl font-bold tracking-tight">
                {tMain(locale, "skills")}
              </DialogTitle>
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {tMain(locale, "skills_desc")}
            </p>
          </DialogHeader>
          
          <div className="flex flex-col gap-6">
            {/* Category Filters */}
            <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-neutral-200/60 dark:border-white/10">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                  selectedCategory === "all"
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-white/10"
                }`}
              >
                {tMain(locale, "all_skills")}
              </button>
              {activeCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-white/10"
                  }`}
                >
                  {locale === "id" ? cat.name_id : cat.name_en}
                </button>
              ))}
            </div>

            {/* Modal Skills List */}
            <div className="flex flex-wrap items-center gap-2.5 overflow-y-auto max-h-[60vh] pb-4">
              <AnimatePresence mode="popLayout">
                {modalSkills.map((skill) => (
                  <motion.div
                    key={skill.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-800 shadow-sm text-[13px] font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
                  >
                    {skill.icon_url ? (
                      <img src={skill.icon_url} alt={skill.name} className="w-4 h-4 object-contain" />
                    ) : (
                      <Globe className="w-4 h-4 text-neutral-400" />
                    )}
                    <span>{skill.name}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {modalSkills.length === 0 && (
                <p className="text-sm text-neutral-500 italic w-full text-center py-8">
                  No skills found in this category.
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
