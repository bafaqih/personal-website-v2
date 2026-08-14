"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  ArrowLeft, 
  Globe, 
  PlayCircle, 
  Share2, 
  Star, 
  Image as ImageIcon, 
  Code2, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { LinksShareModal } from "@/src/components/links/links-share-modal";
import { tMain, type MainLocale } from "@/src/lib/main-translations";
import type { Project, Contact } from "@/src/types/database";
import { trackEvent } from "@/src/lib/track-event";
import { cn } from "@/src/app/lib/utils";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

interface ProjectDetailClientProps {
  project: Project;
  contact: Contact | null;
  locale: MainLocale;
}

export function ProjectDetailClient({ project, contact, locale }: ProjectDetailClientProps) {
  const [shareOpen, setShareOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const bottomStripRef = useRef<HTMLDivElement>(null);

  const images = project.project_images || [];
  const hasMultiple = images.length > 1;

  // Sync scroll on thumbnail reel
  useEffect(() => {
    if (bottomStripRef.current) {
      const activeElement = bottomStripRef.current.children[currentIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [currentIndex]);

  // Format date
  const formatDate = (dateStr: string | null, activeLocale: MainLocale): string => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(activeLocale === "en" ? "en-US" : "id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Helper to render bold text split by **
  const renderBoldText = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return (
          <strong key={i} className="font-semibold text-neutral-800 dark:text-neutral-200">
            {part}
          </strong>
        );
      }
      return part;
    });
  };

  const title = locale === "id" ? project.title_id : project.title_en;
  const bio = locale === "id" ? project.bio_id : project.bio_en;
  const overview = locale === "id" ? project.overview_id : project.overview_en;
  const formattedDate = formatDate(project.project_date, locale);

  const challengeIntro = locale === "id" ? project.challenge_intro_id : project.challenge_intro_en;
  const challengePoints = locale === "id" ? project.challenge_points_id : project.challenge_points_en;

  const resultIntro = locale === "id" ? project.result_intro_id : project.result_intro_en;
  const resultPoints = locale === "id" ? project.result_points_id : project.result_points_en;

  const lessonIntro = locale === "id" ? project.lesson_intro_id : project.lesson_intro_en;
  const lessonPoints = locale === "id" ? project.lesson_points_id : project.lesson_points_en;

  return (
    <div className="w-full px-3.5 sm:px-12 md:px-24 lg:px-36 py-8 bg-transparent flex flex-col">
      {/* 1. Back button */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link 
          href={`/${locale}/projects`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{tMain(locale, "back")}</span>
        </Link>
      </motion.div>

      {/* 2. Title & Bio */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mt-5 text-left"
      >
        <h1 className="text-[28px] leading-tight font-bold tracking-tight text-neutral-900 dark:text-white">
          {title}
        </h1>
        {bio && (
          <p className="text-[15px] font-regular text-neutral-500 dark:text-neutral-400 mt-2">
            {bio}
          </p>
        )}
      </motion.div>

      {/* 3. Metadata & Action Row */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-5 border-b border-neutral-200 dark:border-white/10 mt-6"
      >
        {/* Left: Metadata */}
        <div className="flex flex-wrap items-center gap-8 md:gap-12">
          <div>
            <span className="block text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              {tMain(locale, "type_label")}
            </span>
            <span className="text-[13px] font-semibold text-neutral-800 dark:text-neutral-200 mt-1 block">
              {(locale === "id" ? project.type?.name_id : project.type?.name_en) || "-"}
            </span>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              {tMain(locale, "category_label")}
            </span>
            <span className="text-[13px] font-semibold text-neutral-800 dark:text-neutral-200 mt-1 block">
              {(locale === "id" ? project.category?.name_id : project.category?.name_en) || "-"}
            </span>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              {tMain(locale, "date_label")}
            </span>
            <span className="text-[13px] font-semibold text-neutral-800 dark:text-neutral-200 mt-1 block">
              {formattedDate || "-"}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("project_click", project.slug + "-source")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition-colors cursor-pointer"
            >
              <GithubIcon className="h-4 w-4" />
              <span>{tMain(locale, "source_code")}</span>
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("project_click", project.slug + "-live")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition-colors cursor-pointer"
            >
              <Globe className="h-4 w-4" />
              <span>{tMain(locale, "live_demo")}</span>
            </a>
          )}
          {project.video_url && (
            <a
              href={project.video_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("project_click", project.slug + "-video")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition-colors cursor-pointer"
            >
              <PlayCircle className="h-4 w-4" />
              <span>{tMain(locale, "video_demo")}</span>
            </a>
          )}
          <button
            onClick={() => {
              setShareOpen(true);
              trackEvent("project_click", project.slug + "-share");
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition-colors cursor-pointer"
          >
            <Share2 className="h-4 w-4" />
            <span>{tMain(locale, "share")}</span>
          </button>
        </div>
      </motion.div>

      {/* 4. Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-8">
        
        {/* Kolom Kiri: Deskripsi & Deep Dives */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="lg:col-span-7 text-left space-y-8"
        >
          {/* Overview */}
          {overview && (
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                {tMain(locale, "overview")}
              </h2>
              <p className="text-xs sm:text-sm font-normal text-neutral-500 dark:text-neutral-400 leading-relaxed whitespace-pre-line">
                {overview}
              </p>
            </div>
          )}

          {/* Challenges & Solutions */}
          {(challengeIntro || (challengePoints && challengePoints.length > 0)) && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                {tMain(locale, "challenges_solutions")}
              </h2>
              {challengeIntro && (
                <p className="text-xs sm:text-sm font-normal text-neutral-500 dark:text-neutral-400 leading-relaxed whitespace-pre-line">
                  {challengeIntro}
                </p>
              )}
              {challengePoints && challengePoints.length > 0 && (
                <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                  {challengePoints.map((pt, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {renderBoldText(pt)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Key Responsibilities */}
          {project.project_responsibilities && project.project_responsibilities.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                {tMain(locale, "key_responsibilities")}
              </h2>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                {project.project_responsibilities.map((resp) => (
                  <li key={resp.id} className="leading-relaxed">
                    {locale === "id" ? resp.content_id : resp.content_en}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Result & Outcomes */}
          {(resultIntro || (resultPoints && resultPoints.length > 0)) && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                {tMain(locale, "result_outcomes")}
              </h2>
              {resultIntro && (
                <p className="text-xs sm:text-sm font-normal text-neutral-500 dark:text-neutral-400 leading-relaxed whitespace-pre-line">
                  {resultIntro}
                </p>
              )}
              {resultPoints && resultPoints.length > 0 && (
                <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                  {resultPoints.map((pt, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {renderBoldText(pt)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Lessons Learned */}
          {(lessonIntro || (lessonPoints && lessonPoints.length > 0)) && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                {tMain(locale, "lessons_learned")}
              </h2>
              {lessonIntro && (
                <p className="text-xs sm:text-sm font-normal text-neutral-500 dark:text-neutral-400 leading-relaxed whitespace-pre-line">
                  {lessonIntro}
                </p>
              )}
              {lessonPoints && lessonPoints.length > 0 && (
                <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                  {lessonPoints.map((pt, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {renderBoldText(pt)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Technologies Used */}
          {project.project_skills && project.project_skills.length > 0 && (
            <div className="space-y-3 pt-2">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                {tMain(locale, "technologies_used")}
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.project_skills.map(({ skill_id, skill }) => {
                  if (!skill) return null;
                  return (
                    <div
                      key={skill_id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/40 text-xs text-neutral-700 dark:text-neutral-300 select-none shadow-sm"
                    >
                      {skill.icon_url ? (
                        <img 
                          src={skill.icon_url} 
                          alt={skill.name} 
                          className="h-3.5 w-3.5 object-contain filter dark:invert" 
                        />
                      ) : (
                        <Code2 className="h-3.5 w-3.5 text-neutral-400" />
                      )}
                      <span className="font-medium">{skill.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>

        {/* Kolom Rantai Kanan: Carousel & Card stats */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-5 space-y-6"
        >
          {/* Carousel */}
          <div className="w-full flex flex-col">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center group shadow-md select-none">
              {images.length > 0 ? (
                <>
                  <img
                    src={images[currentIndex].image_url}
                    alt={`Project Image ${currentIndex + 1}`}
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                  {hasMultiple && (
                    <>
                      {/* Left arrow */}
                      <button
                        onClick={() => setCurrentIndex((prev) => prev - 1)}
                        disabled={currentIndex === 0}
                        className={cn(
                          "absolute left-3.5 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 rounded-xl",
                          "bg-white/75 dark:bg-neutral-800/75 backdrop-blur-md",
                          "border border-neutral-300 dark:border-neutral-600 shadow-md",
                          "text-neutral-950 dark:text-neutral-50",
                          "transition-all duration-200 outline-none",
                          currentIndex === 0
                            ? "opacity-0 cursor-not-allowed pointer-events-none"
                            : "hover:bg-white/90 dark:hover:bg-neutral-800/90 active:scale-95 cursor-pointer opacity-100"
                        )}
                        title="Previous Image"
                      >
                        <ChevronLeft className="w-4.5 h-4.5 stroke-[2.5]" />
                      </button>

                      {/* Right arrow */}
                      <button
                        onClick={() => setCurrentIndex((prev) => prev + 1)}
                        disabled={currentIndex === images.length - 1}
                        className={cn(
                          "absolute right-3.5 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 rounded-xl",
                          "bg-white/75 dark:bg-neutral-800/75 backdrop-blur-md",
                          "border border-neutral-300 dark:border-neutral-600 shadow-md",
                          "text-neutral-950 dark:text-neutral-50",
                          "transition-all duration-200 outline-none",
                          currentIndex === images.length - 1
                            ? "opacity-0 cursor-not-allowed pointer-events-none"
                            : "hover:bg-white/90 dark:hover:bg-neutral-800/90 active:scale-95 cursor-pointer opacity-100"
                        )}
                        title="Next Image"
                      >
                        <ChevronRight className="w-4.5 h-4.5 stroke-[2.5]" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 gap-3 text-center">
                  <ImageIcon className="w-10 h-10 text-neutral-300 dark:text-neutral-700 stroke-[1.5]" />
                  <span className="text-xs text-neutral-400">No images available</span>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {hasMultiple && (
              <div className="w-full mt-3.5">
                <div
                  ref={bottomStripRef}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-xl",
                    "bg-neutral-50 dark:bg-neutral-900/50",
                    "border border-neutral-200 dark:border-white/10 shadow-inner",
                    "overflow-x-auto scrollbar-none scroll-smooth"
                  )}
                  style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
                >
                  {images.map((item, idx) => {
                    const isActive = idx === currentIndex;
                    return (
                      <button
                        key={item.id || idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={cn(
                          "relative w-16 h-11 rounded-lg overflow-hidden shrink-0 transition-all duration-200 cursor-pointer select-none",
                          isActive
                            ? "ring-2 ring-neutral-900 dark:ring-white border-transparent opacity-100"
                            : "opacity-45 hover:opacity-85"
                        )}
                      >
                        <img
                          src={item.image_url}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick Statistics (Row of 3 cards) */}
          <div className="grid grid-cols-3 gap-3 w-full">
            <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/40 text-center shadow-sm">
              <span className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white leading-none">
                {project.project_responsibilities?.length || 0}
              </span>
              <span className="text-[9px] sm:text-[10px] text-neutral-400 dark:text-neutral-500 mt-2 font-semibold uppercase tracking-wider leading-tight">
                {tMain(locale, "responsibilities_stat")}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/40 text-center shadow-sm">
              <span className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white leading-none">
                {project.project_features?.length || 0}
              </span>
              <span className="text-[9px] sm:text-[10px] text-neutral-400 dark:text-neutral-500 mt-2 font-semibold uppercase tracking-wider leading-tight">
                {tMain(locale, "features_stat")}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/40 text-center shadow-sm">
              <span className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white leading-none">
                {project.project_skills?.length || 0}
              </span>
              <span className="text-[9px] sm:text-[10px] text-neutral-400 dark:text-neutral-500 mt-2 font-semibold uppercase tracking-wider leading-tight">
                {tMain(locale, "technologies_stat")}
              </span>
            </div>
          </div>

          {/* Key Features Card */}
          {project.project_features && project.project_features.length > 0 && (
            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/40 p-5 text-left shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-white/10 pb-2">
                <Star className="h-4 w-4 text-neutral-900 dark:text-white fill-neutral-900 dark:fill-white shrink-0" />
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                  {tMain(locale, "key_features")}
                </h3>
              </div>
              <div className="space-y-4">
                {project.project_features.map((feat) => {
                  const featTitle = locale === "id" ? feat.title_id : feat.title_en;
                  const featDesc = locale === "id" ? feat.description_id : feat.description_en;
                  return (
                    <div key={feat.id} className="text-xs sm:text-sm">
                      <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                        <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
                          {featTitle}
                        </strong>{" "}
                        — {featDesc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* 5. Share Modal */}
      <LinksShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        locale={locale}
        contact={contact}
      />
    </div>
  );
}
