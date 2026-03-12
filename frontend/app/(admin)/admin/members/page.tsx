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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserCog, Coins } from "lucide-react"
import { getMembers, updateMemberRole, updateMemberPoints, type AdminMember } from "@/lib/api/admin"

type AdminRole = "LISTENER" | "ARTIST" | "PROFESSIONAL" | "ADMIN"

const roleLabels: Record<AdminRole, string> = {
  LISTENER: "리스너",
  ARTIST: "아티스트",
  PROFESSIONAL: "전문가",
  ADMIN: "관리자",
}

const roleBadgeVariants: Record<AdminRole, string> = {
  LISTENER: "bg-blue-100 text-blue-700",
  ARTIST: "bg-purple-100 text-purple-700",
  PROFESSIONAL: "bg-orange-100 text-orange-700",
  ADMIN: "bg-red-100 text-red-700",
}

export default function AdminMembersPage() {
  const router = useRouter()
  const [members, setMembers] = useState<AdminMember[]>([])
  const [loading, setLoading] = useState(true)

  const [roleDialogOpen, setRoleDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<AdminMember | null>(null)
  const [newRole, setNewRole] = useState<AdminRole>("LISTENER")

  const [pointsDialogOpen, setPointsDialogOpen] = useState(false)
  const [pointsAmount, setPointsAmount] = useState("")

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) {
      router.push("/login")
      return
    }
    const fetchMembers = async () => {
      try {
        const data = await getMembers()
        setMembers(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchMembers()
  }, [router])

  const openRoleDialog = (member: AdminMember) => {
    setSelectedMember(member)
    setNewRole(member.role as AdminRole)
    setRoleDialogOpen(true)
  }

  const openPointsDialog = (member: AdminMember) => {
    setSelectedMember(member)
    setPointsAmount("")
    setPointsDialogOpen(true)
  }

  const handleRoleChange = async () => {
    if (!selectedMember) return
    try {
      const updated = await updateMemberRole(selectedMember.id as number, newRole)
      setMembers((prev) =>
        prev.map((m) => (m.id === selectedMember.id ? updated : m))
      )
    } catch (err) {
      console.error(err)
    } finally {
      setRoleDialogOpen(false)
    }
  }

  const handlePointsChange = async () => {
    if (!selectedMember) return
    const amount = parseInt(pointsAmount)
    if (isNaN(amount)) return
    try {
      const updated = await updateMemberPoints(selectedMember.id as number, amount)
      setMembers((prev) =>
        prev.map((m) => (m.id === selectedMember.id ? updated : m))
      )
    } catch (err) {
      console.error(err)
    } finally {
      setPointsDialogOpen(false)
    }
  }

  if (loading) {
    return <p className="text-gray-500">로딩 중...</p>
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">총 {members.length}명의 회원</p>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이메일</TableHead>
                <TableHead>닉네임</TableHead>
                <TableHead>역할</TableHead>
                <TableHead>포인트</TableHead>
                <TableHead>가입일</TableHead>
                <TableHead className="text-right">액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => {
                const role = member.role as AdminRole
                return (
                  <TableRow key={member.id}>
                    <TableCell className="text-gray-600">{member.email}</TableCell>
                    <TableCell className="font-medium">
                      {member.nickname}
                      {member.artistName && (
                        <span className="text-xs text-gray-400 ml-1">({member.artistName})</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${roleBadgeVariants[role] ?? "bg-gray-100 text-gray-700"}`}
                      >
                        {roleLabels[role] ?? role}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600 font-medium">
                      {member.points.toLocaleString()}P
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {typeof member.createdAt === "string" ? member.createdAt.split("T")[0] : member.createdAt}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openRoleDialog(member)}
                          className="gap-1"
                        >
                          <UserCog className="w-3.5 h-3.5" />
                          역할
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openPointsDialog(member)}
                          className="gap-1"
                        >
                          <Coins className="w-3.5 h-3.5" />
                          포인트
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Role Change Dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>역할 변경</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-gray-500">
              <strong>{selectedMember?.nickname}</strong> 회원의 역할을 변경합니다.
            </p>
            <div className="space-y-1.5">
              <Label>새 역할</Label>
              <Select
                value={newRole}
                onValueChange={(v) => setNewRole(v as AdminRole)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LISTENER">리스너</SelectItem>
                  <SelectItem value="ARTIST">아티스트</SelectItem>
                  <SelectItem value="PROFESSIONAL">전문가</SelectItem>
                  <SelectItem value="ADMIN">관리자</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleRoleChange}>변경</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Points Dialog */}
      <Dialog open={pointsDialogOpen} onOpenChange={setPointsDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>포인트 지급/차감</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-gray-500">
              <strong>{selectedMember?.nickname}</strong> 회원의 포인트를 조정합니다.
              <br />
              현재 포인트: <strong>{selectedMember?.points.toLocaleString()}P</strong>
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="amount">금액 (양수: 지급, 음수: 차감)</Label>
              <Input
                id="amount"
                type="number"
                value={pointsAmount}
                onChange={(e) => setPointsAmount(e.target.value)}
                placeholder="예: 1000 또는 -500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPointsDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handlePointsChange}>적용</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
