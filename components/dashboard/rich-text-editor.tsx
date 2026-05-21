"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import TiptapLink from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import Youtube from "@tiptap/extension-youtube";
import CharacterCount from "@tiptap/extension-character-count";
import TextAlign from "@tiptap/extension-text-align";
import { common, createLowlight } from "lowlight";
const lowlight = createLowlight(common);
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link,
  Image as ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  Minus,
  Terminal,
  Grid3X3,
  Rows,
  Columns,
  Trash2,
  Video as YoutubeIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  RemoveFormatting,
  Type,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/src/app/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/language-context";

/**
 * Custom CSS for syntax highlighting (Highlight.js / Lowlight)
 * We use a raw string to ensure these classes are available regardless of tailwind's JIT.
 */
const highlightStyles = `
  .hljs-comment, .hljs-quote { color: #71717a; font-style: italic; }
  .hljs-keyword, .hljs-selector-tag, .hljs-addition { color: #c084fc; }
  .hljs-number, .hljs-string, .hljs-doctag, .hljs-regexp { color: #4ade80; }
  .hljs-title, .hljs-section, .hljs-name, .hljs-selector-id, .hljs-selector-class { color: #60a5fa; }
  .hljs-variable, .hljs-template-variable, .hljs-attribute, .hljs-tag { color: #f87171; }
  .hljs-attr { color: #22d3ee; }
  .hljs-type, .hljs-built_in, .hljs-bullet, .hljs-symbol { color: #fbbf24; }
  .hljs-subst, .hljs-formula { color: #f472b6; }
  .hljs-link, .hljs-selector-attr, .hljs-selector-pseudo { color: #fb7185; }
  .hljs-emphasis { font-style: italic; }
  .hljs-strong { font-weight: bold; }

  /* Editor Typography Tweaks */
  .tiptap p {
    margin-top: 0.75em;
    margin-bottom: 0.75em;
    line-height: 1.6;
  }
  .tiptap p:first-child {
    margin-top: 0;
  }
  .tiptap p:last-child {
    margin-bottom: 0;
  }

  /* Youtube Video Responsiveness */
  .tiptap div[data-youtube-video] {
    position: relative;
    width: 100%;
    max-width: 100%;
    margin: 1.5rem auto;
    aspect-ratio: 16 / 9;
  }
  .tiptap div[data-youtube-video] iframe {
    width: 100% !important;
    height: 100% !important;
    border: none;
    border-radius: 8px;
  }
`;

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Tiptap-based rich text editor with a B&W minimal toolbar.
 * Supports: headings, bold, italic, strikethrough, code, lists,
 * blockquote, links, images, horizontal rule.
 */
