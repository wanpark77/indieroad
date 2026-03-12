"use client"

import { useState, use, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Save, Upload, X } from "lucide-react"
import { adminGetMagazines, adminCreateMagazine, adminUpdateMagazine } from "@/lib/api/admin"
import type { MagazineArticle } from "@/lib/api/magazine"
import RichTextEditor from "@/components/rich-text-editor"
const BASE_URL = "http://localhost:8080"

const magazineCategories = [
  { value: "INTERVIEW", label: "아티스트 인터뷰" },
  { value: "PLAYLIST", label: "플레이리스트" },
  { value: "PRODUCT", label: "제품" },
  { value: "NEWS", label: "소식" },
  { value: "CONCERT", label: "공연" },
]

export default function AdminMagazineFormPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const isNew = id === "new"
  const [loading, setLoading] = useState(!isNew)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [form, setForm] = useState({
    title: "",
    slug: "",
    category: "",
    summary: "",
    content: "",
    author: "",
    coverColor: "from-gray-100 to-gray-200",
    coverImageUrl: "",
  })

  useEffect(() => {
    if (isNew) return
    const fetchArticle = async () => {
      try {
        const articles = await adminGetMagazines()
        const existing = articles.find((a: MagazineArticle) => String(a.id) === id)
        if (existing) {
          setForm({
            title: existing.title,
            slug: existing.slug,
            category: existing.category,
            summary: existing.summary ?? "",
            content: existing.content ?? "",
            author: existing.author,
            coverColor: existing.coverColor,
            coverImageUrl: existing.coverImageUrl ?? "",
          })
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchArticle()
  }, [id, isNew])

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const token = localStorage.getItem("token")
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch(`${BASE_URL}/api/admin/upload/magazine-cover`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const json = await res.json()
      if (json.success) {
        setForm((prev) => ({ ...prev, coverImageUrl: json.data.url }))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (isNew) {
        await adminCreateMagazine(form)
      } else {
        await adminUpdateMagazine(Number(id), form)
      }
      router.push("/admin/magazine")
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <p className="text-gray-500">로딩 중...</p>
  }

  return (
    <div className="max-w-2xl space-y-4">
      <Button variant="ghost" onClick={() => router.back()} className="gap-2 -ml-2">
        <ArrowLeft className="w-4 h-4" />
        목록으로
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{isNew ? "새 아티클 등록" : "아티클 수정"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">제목 *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="아티클 제목을 입력하세요"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                placeholder="예: spring-acoustic-playlist"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category">카테고리 *</Label>
              <Select
                value={form.category}
                onValueChange={(v) => handleChange("category", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  {magazineCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="summary">요약</Label>
              <Textarea
                id="summary"
                value={form.summary}
                onChange={(e) => handleChange("summary", e.target.value)}
                placeholder="아티클 요약 (목록에서 표시됩니다)"
                rows={2}
              />
            </div>

            <div className="space-y-1.5">
              <Label>본문 *</Label>
              <RichTextEditor
                value={form.content}
                onChange={(html) => handleChange("content", html)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="author">작성자 *</Label>
              <Input
                id="author"
                value={form.author}
                onChange={(e) => handleChange("author", e.target.value)}
                placeholder="예: 인디로드 에디터"
                required
              />
            </div>

            {/* 썸네일 이미지 업로드 */}
            <div className="space-y-1.5">
              <Label>썸네일 이미지</Label>
              <p className="text-xs text-muted-foreground">권장 사이즈: 가로 400px × 세로 176px 이상 (비율 약 2.3:1)</p>

              {/* 미리보기 (카드 썸네일과 동일한 h-44) */}
              <div
                className={`relative flex h-44 w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors
                  ${form.coverImageUrl ? "border-transparent" : "border-input hover:border-primary/50"}
                  ${form.coverImageUrl ? "" : `bg-gradient-to-br ${form.coverColor}`}`}
              >
                {/* 투명 input이 전체 영역을 덮어 직접 클릭 수신 */}
                {!form.coverImageUrl && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                  />
                )}
                {form.coverImageUrl ? (
                  <Image
                    src={form.coverImageUrl}
                    alt="썸네일 미리보기"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground pointer-events-none">
                    <Upload className="h-8 w-8 opacity-50" />
                    <span>{uploading ? "업로드 중..." : "클릭해서 이미지 업로드"}</span>
                  </div>
                )}
                {form.coverImageUrl && (
                  <button
                    type="button"
                    onClick={() => handleChange("coverImageUrl", "")}
                    className="absolute right-2 top-2 z-10 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* 이미지 없을 때 그라디언트 폴백 */}
            {!form.coverImageUrl && (
              <div className="space-y-1.5">
                <Label htmlFor="coverColor">커버 색상 (이미지 없을 때 표시)</Label>
                <Input
                  id="coverColor"
                  value={form.coverColor}
                  onChange={(e) => handleChange("coverColor", e.target.value)}
                  placeholder="예: from-rose-200 to-amber-100"
                />
                <div className={`h-8 rounded-md bg-gradient-to-r ${form.coverColor} mt-1 border`} />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                취소
              </Button>
              <Button type="submit" className="gap-2" disabled={submitting}>
                <Save className="w-4 h-4" />
                {submitting ? "처리 중..." : isNew ? "등록하기" : "저장하기"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
