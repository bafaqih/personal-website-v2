import * as React from "react";
import { cn } from "@/src/app/lib/utils";
import { Button } from "@/components/ui/button";

interface AnimatedHamburgerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean;
}

export function AnimatedHamburger({ active, className, ...props }: AnimatedHamburgerProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "h-9 w-9 bg-neutral-900 text-white hover:bg-neutral-800 hover:text-white transition-all dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 dark:hover:text-neutral-900 rounded-[10px] flex items-center justify-center cursor-pointer border-0 shadow-none focus:outline-none focus:ring-0 focus-visible:ring-0",
        className
      )}
      {...props}
    >
      <div className="relative w-[18px] h-[14px] flex flex-col justify-between items-center">
        <span className={cn(
          "w-full h-[2px] bg-current rounded-full transition-all duration-300 ease-in-out origin-center",
          active ? "rotate-45 translate-y-[6px]" : ""
        )} />
        <span className={cn(
          "w-full h-[2px] bg-current rounded-full transition-all duration-300 ease-in-out",
          active ? "opacity-0 scale-0" : ""
        )} />
        <span className={cn(
          "w-full h-[2px] bg-current rounded-full transition-all duration-300 ease-in-out origin-center",
          active ? "-rotate-45 translate-y-[-6px]" : ""
        )} />
      </div>
    </Button>
  );
}
