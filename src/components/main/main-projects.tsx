"use client";

import { motion } from "framer-motion";
import { FolderGit2, Code2, Globe, ArrowRight } from "lucide-react";
import { tMain, type MainLocale } from "@/src/lib/main-translations";
import type { Project, Skill } from "@/src/types/database";

interface MainProjectsProps {
  projects: Project[];
  locale: MainLocale;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

export function MainProjects({ projects, locale }: MainProjectsProps) {
  // Filter published projects
  const publishedProjects = projects.filter((p) => p.is_published);

  // Render max 6 on desktop, max 3 on mobile (handled by CSS to avoid hydration mismatch)
  const displayedProjects = publishedProjects.slice(0, 6);

  return (
    <section className="w-full px-3.5 sm:px-12 md:px-24 lg:px-36 pt-4 pb-12 md:pt-6 md:pb-24 bg-transparent">
      <div className="w-full flex flex-col gap-6 sm:gap-8">
        {/* Section Header */}
        <div className="flex flex-row items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col gap-1.5 text-left"
          >
            <div className="flex items-center gap-2.5">
              <FolderGit2 className="h-[22px] w-[22px] text-neutral-900 dark:text-white" />
              <h2 className="text-[24px] leading-none font-medium tracking-tight text-neutral-900 dark:text-white">
                {tMain(locale, "projects_title")}
              </h2>
            </div>
            <p className="text-[15px] font-regular text-neutral-500 dark:text-neutral-400">
              {tMain(locale, "projects_desc")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
            className="hidden md:block shrink-0"
          >
            <a
              href={`/${locale}/projects`}
              className="group/btn inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-xs font-semibold text-neutral-700 transition-colors duration-200 hover:bg-neutral-50 dark:border-white/10 dark:bg-neutral-900/50 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              <span>{tMain(locale, "view_all_projects")}</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
            </a>
          </motion.div>
        </div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {displayedProjects.map((item, index) => {
            // Determine dynamic visibility for desktop (max 6) vs mobile (max 3)
            const visibilityClass = index >= 3 ? "hidden md:flex" : "flex";

            // Extract sorted images and first image url
            const images = [...(item.project_images || [])].sort((a, b) => a.sort_order - b.sort_order);
            const mainImageUrl = images[0]?.image_url;

            // Extract technologies
            const skills = (item.project_skills?.map((ps) => ps.skill).filter((s): s is Skill => !!s) || []);
            const displayedSkills = skills.slice(0, 4);
            const hasMoreSkills = skills.length > 4;
            const remainingSkillsCount = skills.length - 4;

            // Localization
            const title = locale === "id" ? item.title_id : item.title_en;
            const bio = locale === "id" ? item.bio_id : item.bio_en;

            return (
              <motion.div
                key={item.id}
                variants={cardVariants}
                className={`${visibilityClass} group relative flex-col rounded-2xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-900/50 backdrop-blur-sm overflow-hidden transition-all duration-300`}
              >
                {/* 1. Project Image Container */}
                <div className="relative aspect-video w-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                  {mainImageUrl ? (
                    <img
                      src={mainImageUrl}
                      alt={title || "Project preview"}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-600 gap-2">
                      <FolderGit2 className="h-10 w-10 stroke-[1.5]" />
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="flex flex-1 flex-col p-5 text-left">
                  {/* 2. Project Title (max 1 line) */}
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white leading-tight truncate">
                    {title}
                  </h3>

                  {/* 3. Project Bio/Description (max 2 lines) */}
                  <p className="text-[13px] text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed line-clamp-2 min-h-[40px]">
                    {bio}
                  </p>

                  {/* 4. Tech Stack Pills (max 1 line) */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-3.5 h-7 overflow-hidden">
                    {displayedSkills.map((skill) => (
                      <div
                        key={skill.id}
                        className="group/pill flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-neutral-200 bg-transparent dark:border-white/10 text-xs font-normal text-neutral-600 dark:text-neutral-400 transition-colors duration-200 hover:bg-neutral-50/50 hover:border-neutral-300 dark:hover:bg-white/3 dark:hover:border-white/20 hover:text-black dark:hover:text-white shrink-0"
                      >
                        {skill.icon_url ? (
                          <img
                            src={skill.icon_url}
                            alt={skill.name}
                            className="w-3 h-3 object-contain brightness-0 dark:invert transition-transform duration-200 group-hover/pill:scale-110 shrink-0"
                          />
                        ) : (
                          <Code2 className="w-3 h-3 text-neutral-400 shrink-0" />
                        )}
                        <span>{skill.name}</span>
                      </div>
                    ))}
                    {hasMoreSkills && (
                      <span className="inline-flex items-center rounded-md border border-neutral-200 dark:border-white/10 px-2.5 py-1 text-xs font-normal text-neutral-500 dark:text-neutral-400 bg-transparent shrink-0">
                        +{remainingSkillsCount}
                      </span>
                    )}
                  </div>

                  {/* Spacer */}
                  <div className="flex-1 mt-5" />

                  {/* 5. Card Bottom Actions */}
                  <div className="grid grid-cols-2 gap-3 w-full">
                    {/* Left Button: Live Demo or Source Code */}
                    {item.live_url ? (
                      <a
                        href={item.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-xs font-semibold text-neutral-700 transition-colors duration-200 hover:bg-neutral-50 dark:border-white/10 dark:bg-neutral-900/50 dark:text-neutral-300 dark:hover:bg-neutral-900 cursor-pointer"
                      >
                        <Globe className="h-3.5 w-3.5" />
                        <span>{tMain(locale, "live_demo")}</span>
                      </a>
                    ) : item.github_url ? (
                      <a
                        href={item.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-xs font-semibold text-neutral-700 transition-colors duration-200 hover:bg-neutral-50 dark:border-white/10 dark:bg-neutral-900/50 dark:text-neutral-300 dark:hover:bg-neutral-900 cursor-pointer"
                      >
                        <Code2 className="h-3.5 w-3.5" />
                        <span>{tMain(locale, "source_code")}</span>
                      </a>
                    ) : (
                      // Empty state placeholder to preserve grid layout height
                      <div className="h-9" />
                    )}

                    {/* Right Button: View Detail (future modal implementation) */}
                    <button
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-neutral-900 text-white px-3 py-2.5 text-xs font-semibold transition-colors duration-200 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 cursor-pointer"
                    >
                      <span>{tMain(locale, "view_detail")}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Mobile View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
          className="flex md:hidden justify-end mt-2"
        >
          <a
            href={`/${locale}/projects`}
            className="group/btn inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-xs font-semibold text-neutral-700 transition-colors duration-200 hover:bg-neutral-50 dark:border-white/10 dark:bg-neutral-900/50 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <span>{tMain(locale, "view_all_projects")}</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
