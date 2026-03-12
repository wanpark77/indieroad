"use client"

import { useState, useEffect } from "react"
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
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { getPayouts, processPayout, type AdminPayout } from "@/lib/api/admin"

type PayoutStatus = "PENDING" | "PAID"

const statusVariants: Record<PayoutStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-green-100 text-green-700",
}

const statusLabels: Record<PayoutStatus, string> = {
  PENDING: "대기",
  PAID: "완료",
}

export default function AdminPayoutPage() {
  const router = useRouter()
  const [payouts, setPayouts] = useState<AdminPayout[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) {
      router.push("/login")
      return
    }
    const fetchPayouts = async () => {
      try {
        const data = await getPayouts()
        setPayouts(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchPayouts()
  }, [router])

  const pendingPayouts = payouts.filter((p) => p.status === "PENDING")
  const totalPendingAmount = pendingPayouts.reduce((sum, p) => sum + p.amount, 0)

  const handleProcess = async (id: number) => {
    try {
      const updated = await processPayout(id)
      setPayouts((prev) =>
        prev.map((p) => (p.id === id ? updated : p))
      )
    } catch (err) {
      console.error(err)
    }
  }

  const handleProcessAll = async () => {
    if (pendingPayouts.length === 0) return
    if (!confirm(`${pendingPayouts.length}건의 정산을 일괄 처리하시겠습니까?`)) return
    try {
      await Promise.all(pendingPayouts.map((p) => processPayout(p.id as number)))
      const data = await getPayouts()
      setPayouts(data)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return <p className="text-gray-500">로딩 중...</p>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            대기 중: <strong className="text-gray-900">{pendingPayouts.length}건</strong>
            <span className="mx-2 text-gray-300">|</span>
            총 대기 금액:{" "}
            <strong className="text-gray-900">{totalPendingAmount.toLocaleString()}P</strong>
          </p>
        </div>
        <Button
          onClick={handleProcessAll}
          disabled={pendingPayouts.length === 0}
          className="gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          일괄 정산 처리 ({pendingPayouts.length}건)
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>회원</TableHead>
                <TableHead>금액</TableHead>
                <TableHead>유형</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>생성일</TableHead>
                <TableHead>처리일</TableHead>
                <TableHead className="text-right">액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((payout) => {
                const status = payout.status as PayoutStatus
                return (
                  <TableRow key={payout.id}>
                    <TableCell className="font-medium">{payout.memberNickname}</TableCell>
                    <TableCell className="text-gray-700 font-medium">
                      {payout.amount.toLocaleString()}P
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">{payout.type}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusVariants[status] ?? "bg-gray-100 text-gray-700"}`}
                      >
                        {statusLabels[status] ?? status}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {typeof payout.createdAt === "string" ? payout.createdAt.split("T")[0] : payout.createdAt}
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {payout.processedAt
                        ? typeof payout.processedAt === "string"
                          ? payout.processedAt.split("T")[0]
                          : payout.processedAt
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleProcess(payout.id as number)}
                        disabled={payout.status === "PAID"}
                        className="gap-1 disabled:opacity-40"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        처리
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
