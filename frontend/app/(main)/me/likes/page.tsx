import Link from "next/link"
import { Heart, Eye, MessageCircle } from "lucide-react"
import { magazineArticles } from "@/lib/mock-data"

// Mock: user has liked articles 1, 2, 4
const likedArticleIds = ["1", "2", "4"]

export default function MyLikesPage() {
  const likedArticles = magazineArticles.filter((a) =>
    likedArticleIds.includes(a.id),
  )

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">좋아요한 매거진</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          좋아요를 누른 매거진 글을 모아봤습니다.
        </p>
      </div>

      {likedArticles.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Heart className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            아직 좋아요한 글이 없습니다.
          </p>
          <Link
            href="/magazine"
            className="text-sm font-medium text-primary hover:underline"
          >
            매거진 둘러보기
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {likedArticles.map((article) => (
            <Link
              key={article.id}
              href={`/magazine/${article.slug}`}
              className="group flex gap-4 rounded-xl bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Color thumbnail */}
              <div
                className={`hidden h-20 w-20 shrink-0 rounded-lg bg-gradient-to-br sm:block ${article.coverColor}`}
              />
              <div className="flex flex-1 flex-col justify-between gap-2">
                <div>
                  <span className="text-xs font-medium text-primary">
                    {article.categoryLabel}
                  </span>
                  <h3 className="mt-0.5 text-base font-semibold leading-snug group-hover:text-primary">
                    {article.title}
                  </h3>
                  <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                    {article.summary}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {article.views.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3 fill-primary text-primary" />
                    {article.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    {article.commentsCount}
                  </span>
                  <span>{article.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
