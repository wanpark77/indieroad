"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { FeedbackCard } from "@/components/feedback-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { PenLine } from "lucide-react"
import { getTracks, type FeedbackTrack } from "@/lib/api/feedback"

type FilterStatus = "all" | "OPEN" | "CLOSED"

export default function FeedbackPage() {
  const [tracks, setTracks] = useState<FeedbackTrack[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<FilterStatus>("all")

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const data = await getTracks()
        setTracks(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchTracks()
  }, [])

  const filtered = useMemo(() => {
    if (status === "all") return tracks
    return tracks.filter((t) => t.status === status)
  }, [tracks, status])

  const openCount = tracks.filter((t) => t.status === "OPEN").length
  const closedCount = tracks.filter((t) => t.status === "CLOSED").length

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:px-6 lg:py-14">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">음악 피드백</h1>
          <p className="mt-2 text-muted-foreground">
            음악을 듣고 솔직한 피드백을 남겨주세요. 승인 시 포인트가 적립됩니다.
          </p>
        </div>
        <Button asChild>
          <Link href="/feedback/apply">
            <PenLine className="mr-2 h-4 w-4" />
            음원 피드백 신청하기
          </Link>
        </Button>
      </div>

      {/* Status Tabs */}
      <div className="mb-8 flex gap-2">
        {(
          [
            { value: "all", label: `전체 (${tracks.length})` },
            { value: "OPEN", label: `진행 중 (${openCount})` },
            { value: "CLOSED", label: `마감 (${closedCount})` },
          ] as { value: FilterStatus; label: string }[]
        ).map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setStatus(tab.value)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              status === tab.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <p className="text-muted-foreground">로딩 중...</p>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((track) => (
              <FeedbackCard key={track.id} track={track} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center py-20 text-center">
              <p className="text-muted-foreground">
                해당 상태의 곡이 없습니다.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
