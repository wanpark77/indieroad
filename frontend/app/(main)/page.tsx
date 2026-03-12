"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Headphones, Music, Store, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MagazineCard } from "@/components/magazine-card"
import { FeedbackCard } from "@/components/feedback-card"
import { getMagazines, type MagazineArticle } from "@/lib/api/magazine"
import { getTracks, type FeedbackTrack } from "@/lib/api/feedback"

export default function HomePage() {
  const [latestArticles, setLatestArticles] = useState<MagazineArticle[]>([])
  const [popularArticles, setPopularArticles] = useState<MagazineArticle[]>([])
  const [openTracks, setOpenTracks] = useState<FeedbackTrack[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articles, tracks] = await Promise.all([
          getMagazines(),
          getTracks("OPEN"),
        ])
        const sorted = [...articles].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        setLatestArticles(sorted.slice(0, 4))
        const popular = [...articles]
          .sort((a, b) => b.views - a.views)
          .slice(0, 3)
        setPopularArticles(popular)
        setOpenTracks(tracks.slice(0, 3))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-card">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/30" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pb-20 pt-24 text-center lg:px-6 lg:pb-28 lg:pt-32">
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
            여러분의 음악 여정을 함께합니다
          </span>
          <h1 className="mx-auto max-w-3xl text-balance text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            인디로 빠져드는 길,
            <br />
            <span className="text-primary">인디로드</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground lg:text-lg">
            인디로드를 통해 음악의 새로운 길을 열어보세요.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/magazine">
                <Music className="mr-2 h-4 w-4" />
                음악 매거진 보기
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/feedback">
                <Headphones className="mr-2 h-4 w-4" />
                음악 듣고 참여하기
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/store-promo">
                <Store className="mr-2 h-4 w-4" />
                매장 음원 홍보 신청
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Magazine */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 lg:px-6 lg:py-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">음악 매거진</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              인디 음악의 이야기를 만나보세요
            </p>
          </div>
          <Link
            href="/magazine"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            더 보기
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {loading ? (
          <p className="text-muted-foreground">로딩 중...</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {latestArticles.map((article) => (
              <MagazineCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </section>

      {/* Popular */}
      <section className="bg-muted/50">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:px-6 lg:py-20">
          <div className="mb-8 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">
              지금 가장 뜨는 글
            </h2>
          </div>
          {loading ? (
            <p className="text-muted-foreground">로딩 중...</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {popularArticles.map((article, i) => (
                <Link
                  key={article.id}
                  href={`/magazine/${article.slug}`}
                  className="group flex gap-4 rounded-xl bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                    {i + 1}
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-primary">
                      {article.categoryLabel}
                    </span>
                    <span className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-primary">
                      {article.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {article.views.toLocaleString()}회 조회
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Feedback Service Intro */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 lg:px-6 lg:py-20">
        <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-accent/40 p-8 lg:p-12">
          <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-lg">
              <h2 className="text-2xl font-bold tracking-tight lg:text-3xl">
                음악 듣고 평가하면
                <br />
                <span className="text-primary">포인트를 받을 수 있어요</span>
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground lg:text-base">
                아티스트의 새 곡을 듣고 솔직한 피드백을 남겨주세요. 승인된
                피드백에는 1,000원의 포인트가 적립됩니다.
              </p>
              <Button className="mt-6" size="lg" asChild>
                <Link href="/feedback">
                  참여 가능한 음악 보기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="flex flex-col gap-3 text-sm">
              {["곡 선택 & 신청", "음악 감상 & 피드백 작성", "검수 승인 후 포인트 지급"].map((step, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl bg-card px-5 py-3 shadow-sm">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <span className="font-medium">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feedback Tracks Preview */}
      <section className="bg-muted/50">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:px-6 lg:py-20">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                현재 참여 가능한 음악
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                지금 바로 피드백에 참여해보세요
              </p>
            </div>
            <Link
              href="/feedback"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              전체 보기
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {loading ? (
            <p className="text-muted-foreground">로딩 중...</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {openTracks.map((track) => (
                <FeedbackCard key={track.id} track={track} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Store Promo Intro */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 lg:px-6 lg:py-20">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
          <div className="flex-1">
            <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              매장 음원 홍보
            </span>
            <h2 className="text-2xl font-bold tracking-tight lg:text-3xl">
              실제 매장에서
              <br />
              여러분의 음악이 흘러나옵니다
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground lg:text-base">
              카페, 서점, 레코드샵 등 감성적인 공간에서 여러분의 음악을
              들려드립니다.
            </p>
            <Button className="mt-6 bg-transparent" size="lg" variant="outline" asChild>
              <Link href="/store-promo">
                매장 음원 홍보 알아보기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="flex flex-1 flex-col gap-3">
            {[
              { store: "카페 봄날", location: "서울 마포구 연남동", track: "봄이 오면 - 이수진" },
              { store: "레코드샵 비닐", location: "서울 용산구 이태원", track: "서울의 밤 - 박현우" },
              { store: "브런치 카페 모닝", location: "서울 강남구 신사동", track: "달빛 아래 - 정서영" },
            ].map((item) => (
              <div key={item.store} className="flex items-center gap-4 rounded-xl bg-card p-4 shadow-sm">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Store className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{item.store}</span>
                  <span className="text-xs text-muted-foreground">{item.location}</span>
                  <span className="mt-0.5 text-xs text-primary">{item.track}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
