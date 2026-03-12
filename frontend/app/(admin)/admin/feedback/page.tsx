"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
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
import { ChevronRight } from "lucide-react"
import { adminGetFeedbackTracks } from "@/lib/api/admin"
import type { FeedbackTrack } from "@/lib/api/feedback"

export default function AdminFeedbackPage() {
  const router = useRouter()
  const [tracks, setTracks] = useState<FeedbackTrack[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) {
      router.push("/login")
      return
    }
    const fetchTracks = async () => {
      try {
        const data = await adminGetFeedbackTracks()
        setTracks(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchTracks()
  }, [router])

  if (loading) {
    return <p className="text-gray-500">로딩 중...</p>
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">총 {tracks.length}개의 피드백 트랙</p>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>곡명</TableHead>
                <TableHead>아티스트</TableHead>
                <TableHead>장르</TableHead>
                <TableHead>신청/보상인원</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>인당 보상</TableHead>
                <TableHead className="text-right">액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tracks.map((track) => (
                <TableRow key={track.id}>
                  <TableCell className="font-medium">{track.title}</TableCell>
                  <TableCell className="text-gray-600">{track.artist}</TableCell>
                  <TableCell className="text-gray-600">{track.genre}</TableCell>
                  <TableCell className="text-gray-600">
                    {track.applicants}명 / {track.maxApplicants}명
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={track.status === "OPEN" ? "default" : "secondary"}
                      className={
                        track.status === "OPEN"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-gray-100 text-gray-600"
                      }
                    >
                      {track.status === "OPEN" ? "OPEN" : "CLOSED"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {track.maxApplicants && track.maxApplicants > 0
                      ? Math.floor(track.reward / track.maxApplicants).toLocaleString()
                      : track.reward.toLocaleString()}P
                    <span className="ml-1 text-xs text-gray-400">(총 {track.reward.toLocaleString()}P)</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/feedback/${track.id}`}>
                        <ChevronRight className="w-3.5 h-3.5 mr-1" />
                        제출 목록
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
