"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Music, PenLine, Users, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { FeedbackTrack } from "@/lib/api/feedback"

const BASE_URL = "http://localhost:8080"

export default function MyTracksPage() {
  const router = useRouter()
  const [tracks, setTracks] = useState<FeedbackTrack[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) { router.push("/login"); return }

    const fetchMyTracks = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/feedback/my-tracks`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const json = await res.json()
        if (json.success) setTracks(json.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchMyTracks()
  }, [router])

  if (loading) return <p className="text-muted-foreground">로딩 중...</p>

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">내 신청곡</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            피드백 신청한 곡을 확인하고 수정할 수 있어요.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/feedback/apply">
            <PenLine className="mr-1.5 h-4 w-4" />
            새 곡 신청
          </Link>
        </Button>
      </div>

      {tracks.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl bg-card py-16 text-center shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Music className="h-7 w-7 text-primary" />
          </div>
          <div>
            <p className="font-medium">신청한 곡이 없어요</p>
            <p className="mt-1 text-sm text-muted-foreground">
              피드백을 받고 싶은 곡을 신청해보세요
            </p>
          </div>
          <Button asChild>
            <Link href="/feedback/apply">음원 피드백 신청하기</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {tracks.map((track) => (
            <Link
              key={track.id}
              href={`/me/my-tracks/${track.id}`}
              className="group flex items-center gap-4 rounded-xl bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Music className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="font-semibold group-hover:text-primary">{track.title}</p>
                <p className="text-sm text-muted-foreground">{track.artist} · {track.genre}</p>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    신청 {track.applicants ?? 0}명 · 보상 {track.maxApplicants}명
                  </span>
                  <span>
                    인당 {track.maxApplicants && track.maxApplicants > 0
                      ? Math.floor((track.reward ?? 0) / track.maxApplicants).toLocaleString()
                      : (track.reward ?? 0).toLocaleString()}P
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-medium ${
                      track.status === "OPEN"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {track.status === "OPEN" ? "진행 중" : "마감"}
                  </span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
