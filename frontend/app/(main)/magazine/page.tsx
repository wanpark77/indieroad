"use client"

import { useState, useMemo, useEffect } from "react"
import { MagazineCard } from "@/components/magazine-card"
import { cn } from "@/lib/utils"
import { getMagazines, type MagazineArticle } from "@/lib/api/magazine"

type SortType = "latest" | "popular"

const magazineCategories = [
  { value: "INTERVIEW", label: "아티스트 인터뷰" },
  { value: "PLAYLIST", label: "플레이리스트" },
  { value: "PRODUCT", label: "제품" },
  { value: "NEWS", label: "소식" },
  { value: "CONCERT", label: "공연" },
]

export default function MagazinePage() {
  const [articles, setArticles] = useState<MagazineArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<string>("all")
  const [sort, setSort] = useState<SortType>("latest")

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true)
      try {
        const data = await getMagazines()
        setArticles(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [])

  const filtered = useMemo(() => {
    let list =
      category === "all"
        ? [...articles]
        : articles.filter((a) => a.category === category)
    if (sort === "popular") {
      list.sort((a, b) => b.views - a.views)
    } else {
      list.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )
    }
    return list
  }, [articles, category, sort])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:px-6 lg:py-14">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">음악 매거진</h1>
        <p className="mt-2 text-muted-foreground">
          인디 음악의 다양한 이야기를 만나보세요
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              category === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent",
            )}
          >
            전체
          </button>
          {magazineCategories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setCategory(cat.value)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                category === cat.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent",
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {(["latest", "popular"] as SortType[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSort(s)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                sort === s
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {s === "latest" ? "최신순" : "인기순"}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <p className="text-muted-foreground">로딩 중...</p>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((article) => (
              <MagazineCard key={article.id} article={article} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center py-20 text-center">
              <p className="text-muted-foreground">
                해당 카테고리의 글이 아직 없습니다.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
