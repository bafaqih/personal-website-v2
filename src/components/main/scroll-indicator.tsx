"use client";

import { motion } from "framer-motion";

export function ScrollIndicator() {
  const handleScrollToAbout = () => {
    const element = document.getElementById("about");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full h-0 flex justify-center z-30 pointer-events-none">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 lg:translate-y-[34px] translate-y-[12px] flex justify-center cursor-pointer pointer-events-auto"
        onClick={handleScrollToAbout}
      >
        <div className="w-6 h-10 border border-neutral-200 dark:border-white/10 rounded-full flex justify-center p-1">
          <motion.div
            animate={{
              y: [0, 12, 0],
              opacity: [1, 0, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-1.5 h-1.5 bg-neutral-400 dark:bg-neutral-500 rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
}
