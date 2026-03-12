"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Music, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getTrack, submitFeedback, type FeedbackTrack } from "@/lib/api/feedback"
import { useRouter } from "next/navigation"

export default function FeedbackWritePage({
  params,
}: {
  params: Promise<{ trackId: string }>
}) {
  const { trackId } = use(params)
  const router = useRouter()
  const [track, setTrack] = useState<FeedbackTrack | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [impression, setImpression] = useState("")
  const [highlights, setHighlights] = useState("")
  const [improvements, setImprovements] = useState("")
  const [elapsed, setElapsed] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) {
      router.push("/login")
      return
    }
    const fetchTrack = async () => {
      try {
        const data = await getTrack(Number(trackId))
        setTrack(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchTrack()
  }, [trackId, router])

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [isPlaying])

  const canSubmit =
    impression.length > 0 &&
    highlights.length > 0 &&
    improvements.length > 0

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  const handleSubmit = async () => {
    if (!track || !canSubmit) return
    setSubmitting(true)
    try {
      await submitFeedback(track.id as number, { impression, highlights, improvements })
      router.push("/me/feedbacks")
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    )
  }

  if (!track) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-muted-foreground">트랙을 찾을 수 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 lg:px-6 lg:py-14">
      {/* Back */}
      <Link
        href={`/feedback/${track.id}`}
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        곡 상세로 돌아가기
      </Link>

      <h1 className="mb-2 text-2xl font-bold">피드백 작성</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        {track.title} - {track.artist}
      </p>

      {/* Player */}
      <div className="mb-8 rounded-xl bg-card p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Music className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground"
              >
                {isPlaying ? (
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg className="ml-0.5 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              <div className="flex-1">
                <div className="h-1.5 rounded-full bg-border">
                  <div
                    className="h-1.5 rounded-full bg-primary transition-all"
                    style={{ width: `${Math.min((elapsed / 300) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatTime(elapsed)}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatTime(elapsed)} 재생됨</span>
        </div>
      </div>

      {/* Feedback Form */}
      <div className="flex flex-col gap-6">
        <div>
          <label className="mb-2 block text-sm font-semibold">
            1. 처음 들었을 때의 인상
          </label>
          <textarea
            value={impression}
            onChange={(e) => setImpression(e.target.value)}
            className="w-full resize-none rounded-xl border border-input bg-card p-4 text-sm leading-relaxed placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            rows={6}
            placeholder="처음 이 곡을 들었을 때 어떤 느낌이 들었는지 자유롭게 작성해주세요."
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            2. 인상 깊었던 점
          </label>
          <textarea
            value={highlights}
            onChange={(e) => setHighlights(e.target.value)}
            className="w-full resize-none rounded-xl border border-input bg-card p-4 text-sm leading-relaxed placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            rows={5}
            placeholder="곡에서 특히 인상 깊었던 부분을 구체적으로 작성해주세요."
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            3. 아쉬웠던 점 / 개선 의견
          </label>
          <textarea
            value={improvements}
            onChange={(e) => setImprovements(e.target.value)}
            className="w-full resize-none rounded-xl border border-input bg-card p-4 text-sm leading-relaxed placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            rows={5}
            placeholder="아쉬웠던 부분이나 개선할 수 있는 점을 솔직하게 작성해주세요."
          />
        </div>

        <div className="rounded-xl bg-muted/50 p-4 text-xs leading-relaxed text-muted-foreground">
          <p className="font-medium text-foreground">작성 시 유의사항</p>
          <ul className="mt-2 list-inside list-disc">
            <li>비방이나 욕설이 포함된 피드백은 반려됩니다.</li>
            <li>동일 문장 반복은 불가합니다.</li>
            <li>제출 후 수정이 불가하오니 신중하게 작성해주세요.</li>
            <li>재생 시작 후 3분 경과 시에만 제출이 가능합니다.</li>
          </ul>
        </div>

        <Button
          size="lg"
          className="w-full"
          disabled={!canSubmit || submitting}
          onClick={handleSubmit}
        >
          {submitting ? "제출 중..." : "피드백 제출하기"}
        </Button>
      </div>
    </div>
  )
}
