"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Music, Clock, Users, Coins, ChevronDown, ChevronUp, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getTrack, applyFeedback, type FeedbackTrack } from "@/lib/api/feedback"
import { useRouter } from "next/navigation"

const BASE_URL = "http://localhost:8080"

interface FeedbackSubmission {
  id: number
  userId: number
  impression: string
  highlights: string
  improvements: string
  status: string
  submittedAt: string
}

const statusColors: Record<string, string> = {
  APPROVED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-100 text-red-700",
}

const statusLabels: Record<string, string> = {
  APPROVED: "승인",
  REJECTED: "반려",
}

export default function FeedbackDetailPage({
  params,
}: {
  params: Promise<{ trackId: string }>
}) {
  const { trackId } = use(params)
  const router = useRouter()
  const [track, setTrack] = useState<FeedbackTrack | null>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [submissions, setSubmissions] = useState<FeedbackSubmission[]>([])
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())

  useEffect(() => {
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

    const fetchSubmissions = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/feedback/tracks/${trackId}/submissions`)
        const json = await res.json()
        if (json.success) setSubmissions(json.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchSubmissions()
  }, [trackId])

  const toggleExpand = (id: number) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleApply = async () => {
    if (!track) return
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) {
      router.push("/login")
      return
    }
    setApplying(true)
    try {
      await applyFeedback(track.id as number)
      router.push(`/feedback/${track.id}/write`)
    } catch (err) {
      console.error(err)
    } finally {
      setApplying(false)
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

  const isClosed = track.status === "CLOSED" || track.status === "closed"

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 lg:px-6 lg:py-14">
      {/* Back */}
      <Link
        href="/feedback"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        피드백 목록으로 돌아가기
      </Link>

      {/* Track Info Card */}
      <div className="rounded-2xl bg-card p-6 shadow-sm sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Music className="h-7 w-7 text-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold sm:text-2xl">{track.title}</h1>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                  isClosed
                    ? "bg-muted text-muted-foreground"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {isClosed ? "마감" : "진행 중"}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">{track.artist}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl bg-muted/50 p-4">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Music className="h-3.5 w-3.5" />
              장르
            </span>
            <span className="mt-1 block text-sm font-semibold">
              {track.genre}
            </span>
          </div>
          <div className="rounded-xl bg-muted/50 p-4">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Coins className="h-3.5 w-3.5" />
              인당 보상
            </span>
            <span className="mt-1 block text-sm font-semibold text-primary">
              {track.maxApplicants && track.maxApplicants > 0
                ? Math.floor(track.reward / track.maxApplicants).toLocaleString()
                : track.reward.toLocaleString()}P
            </span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              총 {track.reward.toLocaleString()}P
            </span>
          </div>
          <div className="rounded-xl bg-muted/50 p-4">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              곡 길이
            </span>
            <span className="mt-1 block text-sm font-semibold">
              {track.duration}
            </span>
          </div>
          <div className="rounded-xl bg-muted/50 p-4">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              보상 인원
            </span>
            <span className="mt-1 block text-sm font-semibold">
              {track.maxApplicants}명
            </span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              신청 {track.applicants}명
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <h2 className="mb-2 text-sm font-semibold">곡 소개</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {track.description}
          </p>
        </div>

        {/* Audio Player Mock */}
        <div className="mt-6 rounded-xl bg-muted/50 p-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground"
            >
              <svg
                className="ml-0.5 h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <div className="flex-1">
              <div className="h-1.5 rounded-full bg-border">
                <div className="h-1.5 w-1/3 rounded-full bg-primary" />
              </div>
              <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                <span>1:24</span>
                <span>{track.duration}</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6">
          <Button
            size="lg"
            className="w-full"
            disabled={isClosed || applying}
            onClick={!isClosed ? handleApply : undefined}
          >
            {isClosed ? "마감됨" : applying ? "신청 중..." : "음악 듣고 피드백하기"}
          </Button>
          {!isClosed && (
            <p className="mt-2 text-center text-xs text-muted-foreground">
              로그인이 필요합니다
            </p>
          )}
        </div>
      </div>

      {/* Submissions */}
      {submissions.length > 0 && (
        <div className="mt-6 rounded-2xl bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold">
              다른 사람들의 피드백 ({submissions.length})
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {submissions.map((s) => {
              const isExpanded = expandedIds.has(s.id)
              return (
                <div key={s.id} className="rounded-xl border bg-muted/30">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium hover:bg-muted/50 rounded-xl transition-colors"
                    onClick={() => toggleExpand(s.id)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        사용자 #{s.userId}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[s.status] ?? "bg-muted text-muted-foreground"}`}>
                        {statusLabels[s.status] ?? s.status}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      {new Date(s.submittedAt).toLocaleDateString("ko-KR")}
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </span>
                  </button>
                  {isExpanded && (
                    <div className="border-t px-4 pb-4 pt-3 flex flex-col gap-3 text-sm">
                      <div>
                        <p className="mb-1 text-xs font-semibold text-muted-foreground">전체적인 인상</p>
                        <p className="leading-relaxed">{s.impression}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-xs font-semibold text-muted-foreground">좋았던 점</p>
                        <p className="leading-relaxed">{s.highlights}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-xs font-semibold text-muted-foreground">개선할 점</p>
                        <p className="leading-relaxed">{s.improvements}</p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
