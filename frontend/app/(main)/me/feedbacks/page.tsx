"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { MessageSquare, ChevronDown, ChevronUp } from "lucide-react"
import { getMyFeedbacks, type FeedbackSubmission } from "@/lib/api/feedback"

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

const filterOptions = [
  { value: "all", label: "전체" },
  { value: "PENDING", label: "검수중" },
  { value: "APPROVED", label: "승인" },
  { value: "REJECTED", label: "반려" },
]

export default function MyFeedbacksPage() {
  const router = useRouter()
  const [feedbacks, setFeedbacks] = useState<FeedbackSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) {
      router.push("/login")
      return
    }
    const fetchFeedbacks = async () => {
      try {
        const data = await getMyFeedbacks()
        setFeedbacks(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchFeedbacks()
  }, [router])

  const filtered =
    filter === "all"
      ? feedbacks
      : feedbacks.filter((f) => f.status === filter)

  if (loading) {
    return <p className="text-muted-foreground">로딩 중...</p>
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">내 피드백</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          참여한 피드백 내역을 확인하세요.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setFilter(opt.value)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              filter === opt.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            해당하는 피드백 내역이 없습니다.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((fb) => {
            const isExpanded = expandedIds.has(fb.id)
            return (
              <div key={fb.id} className="rounded-xl bg-card shadow-sm overflow-hidden">
                <button
                  type="button"
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
                  onClick={() => toggleExpand(fb.id)}
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-semibold">
                      {fb.trackTitle ?? `트랙 #${fb.trackId}`}
                    </span>
                    {fb.trackArtist && (
                      <span className="text-sm text-muted-foreground">{fb.trackArtist}</span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      제출일: {typeof fb.submittedAt === "string" ? fb.submittedAt.split("T")[0] : ""}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-4 shrink-0">
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium",
                        statusColors[fb.status] ?? "bg-muted text-muted-foreground",
                      )}
                    >
                      {statusLabels[fb.status] ?? fb.status}
                    </span>
                    {fb.status === "APPROVED" && (
                      <span className="text-sm font-bold text-primary">
                        +{fb.reward.toLocaleString()}P
                      </span>
                    )}
                    {fb.status === "REJECTED" && (
                      <span className="text-xs text-muted-foreground">포인트 미지급</span>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>
                {isExpanded && (
                  <div className="border-t px-5 pb-5 pt-4 flex flex-col gap-4 text-sm bg-muted/20">
                    <div>
                      <p className="mb-1 text-xs font-semibold text-muted-foreground">전체적인 인상</p>
                      <p className="leading-relaxed">{fb.impression}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-semibold text-muted-foreground">좋았던 점</p>
                      <p className="leading-relaxed">{fb.highlights}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-semibold text-muted-foreground">개선할 점</p>
                      <p className="leading-relaxed">{fb.improvements}</p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Summary */}
      <div className="rounded-xl bg-muted/50 p-5">
        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground">전체 참여</span>
            <span className="text-lg font-bold">{feedbacks.length}건</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground">승인</span>
            <span className="text-lg font-bold text-emerald-600">
              {feedbacks.filter((f) => f.status === "APPROVED").length}건
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground">검수중</span>
            <span className="text-lg font-bold text-amber-600">
              {feedbacks.filter((f) => f.status === "PENDING").length}건
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground">총 적립</span>
            <span className="text-lg font-bold text-primary">
              {feedbacks
                .filter((f) => f.status === "APPROVED")
                .reduce((sum, f) => sum + f.reward, 0)
                .toLocaleString()}
              P
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
