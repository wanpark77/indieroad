import Link from "next/link"
import Image from "next/image"
import { Heart, Eye } from "lucide-react"

interface MagazineArticle {
  id: string | number
  slug: string
  title: string
  categoryLabel: string
  summary: string
  coverColor: string
  coverImageUrl?: string
  views: number
  likes: number
  commentsCount: number
}

export function MagazineCard({ article }: { article: MagazineArticle }) {
  return (
    <Link
      href={`/magazine/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Cover */}
      <div className={`relative flex h-44 items-end ${article.coverImageUrl ? "" : `bg-gradient-to-br ${article.coverColor}`} p-4`}>
        {article.coverImageUrl && (
          <Image
            src={article.coverImageUrl}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        )}
        <span className="relative z-10 rounded-full bg-card/90 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur-sm">
          {article.categoryLabel}
        </span>
      </div>
      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-primary">
          {article.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {article.summary}
        </p>
        <div className="mt-auto flex items-center gap-3 pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {article.views.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            {article.likes}
          </span>
        </div>
      </div>
    </Link>
  )
}
