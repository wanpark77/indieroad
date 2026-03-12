import Link from "next/link"
import { Music, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FeedbackTrack {
  id: string | number
  title: string
  artist: string
  description: string
  applicants: number
  maxApplicants: number
  reward: number
  status: string
}

export function FeedbackCard({ track }: { track: FeedbackTrack }) {
  const isClosed = track.status === "closed" || track.status === "CLOSED"

  return (
    <div className="flex flex-col rounded-xl bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Music className="h-5 w-5 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">{track.title}</span>
          <span className="text-xs text-muted-foreground">{track.artist}</span>
        </div>
        <span
          className={`ml-auto rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
            isClosed
              ? "bg-muted text-muted-foreground"
              : "bg-primary/10 text-primary"
          }`}
        >
          {isClosed ? "마감" : "진행 중"}
        </span>
      </div>
      <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
        {track.description}
      </p>
      <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {track.applicants}/{track.maxApplicants}명
        </span>
        <span className="font-medium text-primary">
          {track.reward.toLocaleString()}원
        </span>
      </div>
      <Button
        size="sm"
        variant={isClosed ? "outline" : "default"}
        disabled={isClosed}
        className="w-full"
        asChild={!isClosed}
      >
        {isClosed ? (
          <span>마감됨</span>
        ) : (
          <Link href={`/feedback/${track.id}`}>이 곡 피드백하기</Link>
        )}
      </Button>
    </div>
  )
}
