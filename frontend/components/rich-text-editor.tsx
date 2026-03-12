"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import { Mark, mergeAttributes, Extension } from "@tiptap/core"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import { TextStyle } from "@tiptap/extension-text-style"
import { Color } from "@tiptap/extension-color"
import FontFamily from "@tiptap/extension-font-family"
import Image from "@tiptap/extension-image"
import TextAlign from "@tiptap/extension-text-align"
import Link from "@tiptap/extension-link"
import { useEffect, useRef, useState } from "react"
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Heading1, Heading2, Heading3,
  Link as LinkIcon, Image as ImageIcon, Undo, Redo,
  Minus,
} from "lucide-react"

const FONT_FAMILIES = [
  { label: "기본", value: "" },
  { label: "Serif", value: "Georgia, serif" },
  { label: "Mono", value: "monospace" },
  { label: "Sans", value: "Arial, sans-serif" },
]

const TEXT_COLORS = [
  "#000000", "#374151", "#6B7280", "#EF4444", "#F97316",
  "#EAB308", "#22C55E", "#3B82F6", "#8B5CF6", "#EC4899",
  "#FFFFFF",
]

const FONT_SIZES = ["12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px", "40px", "48px"]

// FontSize as an independent Mark (more reliable than TextStyle attribute)
const FontSize = Mark.create({
  name: "fontSize",
  addAttributes() {
    return {
      size: {
        default: null,
        parseHTML: (el) => (el as HTMLElement).style.fontSize || null,
        renderHTML: (attrs) => {
          if (!attrs.size) return {}
          return { style: `font-size: ${attrs.size}` }
        },
      },
    }
  },
  parseHTML() {
    return [{ style: "font-size" }]
  },
  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes), 0]
  },
  addCommands() {
    return {
      setFontSize:
        (size: string) =>
        ({ commands }: any) =>
          commands.setMark("fontSize", { size }),
      unsetFontSize:
        () =>
        ({ commands }: any) =>
          commands.unsetMark("fontSize"),
    }
  },
})

interface Props {
  value: string
  onChange: (html: string) => void
}

const BASE_URL = "http://localhost:8080"

export default function RichTextEditor({ value, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [colorPickerOpen, setColorPickerOpen] = useState(false)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: false }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[320px] px-4 py-3 focus:outline-none",
      },
    },
  })

  // Sync external value changes (e.g. when loading existing article)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editor) return
    try {
      const token = localStorage.getItem("token")
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch(`${BASE_URL}/api/admin/upload/magazine-cover`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token ?? ""}` },
        body: formData,
      })
      const json = await res.json()
      if (json.success) {
        editor.chain().focus().setImage({ src: json.data.url }).run()
      }
    } catch (err) {
      console.error(err)
    }
    e.target.value = ""
  }

  const addLink = () => {
    const url = window.prompt("링크 URL을 입력하세요")
    if (!url || !editor) return
    editor.chain().focus().setLink({ href: url }).run()
  }

  if (!editor) return null

  const currentFontSize = editor.getAttributes("fontSize").size ?? ""
  const currentFontFamily = editor.getAttributes("textStyle").fontFamily ?? ""

  return (
    <div className="rounded-xl border border-input overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/40 px-2 py-1.5">
        {/* Font family */}
        <select
          className="h-7 rounded border border-input bg-background px-1.5 text-xs"
          value={currentFontFamily}
          onChange={(e) => {
            const v = e.target.value
            if (v) editor.chain().focus().setFontFamily(v).run()
            else editor.chain().focus().unsetFontFamily().run()
          }}
        >
          {FONT_FAMILIES.map((f) => (
            <option key={f.label} value={f.value}>{f.label}</option>
          ))}
        </select>

        {/* Font size */}
        <select
          className="h-7 rounded border border-input bg-background px-1.5 text-xs"
          value={currentFontSize}
          onChange={(e) => {
            const v = e.target.value
            editor.chain().focus()
            if (v) (editor.chain().focus() as any).setFontSize(v).run()
            else (editor.chain().focus() as any).unsetFontSize().run()
          }}
        >
          <option value="">크기</option>
          {FONT_SIZES.map((s) => (
            <option key={s} value={s}>{s.replace("px", "")}</option>
          ))}
        </select>

        <Divider />

        {/* Text color */}
        <div className="relative">
          <button
            type="button"
            title="글자 색상"
            className="flex h-7 w-7 items-center justify-center rounded hover:bg-accent"
            onClick={() => setColorPickerOpen((o) => !o)}
          >
            <span
              className="h-4 w-4 rounded-sm border border-border"
              style={{ background: editor.getAttributes("textStyle").color ?? "#000" }}
            />
          </button>
          {colorPickerOpen && (
            <div className="absolute left-0 top-8 z-50 flex flex-wrap gap-1 rounded-xl border bg-popover p-2 shadow-lg w-[148px]">
              {TEXT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  title={c}
                  className="h-6 w-6 rounded-sm border border-border transition-transform hover:scale-110"
                  style={{ background: c }}
                  onClick={() => {
                    editor.chain().focus().setColor(c).run()
                    setColorPickerOpen(false)
                  }}
                />
              ))}
              <button
                type="button"
                className="mt-1 w-full rounded border px-1 text-[10px] text-muted-foreground hover:bg-accent"
                onClick={() => {
                  editor.chain().focus().unsetColor().run()
                  setColorPickerOpen(false)
                }}
              >
                색상 초기화
              </button>
            </div>
          )}
        </div>

        <Divider />

        {/* Headings */}
        <ToolBtn
          title="H1"
          active={editor.isActive("heading", { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn
          title="H2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn
          title="H3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="h-3.5 w-3.5" />
        </ToolBtn>

        <Divider />

        {/* Inline styles */}
        <ToolBtn title="굵게" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn title="기울임" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn title="밑줄" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn title="취소선" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough className="h-3.5 w-3.5" />
        </ToolBtn>

        <Divider />

        {/* Align */}
        <ToolBtn title="왼쪽 정렬" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          <AlignLeft className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn title="가운데 정렬" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          <AlignCenter className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn title="오른쪽 정렬" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          <AlignRight className="h-3.5 w-3.5" />
        </ToolBtn>

        <Divider />

        {/* Lists */}
        <ToolBtn title="순서 없는 목록" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn title="순서 있는 목록" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn title="구분선" active={false} onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus className="h-3.5 w-3.5" />
        </ToolBtn>

        <Divider />

        {/* Link & Image */}
        <ToolBtn title="링크" active={editor.isActive("link")} onClick={addLink}>
          <LinkIcon className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn title="이미지 삽입" active={false} onClick={() => fileInputRef.current?.click()}>
          <ImageIcon className="h-3.5 w-3.5" />
        </ToolBtn>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />

        <Divider />

        {/* Undo / Redo */}
        <ToolBtn title="실행 취소" active={false} onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn title="다시 실행" active={false} onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo className="h-3.5 w-3.5" />
        </ToolBtn>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  )
}

function ToolBtn({
  children,
  title,
  active,
  onClick,
  disabled,
}: {
  children: React.ReactNode
  title: string
  active: boolean
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-7 w-7 items-center justify-center rounded transition-colors disabled:opacity-30
        ${active ? "bg-primary text-primary-foreground" : "hover:bg-accent text-foreground"}`}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <span className="mx-0.5 h-5 w-px bg-border" />
}