export function RichTextEditor({
  content,
  onChange,
  placeholder,
  className,
}: RichTextEditorProps) {
  const { t } = useLanguage();
  const activePlaceholder = placeholder || t("common.editor.placeholder");
  const placeholderRef = useRef(activePlaceholder);
  placeholderRef.current = activePlaceholder;

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false, // Disable default to use lowlight
        link: false, // Disable built-in link to avoid duplicate warnings
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      TiptapLink.configure({
        openOnClick: false,
        linkOnPaste: true,
        HTMLAttributes: {
          class: "text-blue-600 underline dark:text-blue-400",
        },
      }),
      TiptapImage.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto",
        },
      }),
      Placeholder.configure({
        placeholder: () => placeholderRef.current,
        emptyEditorClass: "is-editor-empty before:content-[attr(data-placeholder)] before:text-neutral-400 before:float-left before:pointer-events-none before:h-0",
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Youtube.configure({
        width: 480,
        height: 320,
      }),
      CharacterCount,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-neutral dark:prose-invert max-w-none min-h-[250px] p-4 focus:outline-none",
          "prose-headings:font-bold prose-a:text-neutral-900 dark:prose-a:text-white",
          // Manual fallback styles in case prose is not fully working
          "[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4",
          "[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3",
          "[&_h3]:text-xl [&_h3]:font-bold [&_h3]:mb-2",
          "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2",
          "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2",
          "[&_blockquote]:border-l-4 [&_blockquote]:border-neutral-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:mb-4",
          "[&_a]:text-blue-600 [&_a]:underline",
          "[&_img]:rounded-lg [&_img]:max-w-full [&_img]:h-auto [&_img]:my-4",
          "[&_hr]:my-8 [&_hr]:border-neutral-200",
          // Table Styles (matching user image)
          "[&_table]:w-full [&_table]:border-collapse [&_table]:border [&_table]:border-neutral-200 [&_table]:rounded-xl [&_table]:overflow-hidden [&_table]:my-6",
          "[&_th]:bg-neutral-50 [&_th]:border [&_th]:border-neutral-200 [&_th]:p-3 [&_th]:text-left [&_th]:font-bold [&_th]:text-neutral-900 dark:[&_th]:bg-neutral-800 dark:[&_th]:text-white dark:[&_th]:border-white/10",
          "[&_td]:border [&_td]:border-neutral-200 [&_td]:p-3 [&_td]:text-neutral-700 dark:[&_td]:text-neutral-300 dark:[&_td]:border-white/10",
          "[&_tr:last-child_td]:border-b-0",
          // Code Block Styles (matching user image)
          "[&_pre]:bg-neutral-900 [&_pre]:text-neutral-100 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:my-6 [&_pre]:font-mono [&_pre]:overflow-x-auto",
          "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit",
          // Syntax Highlighting (Lowlight)
          "[&_.hljs-comment]:text-neutral-500 [&_.hljs-quote]:text-neutral-500",
          "[&_.hljs-keyword]:text-purple-400 [&_.hljs-selector-tag]:text-purple-400",
          "[&_.hljs-string]:text-green-400 [&_.hljs-doctag]:text-green-400",
          "[&_.hljs-title]:text-blue-400 [&_.hljs-section]:text-blue-400",
          "[&_.hljs-variable]:text-orange-400 [&_.hljs-template-variable]:text-orange-400",
          "[&_.hljs-type]:text-yellow-400 [&_.hljs-built_in]:text-yellow-400",
          "[&_.hljs-number]:text-orange-400",
          "[&_.hljs-attr]:text-cyan-400 [&_.hljs-attribute]:text-cyan-400",
          "[&_.hljs-function]:text-blue-400",
          "[&_.hljs-params]:text-neutral-100",
          // Youtube Video Responsiveness
          "[&_div\\[data-youtube-video\\]]:w-full [&_div\\[data-youtube-video\\]]:max-w-full [&_div\\[data-youtube-video\\]]:mx-auto [&_div\\[data-youtube-video\\]]:my-6 [&_div\\[data-youtube-video\\]]:aspect-video",
          "[&_div\\[data-youtube-video\\]_iframe]:w-full [&_div\\[data-youtube-video\\]_iframe]:h-full [&_div\\[data-youtube-video\\]_iframe]:rounded-lg [&_div\\[data-youtube-video\\]_iframe]:border-none"
        ),
      },
    },
  });

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.view.dispatch(editor.state.tr);
    }
  }, [activePlaceholder, editor]);

  // Keep editor content in sync with external content prop changes (e.g. after loading from API)
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    if (editor.isFocused) return; // Prevent cursor jumps while typing
    
    if (content !== editor.getHTML()) {
      editor.commands.setContent(content || "", { emitUpdate: false });
    }
  }, [content, editor]);

  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isYoutubeModalOpen, setIsYoutubeModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const addLink = useCallback(() => {
    if (!editor) return;
    
    // If text is selected, pre-fill current link if any
    const previousUrl = editor.getAttributes("link").href;
    setLinkUrl(previousUrl || "");
    setIsLinkModalOpen(true);
  }, [editor]);

  const handleLinkSubmit = () => {
    if (!editor) return;

    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
    }
    setIsLinkModalOpen(false);
    setLinkUrl("");
  };

  const addYoutubeVideo = useCallback(() => {
    if (!editor) return;
    setIsYoutubeModalOpen(true);
  }, [editor]);

  const handleYoutubeSubmit = () => {
    if (youtubeUrl) {
      editor?.chain().focus().setYoutubeVideo({ src: youtubeUrl }).run();
    }
    setIsYoutubeModalOpen(false);
    setYoutubeUrl("");
  };

  const addImage = useCallback(() => {
    if (!editor) return;
    
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      
      const loadingToast = toast.loading(t("common.editor.uploading"));
      try {
        const { StorageService } = await import("@/src/services/storage.service");
        const { STORAGE_PATHS } = await import("@/src/lib/constants");
        
        const result = await StorageService.uploadImage(STORAGE_PATHS.BLOGS, file);
        editor.chain().focus().setImage({ src: result.publicUrl }).run();
        toast.success(t("common.editor.upload_success"), { id: loadingToast });
      } catch (error) {
        console.error("Image upload failed:", error);
        toast.error(t("common.editor.upload_failed"), { id: loadingToast });
      }
    };
    
    input.click();
  }, [editor, t]);

  if (!editor) return null;

  const ToolbarButton = ({
    onClick,
    active,
    children,
    title,
    className,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title: string;
    className?: string;
  }) => (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onClick}
      title={title}
      className={cn(
        "h-8 w-8",
        active && "bg-neutral-200 dark:bg-white/20",
        className
      )}
    >
      {children}
    </Button>
  );

  return (
    <div
      className={cn(
        "rounded-lg border border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-900",
        className
      )}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-neutral-200 p-1.5 dark:border-white/10">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
          title={t("common.editor.heading_1")}
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title={t("common.editor.heading_2")}
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title={t("common.editor.heading_3")}
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>

        <div className="mx-1 h-6 w-px bg-neutral-200 dark:bg-white/10" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title={t("common.editor.bold")}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title={t("common.editor.italic")}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title={t("common.editor.strikethrough")}
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          title={t("common.editor.code")}
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>

        <div className="mx-1 h-6 w-px bg-neutral-200 dark:bg-white/10" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title={t("common.editor.bullet_list")}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title={t("common.editor.ordered_list")}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title={t("common.editor.blockquote")}
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title={t("common.editor.code_block")}
        >
          <Terminal className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={addYoutubeVideo}
          title={t("common.editor.youtube")}
        >
          <YoutubeIcon className="h-4 w-4" />
        </ToolbarButton>

        <div className="mx-1 h-6 w-px bg-neutral-200 dark:bg-white/10" />

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
          title={t("common.editor.align_left")}
        >
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
          title={t("common.editor.align_center")}
        >
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
          title={t("common.editor.align_right")}
        >
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          active={editor.isActive({ textAlign: "justify" })}
          title={t("common.editor.justify")}
        >
          <AlignJustify className="h-4 w-4" />
        </ToolbarButton>

        <div className="mx-1 h-6 w-px bg-neutral-200 dark:bg-white/10" />

        <ToolbarButton
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          title={t("common.editor.insert_table")}
        >
          <Grid3X3 className="h-4 w-4" />
        </ToolbarButton>

        {editor.isActive("table") && (
          <>
            <ToolbarButton
              onClick={() => editor.chain().focus().addRowAfter().run()}
              title={t("common.editor.add_row")}
            >
              <Rows className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              title={t("common.editor.add_column")}
            >
              <Columns className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().deleteTable().run()}
              title={t("common.editor.delete_table")}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </ToolbarButton>
          </>
        )}

        <div className="mx-1 h-6 w-px bg-neutral-200 dark:bg-white/10" />

        <ToolbarButton onClick={addLink} active={editor.isActive("link")} title={t("common.editor.add_link")}>
          <Link className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={addImage} title={t("common.editor.add_image")}>
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>

        <div className="mx-1 h-6 w-px bg-neutral-200 dark:bg-white/10" />

        <ToolbarButton
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          title={t("common.editor.clear_formatting")}
        >
          <RemoveFormatting className="h-4 w-4" />
        </ToolbarButton>

        <div className="ml-auto flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            title={t("common.editor.undo")}
          >
            <Undo className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            title={t("common.editor.redo")}
          >
            <Redo className="h-4 w-4" />
          </ToolbarButton>
        </div>
      </div>

      {/* Editor content */}
      <style dangerouslySetInnerHTML={{ __html: highlightStyles }} />
      <EditorContent editor={editor} />

      {/* Floating Menu */}
      <FloatingMenu
        editor={editor}
        shouldShow={({ editor, state }: { editor: any; state: any }) => {
          if (!editor.isFocused) return false;
          const { selection } = state;
          const { $from } = selection;
          return $from.parent.content.size === 0;
        }}
      >
        <div className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-white p-1 shadow-lg dark:border-white/10 dark:bg-neutral-900">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            title={t("common.editor.heading_1")}
          >
            <Heading1 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            title={t("common.editor.heading_2")}
          >
            <Heading2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title={t("common.editor.bullet_list")}
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={addImage} title={t("common.editor.add_image")}>
            <ImageIcon className="h-4 w-4" />
          </ToolbarButton>
        </div>
      </FloatingMenu>

      {/* Bubble Menu */}
      <BubbleMenu
        editor={editor}
        shouldShow={({ editor }: { editor: any }) => {
          return editor.isFocused && !editor.state.selection.empty;
        }}
        className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-white p-1 shadow-lg dark:border-white/10 dark:bg-neutral-900"
      >
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title={t("common.editor.bold")}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title={t("common.editor.italic")}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title={t("common.editor.strikethrough")}
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={addLink} active={editor.isActive("link")} title={t("common.editor.add_link")}>
          <Link className="h-4 w-4" />
        </ToolbarButton>
      </BubbleMenu>

      {/* Custom Link Dialog */}
      <Dialog open={isLinkModalOpen} onOpenChange={setIsLinkModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("common.editor.link_title")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleLinkSubmit();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLinkModalOpen(false)}>
              {t("common.editor.cancel")}
            </Button>
            <Button 
              onClick={handleLinkSubmit}
              className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
            >
              {t("common.editor.apply_link")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Custom YouTube Dialog */}
      <Dialog open={isYoutubeModalOpen} onOpenChange={setIsYoutubeModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("common.editor.embed_youtube")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="youtube-url">YouTube URL</Label>
              <Input
                id="youtube-url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleYoutubeSubmit();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsYoutubeModalOpen(false)}>
              {t("common.editor.cancel")}
            </Button>
            <Button 
              onClick={handleYoutubeSubmit}
              className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
            >
              {t("common.editor.embed_video")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer Info (Word Count) */}
      <div className="flex items-center justify-end border-t border-neutral-200 p-2 text-[10px] text-neutral-500 dark:border-white/10">
        <div className="flex gap-3">
          <span>{t("common.editor.words", { count: editor.storage.characterCount.words().toString() })}</span>
          <span>{t("common.editor.characters", { count: editor.storage.characterCount.characters().toString() })}</span>
        </div>
      </div>
    </div>
  );
}

