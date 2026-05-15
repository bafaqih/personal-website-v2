"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

interface BulletListInputProps {
  value?: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  id?: string;
}

export function BulletListInput({ value = [], onChange, placeholder, id }: BulletListInputProps) {
  // Convert array to string with bullets
  const arrayToString = (arr: string[]) => {
    if (!arr || arr.length === 0) return "";
    return arr.map((item) => `• ${item}`).join("\n");
  };

  const [text, setText] = useState(arrayToString(value));

  // Sync prop changes ONLY if the data is completely out of sync
  // (e.g. initial load from API)
  useEffect(() => {
    const currentArray = text
      .split("\n")
      .map((line) => line.replace(/^•\s*/, "").trim())
      .filter((line) => line !== "");

    if (JSON.stringify(value) !== JSON.stringify(currentArray)) {
      setText(arrayToString(value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const updateForm = (newText: string) => {
    const newArray = newText
      .split("\n")
      .map((line) => line.replace(/^•\s*/, "").trim())
      .filter((line) => line !== "");
    onChange(newArray);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let newText = e.target.value;

    // Auto-convert "- " at the start of any line to "• "
    newText = newText.replace(/(^|\n)-\s/g, "$1• ");

    setText(newText);
    updateForm(newText);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const currentText = target.value;
      const before = currentText.substring(0, start);
      const after = currentText.substring(end);

      const lines = before.split("\n");
      const currentLine = lines[lines.length - 1];

      // If the current line starts with a bullet
      if (currentLine.startsWith("• ")) {
        e.preventDefault();

        // If it's an empty bullet, remove it to escape the list
        if (currentLine.trim() === "•") {
          const newBefore = before.substring(0, before.length - currentLine.length);
          const newText = newBefore + "\n" + after;
          setText(newText);
          updateForm(newText);

          setTimeout(() => {
            target.selectionStart = target.selectionEnd = newBefore.length + 1;
          }, 0);
        } else {
          // Add new bullet for the new line
          const newText = before + "\n• " + after;
          setText(newText);
          updateForm(newText);

          setTimeout(() => {
            target.selectionStart = target.selectionEnd = start + 3;
          }, 0);
        }
      }
      // If no bullet, let native Enter behavior happen (inserts \n)
    }
  };

  return (
    <Textarea
      id={id}
      value={text}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className="min-h-[160px] resize-y leading-relaxed"
    />
  );
}
