"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SkillOption {
  id: string;
  name: string;
}

interface MultiSelectSkillProps {
  options: SkillOption[];
  selected: string[]; // array of skill IDs
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export function MultiSelectSkill({ options, selected, onChange, placeholder = "Select skills..." }: MultiSelectSkillProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((item) => item !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const removeOption = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onChange(selected.filter((item) => item !== id));
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        className="flex min-h-9 w-full cursor-pointer flex-wrap items-center justify-between gap-1.5 rounded-md border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm shadow-xs transition-[color,box-shadow,background-color] outline-none dark:bg-input/30 dark:hover:bg-input/50"
        onClick={() => setOpen(!open)}
      >
        <div className="flex flex-wrap items-center gap-1.5">
          {selected.length === 0 && <span className="text-muted-foreground">{placeholder}</span>}
          {selected.map((id) => {
            const option = options.find((o) => o.id === id);
            if (!option) return null;
            return (
              <Badge key={id} variant="secondary" className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-secondary">
                {option.name}
                <div
                  className="ml-1 cursor-pointer rounded-full p-0.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  onClick={(e) => removeOption(e, id)}
                >
                  <X className="h-3 w-3" />
                </div>
              </Badge>
            );
          })}
        </div>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
      </div>

      {open && (
        <div className="absolute top-full z-50 mt-1 max-h-60 w-full overflow-y-auto overflow-x-hidden rounded-md bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 p-1">
          {options.length === 0 ? (
            <div className="p-2 text-center text-sm text-muted-foreground">No options found.</div>
          ) : (
            options.map((option) => {
              const isSelected = selected.includes(option.id);
              return (
                <div
                  key={option.id}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                    isSelected ? "bg-accent text-accent-foreground" : ""
                  )}
                  onClick={() => toggleOption(option.id)}
                >
                  <span>{option.name}</span>
                  {isSelected && (
                    <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
