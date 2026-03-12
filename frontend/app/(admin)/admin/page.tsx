"use client"

import { useEffect, useState } from "react"
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
import { Users, BookOpen, MessageSquare, CreditCard } from "lucide-react"
import { getDashboard, type AdminDashboard } from "@/lib/api/admin"

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
}

const statusLabels: Record<string, string> = {
  PENDING: "대기",
  APPROVED: "승인",
  REJECTED: "반려",
}

const roleLabels: Record<string, string> = {
  LISTENER: "리스너",
  ARTIST: "아티스트",
  PROFESSIONAL: "전문가",
  ADMIN: "관리자",
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) {
      router.push("/login")
      return
    }
    const fetchDashboard = async () => {
      try {
        const data = await getDashboard()
        setDashboard(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [router])

  if (loading) {
    return <p className="text-gray-500">로딩 중...</p>
  }

  if (!dashboard) {
    return <p className="text-gray-500">데이터를 불러올 수 없습니다.</p>
  }

  const stats = [
    {
      title: "총 회원수",
      value: dashboard.totalMembers,
      icon: Users,
      description: "전체 가입 회원",
    },
    {
      title: "매거진 수",
      value: dashboard.totalMagazines,
      icon: BookOpen,
      description: "게시된 아티클",
    },
    {
      title: "피드백 대기",
      value: dashboard.pendingFeedbacks,
      icon: MessageSquare,
      description: "승인 대기 중",
    },
    {
      title: "정산 대기",
      value: dashboard.pendingPayouts,
      icon: CreditCard,
      description: "처리 대기 중",
    },
  ]

  const recentFeedbacks = dashboard.recentFeedbacks ?? []
  const recentMembers = dashboard.recentMembers ?? []

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
                <Icon className="w-4 h-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Feedbacks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">최근 피드백 신청</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>곡명</TableHead>
                <TableHead>제출자</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>제출일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentFeedbacks.map((fb) => (
                <TableRow key={fb.id}>
                  <TableCell className="font-medium">{fb.trackTitle}</TableCell>
                  <TableCell className="text-gray-600">{fb.submitter}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariants[fb.status] ?? "outline"}>
                      {statusLabels[fb.status] ?? fb.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">{fb.submittedAt}</TableCell>
                </TableRow>
              ))}
              {recentFeedbacks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-400">데이터가 없습니다.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Members */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">최근 가입 회원</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이메일</TableHead>
                <TableHead>닉네임</TableHead>
                <TableHead>역할</TableHead>
                <TableHead>가입일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="text-gray-600">{member.email}</TableCell>
                  <TableCell className="font-medium">{member.nickname}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{roleLabels[member.role] ?? member.role}</Badge>
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">{member.joinedAt}</TableCell>
                </TableRow>
              ))}
              {recentMembers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-400">데이터가 없습니다.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
