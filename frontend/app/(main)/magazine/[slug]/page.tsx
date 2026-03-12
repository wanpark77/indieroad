"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Heart,
  Eye,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { getMagazine, type MagazineArticle } from "@/lib/api/magazine"

export default function MagazineDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const [article, setArticle] = useState<MagazineArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await getMagazine(slug)
        setArticle(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchArticle()
  }, [slug])

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-muted-foreground">아티클을 찾을 수 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 lg:px-6 lg:py-14">
      {/* Back */}
      <Link
        href="/magazine"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        매거진으로 돌아가기
      </Link>

      {/* Cover */}
      <div
        className={`mb-8 flex h-56 items-end rounded-2xl bg-gradient-to-br ${article.coverColor} p-6 sm:h-72`}
      >
        <span className="rounded-full bg-card/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
          {article.categoryLabel}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-balance text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
        {article.title}
      </h1>

      {/* Meta */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span>{article.author}</span>
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {article.date}
        </span>
        <span className="flex items-center gap-1">
          <Eye className="h-3.5 w-3.5" />
          {article.views.toLocaleString()}
        </span>
      </div>

      {/* Content */}
      <article
        className="prose prose-sm mt-8 max-w-none text-foreground/90"
        dangerouslySetInnerHTML={{ __html: article.content ?? "" }}
      />

      {/* Interactions */}
      <div className="mt-10 flex items-center gap-3 border-t border-border pt-6">
        <Button
          variant={liked ? "default" : "outline"}
          size="sm"
          onClick={() => setLiked(!liked)}
          className="gap-1.5"
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
          {liked ? article.likes + 1 : article.likes}
        </Button>
      </div>
    </div>
  )
}
