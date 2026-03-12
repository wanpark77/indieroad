"use client"

import { useState, use, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react"
import {
  adminGetFeedbackTracks,
  adminGetFeedbackSubmissions,
  approveSubmission,
  rejectSubmission,
  type AdminFeedbackSubmission,
} from "@/lib/api/admin"
import type { FeedbackTrack } from "@/lib/api/feedback"

type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED"

const statusVariants: Record<SubmissionStatus, "default" | "secondary" | "destructive"> = {
  PENDING: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
}

const statusLabels: Record<SubmissionStatus, string> = {
  PENDING: "대기",
  APPROVED: "승인",
  REJECTED: "반려",
}

export default function AdminFeedbackSubmissionsPage({
  params,
}: {
  params: Promise<{ trackId: string }>
}) {
  const { trackId } = use(params)
  const router = useRouter()
  const [track, setTrack] = useState<FeedbackTrack | null>(null)
  const [submissions, setSubmissions] = useState<AdminFeedbackSubmission[]>([])
  const [loading, setLoading] = useState(true)
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
    const fetchData = async () => {
      try {
        const [tracks, allSubmissions] = await Promise.all([
          adminGetFeedbackTracks(),
          adminGetFeedbackSubmissions(),
        ])
        const foundTrack = tracks.find((t: FeedbackTrack) => String(t.id) === trackId)
        setTrack(foundTrack ?? null)
        const filtered = allSubmissions.filter(
          (s: AdminFeedbackSubmission) => String(s.trackId) === trackId
        )
        setSubmissions(filtered)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [trackId, router])

  const handleApprove = async (id: number) => {
    try {
      const updated = await approveSubmission(id)
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? updated : s))
      )
    } catch (err) {
      console.error(err)
    }
  }

  const handleReject = async (id: number) => {
    try {
      const updated = await rejectSubmission(id)
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? updated : s))
      )
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return <p className="text-gray-500">로딩 중...</p>
  }

  if (!track) {
    return <p className="text-gray-500">트랙을 찾을 수 없습니다.</p>
  }

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={() => router.back()} className="gap-2 -ml-2">
        <ArrowLeft className="w-4 h-4" />
        트랙 목록으로
      </Button>

      {/* Track Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{track.title}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-0">
          <div>
            <p className="text-xs text-gray-400">아티스트</p>
            <p className="text-sm font-medium">{track.artist}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">장르</p>
            <p className="text-sm font-medium">{track.genre}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">신청 현황</p>
            <p className="text-sm font-medium">
              신청 {track.applicants}명 / 보상 {track.maxApplicants}명
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">인당 보상</p>
            <p className="text-sm font-medium">
              {track.maxApplicants && track.maxApplicants > 0
                ? Math.floor(track.reward / track.maxApplicants).toLocaleString()
                : track.reward.toLocaleString()}P
            </p>
            <p className="text-xs text-gray-400">총 {track.reward.toLocaleString()}P</p>
          </div>
        </CardContent>
      </Card>

      {/* Submissions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            피드백 제출 목록
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({submissions.length}건)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {submissions.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              아직 제출된 피드백이 없습니다.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>제출자</TableHead>
                  <TableHead>제출일</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead className="text-right">액션</TableHead>
                  <TableHead className="w-8" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((sub) => {
                  const status = sub.status as SubmissionStatus
                  const isExpanded = expandedIds.has(sub.id as number)
                  return (
                    <>
                      <TableRow
                        key={sub.id}
                        className="cursor-pointer hover:bg-muted/40"
                        onClick={() => toggleExpand(sub.id as number)}
                      >
                        <TableCell className="font-medium">{sub.submitterNickname}</TableCell>
                        <TableCell className="text-gray-500 text-sm">
                          {typeof sub.submittedAt === "string" ? sub.submittedAt.split("T")[0] : sub.submittedAt}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusVariants[status] ?? "secondary"}>
                            {statusLabels[status] ?? status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApprove(sub.id as number)}
                              disabled={sub.status !== "PENDING"}
                              className="gap-1 text-green-600 border-green-200 hover:bg-green-50 disabled:opacity-40"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              승인
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReject(sub.id as number)}
                              disabled={sub.status !== "PENDING"}
                              className="gap-1 text-red-500 border-red-200 hover:bg-red-50 disabled:opacity-40"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              반려
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-gray-400 mx-auto" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400 mx-auto" />
                          )}
                        </TableCell>
                      </TableRow>
                      {isExpanded && (
                        <TableRow key={`${sub.id}-detail`} className="bg-muted/20 hover:bg-muted/20">
                          <TableCell colSpan={5} className="px-6 py-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="mb-1 text-xs font-semibold text-muted-foreground">전체적인 인상</p>
                                <p className="leading-relaxed text-gray-700">{sub.impression}</p>
                              </div>
                              <div>
                                <p className="mb-1 text-xs font-semibold text-muted-foreground">좋았던 점</p>
                                <p className="leading-relaxed text-gray-700">{sub.highlights}</p>
                              </div>
                              <div>
                                <p className="mb-1 text-xs font-semibold text-muted-foreground">개선할 점</p>
                                <p className="leading-relaxed text-gray-700">{sub.improvements}</p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
