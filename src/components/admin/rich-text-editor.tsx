"use client";

import { useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import FileHandler from "@tiptap/extension-file-handler";

type UploadResponse = {
  url?: string;
  error?: string;
};

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

async function sendImageToServer(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/admin/blog/upload", {
    method: "POST",
    body: formData,
  });

  const result = (await response.json()) as UploadResponse;

  if (!response.ok || !result.url) {
    throw new Error(result.error || "Image upload failed.");
  }

  return result.url;
}

function getSuggestedAlt(file: File) {
  return file.name
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim();
}

export default function RichTextEditor({
  initialContent = "",
}: {
  initialContent?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [html, setHtml] = useState(initialContent);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,

      Image.configure({
        allowBase64: false,
        HTMLAttributes: {
          class: "blog-inline-image",
        },
      }),

      FileHandler.configure({
        allowedMimeTypes: ALLOWED_IMAGE_TYPES,

        onPaste: (editor, files) => {
          const imageFiles = files.filter((file) =>
            ALLOWED_IMAGE_TYPES.includes(file.type),
          );

          if (imageFiles.length === 0) {
            return;
          }

          void (async () => {
            setUploading(true);
            setUploadError("");

            try {
              for (const file of imageFiles) {
                const url = await sendImageToServer(file);
                const alt = getSuggestedAlt(file);

                editor
                  .chain()
                  .focus()
                  .setImage({
                    src: url,
                    alt,
                  })
                  .run();
              }
            } catch (error) {
              setUploadError(
                error instanceof Error
                  ? error.message
                  : "Image upload failed.",
              );
            } finally {
              setUploading(false);
            }
          })();
        },

        onDrop: (editor, files, pos) => {
          const imageFiles = files.filter((file) =>
            ALLOWED_IMAGE_TYPES.includes(file.type),
          );

          if (imageFiles.length === 0) {
            return;
          }

          void (async () => {
            setUploading(true);
            setUploadError("");

            try {
              let insertPosition = pos;

              for (const file of imageFiles) {
                const url = await sendImageToServer(file);
                const alt = getSuggestedAlt(file);

                editor.commands.insertContentAt(insertPosition, {
                  type: "image",
                  attrs: {
                    src: url,
                    alt,
                  },
                });

                insertPosition += 1;
              }
            } catch (error) {
              setUploadError(
                error instanceof Error
                  ? error.message
                  : "Image upload failed.",
              );
            } finally {
              setUploading(false);
            }
          })();
        },
      }),
    ],

    content: initialContent,

    immediatelyRender: false,

    editorProps: {
      attributes: {
        class: "buywiz-rich-editor-content",
      },

      transformPastedHTML(html) {
        /*
         * Remove external image tags from pasted HTML.
         *
         * This prevents broken images when copying formatted content
         * from websites. Actual image files in the clipboard are handled
         * by FileHandler above and uploaded to Buywiz.
         */
        return html.replace(/<img[^>]*>/gi, "");
      },
    },

    onUpdate({ editor }) {
      setHtml(editor.isEmpty ? "" : editor.getHTML());
    },
  });

  async function uploadImage(file: File) {
    if (!editor) {
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      const url = await sendImageToServer(file);

      const suggestedAlt = getSuggestedAlt(file);

      const enteredAlt = window.prompt(
        "Describe this image for accessibility and SEO:",
        suggestedAlt,
      );

      const alt =
        enteredAlt === null
          ? suggestedAlt
          : enteredAlt.trim() || suggestedAlt;

      editor
        .chain()
        .focus()
        .setImage({
          src: url,
          alt,
        })
        .run();
    } catch (error) {
      setUploadError(
        error instanceof Error
          ? error.message
          : "Image upload failed.",
      );
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  if (!editor) {
    return (
      <div className="rich-editor-loading">
        Editor laden…
      </div>
    );
  }

  return (
    <div className="buywiz-rich-editor">
      <div className="rich-editor-toolbar">
        <button
          type="button"
          className={editor.isActive("bold") ? "active" : ""}
          onClick={() =>
            editor.chain().focus().toggleBold().run()
          }
          title="Bold"
        >
          B
        </button>

        <button
          type="button"
          className={editor.isActive("italic") ? "active" : ""}
          onClick={() =>
            editor.chain().focus().toggleItalic().run()
          }
          title="Italic"
        >
          I
        </button>

        <button
          type="button"
          className={
            editor.isActive("heading", { level: 2 })
              ? "active"
              : ""
          }
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 2 })
              .run()
          }
          title="Heading 2"
        >
          H2
        </button>

        <button
          type="button"
          className={
            editor.isActive("heading", { level: 3 })
              ? "active"
              : ""
          }
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 3 })
              .run()
          }
          title="Heading 3"
        >
          H3
        </button>

        <button
          type="button"
          className={
            editor.isActive("bulletList")
              ? "active"
              : ""
          }
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBulletList()
              .run()
          }
          title="Bullet list"
        >
          • List
        </button>

        <button
          type="button"
          className={
            editor.isActive("orderedList")
              ? "active"
              : ""
          }
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleOrderedList()
              .run()
          }
          title="Numbered list"
        >
          1. List
        </button>

        <button
          type="button"
          className={
            editor.isActive("blockquote")
              ? "active"
              : ""
          }
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBlockquote()
              .run()
          }
          title="Quote"
        >
          Quote
        </button>

        <button
          type="button"
          onClick={() =>
            fileInputRef.current?.click()
          }
          disabled={uploading}
          title="Insert image"
        >
          {uploading ? "Uploading…" : "Image"}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];

            if (file) {
              void uploadImage(file);
            }
          }}
        />
      </div>

      {uploading ? (
        <div className="rich-editor-uploading">
          Uploading image…
        </div>
      ) : null}

      {uploadError ? (
        <div className="rich-editor-error">
          {uploadError}
        </div>
      ) : null}

      <EditorContent editor={editor} />

      <input
        type="hidden"
        name="content"
        value={html}
      />
    </div>
  );
}
