"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { myPromotions } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Music, Plus, Users, Eye, EyeOff } from "lucide-react"

const statusLabels: Record<string, string> = {
  waiting: "대기",
  "in-progress": "진행 중",
  review: "검수 중",
  complete: "완료",
}

const statusColors: Record<string, string> = {
  waiting: "bg-muted text-muted-foreground",
  "in-progress": "bg-blue-100 text-blue-700",
  review: "bg-amber-100 text-amber-700",
  complete: "bg-emerald-100 text-emerald-700",
}

// Mock feedback data for a completed promotion
const mockReceivedFeedbacks = [
  {
    id: "rf1",
    nickname: "음악좋아",
    type: "리스너",
    status: "approved" as const,
    submittedAt: "2026-01-15",
  },
  {
    id: "rf2",
    nickname: "인디팬",
    type: "리스너",
    status: "approved" as const,
    submittedAt: "2026-01-16",
  },
  {
    id: "rf3",
    nickname: "뮤직러버",
    type: "리스너",
    status: "approved" as const,
    submittedAt: "2026-01-18",
  },
]

export default function MyPromotionsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">내 홍보곡</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            피드백 신청한 음악의 진행 상태를 확인하세요.
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href="/feedback">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            새 피드백 요청
          </Link>
        </Button>
      </div>

      {myPromotions.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Music className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            아직 신청한 홍보곡이 없습니다.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {myPromotions.map((promo) => (
            <div
              key={promo.id}
              className="rounded-xl bg-card shadow-sm"
            >
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Music className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-semibold">
                      {promo.trackTitle}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {promo.applicants}/{promo.maxApplicants}명
                      </span>
                      <span>{promo.createdAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium",
                      statusColors[promo.status],
                    )}
                  >
                    {statusLabels[promo.status]}
                  </span>
                  {promo.status === "complete" && (
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedId(
                          expandedId === promo.id ? null : promo.id,
                        )
                      }
                      className="rounded-lg p-2 text-muted-foreground hover:bg-accent"
                      aria-label="피드백 보기"
                    >
                      {expandedId === promo.id ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Expandable feedback list (read only) */}
              {expandedId === promo.id && promo.status === "complete" && (
                <div className="border-t border-border px-5 pb-5 pt-4">
                  <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
                    받은 피드백 ({mockReceivedFeedbacks.length}건)
                  </h3>
                  <div className="flex flex-col gap-2">
                    {mockReceivedFeedbacks.map((fb) => (
                      <div
                        key={fb.id}
                        className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                            {fb.nickname.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {fb.nickname}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {fb.type} &middot; {fb.submittedAt}
                            </span>
                          </div>
                        </div>
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                          승인
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    피드백 내용은 읽기 전용이며, 수정 및 답글은 불가합니다.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Status description */}
      <div className="rounded-xl bg-muted/50 p-5">
        <h3 className="mb-3 text-sm font-semibold">상태 안내</h3>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-16 rounded-full bg-muted px-2 py-0.5 text-center text-xs font-medium text-muted-foreground">
              대기
            </span>
            <span>리스너 모집 중</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-16 rounded-full bg-blue-100 px-2 py-0.5 text-center text-xs font-medium text-blue-700">
              진행 중
            </span>
            <span>모집 인원 충족, 피드백 작성 중</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-16 rounded-full bg-amber-100 px-2 py-0.5 text-center text-xs font-medium text-amber-700">
              검수 중
            </span>
            <span>모든 피드백 제출 완료, 관리자 검수 중</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-16 rounded-full bg-emerald-100 px-2 py-0.5 text-center text-xs font-medium text-emerald-700">
              완료
            </span>
            <span>검수 승인 완료</span>
          </div>
        </div>
      </div>
    </div>
  )
}
