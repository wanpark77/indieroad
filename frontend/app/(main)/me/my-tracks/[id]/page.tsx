"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Music, Clock, Coins, Users, ChevronDown, ChevronUp, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

const BASE_URL = "http://localhost:8080"

const statusLabels: Record<string, string> = {
  PENDING: "검수중",
  APPROVED: "승인",
  REJECTED: "반려",
}

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  APPROVED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-100 text-red-700",
}

interface Track {
  id: number
  title: string
  artist: string
  duration: string
  genre: string
  reward: number
  maxApplicants: number
  applicants: number
  description: string
  status: string
}

interface Submission {
  id: number
  userId: number
  impression: string
  highlights: string
  improvements: string
  status: string
  submittedAt: string
  reward: number
}

export default function MyTrackDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [track, setTrack] = useState<Track | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) { router.push("/login"); return }

    const fetchData = async () => {
      try {
        const [trackRes, subRes] = await Promise.all([
          fetch(`${BASE_URL}/api/feedback/tracks/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${BASE_URL}/api/feedback/my-tracks/${id}/submissions`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])
        const trackJson = await trackRes.json()
        const subJson = await subRes.json()
        if (trackJson.success) setTrack(trackJson.data)
        if (subJson.success) setSubmissions(subJson.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, router])

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  if (loading) return <p className="text-muted-foreground">로딩 중...</p>
  if (!track) return <p className="text-muted-foreground">트랙을 찾을 수 없습니다.</p>

  const perPersonReward = track.maxApplicants > 0
    ? Math.floor(track.reward / track.maxApplicants)
    : track.reward

  const isClosed = track.status === "CLOSED" || track.status === "closed"

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/me/my-tracks"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        내 신청곡 목록
      </Link>

      {/* 트랙 기본 정보 */}
      <div className="rounded-xl bg-card p-6 shadow-sm flex flex-col gap-5">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Music className="h-6 w-6 text-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold">{track.title}</h1>
              <span className={cn(
                "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                isClosed ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
              )}>
                {isClosed ? "마감" : "진행 중"}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">{track.artist}</span>
          </div>
        </div>

        {/* 스탯 */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-muted/50 p-4">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Music className="h-3.5 w-3.5" />장르
            </span>
            <span className="mt-1 block text-sm font-semibold">{track.genre}</span>
          </div>
          <div className="rounded-xl bg-muted/50 p-4">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />곡 길이
            </span>
            <span className="mt-1 block text-sm font-semibold">{track.duration}</span>
          </div>
          <div className="rounded-xl bg-muted/50 p-4">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Coins className="h-3.5 w-3.5" />인당 보상
            </span>
            <span className="mt-1 block text-sm font-semibold text-primary">{perPersonReward.toLocaleString()}P</span>
            <span className="text-xs text-muted-foreground">총 {track.reward.toLocaleString()}P</span>
          </div>
          <div className="rounded-xl bg-muted/50 p-4">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" />보상 인원
            </span>
            <span className="mt-1 block text-sm font-semibold">{track.maxApplicants}명</span>
            <span className="text-xs text-muted-foreground">신청 {track.applicants}명</span>
          </div>
        </div>

        {/* 곡 소개 */}
        <div>
          <p className="mb-1.5 text-sm font-semibold">곡 소개</p>
          <p className="text-sm leading-relaxed text-muted-foreground">{track.description}</p>
        </div>
      </div>

      {/* 피드백 목록 */}
      <div className="rounded-xl bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold">
            받은 피드백
            <span className="ml-1.5 text-sm font-normal text-muted-foreground">({submissions.length}건)</span>
          </h2>
        </div>

        {submissions.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">아직 피드백이 없습니다.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {submissions.map((sub) => {
              const isExpanded = expandedIds.has(sub.id)
              return (
                <div key={sub.id} className="rounded-xl border overflow-hidden">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-muted/40 transition-colors"
                    onClick={() => toggleExpand(sub.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-muted-foreground">사용자 #{sub.userId}</span>
                      <span className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        statusColors[sub.status] ?? "bg-muted text-muted-foreground"
                      )}>
                        {statusLabels[sub.status] ?? sub.status}
                      </span>
                      {sub.status === "APPROVED" && (
                        <span className="text-xs font-semibold text-primary">+{sub.reward.toLocaleString()}P 지급</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{typeof sub.submittedAt === "string" ? sub.submittedAt.split("T")[0] : ""}</span>
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="border-t px-4 pb-4 pt-3 bg-muted/20 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="mb-1 text-xs font-semibold text-muted-foreground">전체적인 인상</p>
                        <p className="leading-relaxed">{sub.impression}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-xs font-semibold text-muted-foreground">좋았던 점</p>
                        <p className="leading-relaxed">{sub.highlights}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-xs font-semibold text-muted-foreground">개선할 점</p>
                        <p className="leading-relaxed">{sub.improvements}</p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
