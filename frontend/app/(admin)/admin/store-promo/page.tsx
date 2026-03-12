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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { MapPin, Clock, Music, Plus, Pencil } from "lucide-react"
import {
  adminGetStores,
  adminCreateStore,
  adminUpdateStore,
  adminGetPromoApplications,
  type PromoApplicationResponse,
  type AdminStoreRequest,
} from "@/lib/api/admin"
import type { StorePromo } from "@/lib/api/store-promo"

const MOOD_OPTIONS = [
  "포크, 어쿠스틱",
  "R&B, 힙합",
  "인디",
  "팝",
  "발라드",
  "클래식",
  "기타",
]

const EMPTY_FORM: AdminStoreRequest = {
  name: "",
  location: "",
  hours: "",
  mood: "",
  currentTrack: "",
  currentArtist: "",
}

// mood 문자열 ↔ 배열 변환 헬퍼
const moodToArray = (mood: string) =>
  mood ? mood.split("|").map((m) => m.trim()).filter(Boolean) : []
const arrayToMood = (arr: string[]) => arr.join("|")

export default function AdminStorePromoPage() {
  const router = useRouter()
  const [stores, setStores] = useState<StorePromo[]>([])
  const [applications, setApplications] = useState<PromoApplicationResponse[]>([])
  const [loading, setLoading] = useState(true)

  // 다이얼로그 상태
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingStore, setEditingStore] = useState<StorePromo | null>(null)
  const [form, setForm] = useState<AdminStoreRequest>(EMPTY_FORM)
  const [selectedMoods, setSelectedMoods] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) {
      router.push("/login")
      return
    }
    const fetchData = async () => {
      try {
        const [storeData, appData] = await Promise.all([
          adminGetStores(),
          adminGetPromoApplications(),
        ])
        setStores(storeData)
        setApplications(appData)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [router])

  const openCreate = () => {
    setEditingStore(null)
    setForm(EMPTY_FORM)
    setSelectedMoods([])
    setDialogOpen(true)
  }

  const openEdit = (store: StorePromo) => {
    setEditingStore(store)
    setForm({
      name: store.name,
      location: store.location,
      hours: store.hours,
      mood: store.mood,
      currentTrack: store.currentTrack ?? "",
      currentArtist: store.currentArtist ?? "",
    })
    setSelectedMoods(moodToArray(store.mood))
    setDialogOpen(true)
  }

  const handleChange = (field: keyof AdminStoreRequest, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const toggleMood = (mood: string) => {
    setSelectedMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedMoods.length === 0) {
      alert("무드를 하나 이상 선택해주세요.")
      return
    }
    const payload: AdminStoreRequest = { ...form, mood: arrayToMood(selectedMoods) }
    setSubmitting(true)
    try {
      if (editingStore) {
        const updated = await adminUpdateStore(editingStore.id, payload)
        setStores((prev) => prev.map((s) => (s.id === editingStore.id ? updated : s)))
      } else {
        const created = await adminCreateStore(payload)
        setStores((prev) => [...prev, created])
      }
      setDialogOpen(false)
    } catch (err) {
      console.error(err)
      alert("저장에 실패했습니다.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <p className="text-gray-500">로딩 중...</p>
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="stores">
        <TabsList>
          <TabsTrigger value="stores">매장 목록</TabsTrigger>
          <TabsTrigger value="applications">홍보 신청 목록</TabsTrigger>
        </TabsList>

        {/* 매장 목록 탭 */}
        <TabsContent value="stores" className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">총 {stores.length}개의 매장</p>
            <Button size="sm" className="gap-1.5" onClick={openCreate}>
              <Plus className="w-4 h-4" />
              매장 추가
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>매장명</TableHead>
                    <TableHead>위치</TableHead>
                    <TableHead>영업시간</TableHead>
                    <TableHead>무드</TableHead>
                    <TableHead>현재 트랙</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stores.map((store) => (
                    <TableRow key={store.id}>
                      <TableCell className="font-medium">{store.name}</TableCell>
                      <TableCell className="text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {store.location}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {store.hours}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm">
                        <div className="flex flex-wrap gap-1">
                          {moodToArray(store.mood).map((m) => (
                            <span key={m} className="rounded-full bg-muted px-2 py-0.5 text-xs">
                              {m}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        <span className="flex items-center gap-1">
                          <Music className="w-3.5 h-3.5 text-gray-400" />
                          {store.currentTrack}
                          {store.currentArtist && (
                            <span className="text-gray-400">— {store.currentArtist}</span>
                          )}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => openEdit(store)}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {stores.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-400">
                        데이터가 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 홍보 신청 목록 탭 */}
        <TabsContent value="applications" className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">총 {applications.length}건의 신청</p>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>트랙명</TableHead>
                    <TableHead>플랜</TableHead>
                    <TableHead>기간</TableHead>
                    <TableHead>상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="text-gray-600">{app.trackTitle}</TableCell>
                      <TableCell className="text-gray-500 text-sm">{app.plan}</TableCell>
                      <TableCell className="text-gray-500 text-sm">
                        {app.startDate} ~ {app.endDate}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={app.status === "ACTIVE" ? "default" : "secondary"}
                          className={
                            app.status === "ACTIVE"
                              ? "bg-green-100 text-green-700 border-green-200"
                              : "bg-gray-100 text-gray-600"
                          }
                        >
                          {app.status === "ACTIVE" ? "진행 중" : app.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {applications.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-gray-400">
                        데이터가 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 매장 추가/수정 다이얼로그 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingStore ? "매장 수정" : "매장 추가"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">매장명 *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="예: 카페 인디로드"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="location">위치 *</Label>
              <Input
                id="location"
                value={form.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="예: 서울 마포구 홍대"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="hours">영업시간 *</Label>
              <Input
                id="hours"
                value={form.hours}
                onChange={(e) => handleChange("hours", e.target.value)}
                placeholder="예: 10:00 - 22:00"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>무드 선택 * (복수 선택 가능)</Label>
              <div className="flex flex-col gap-2 rounded-lg border border-input p-3">
                {MOOD_OPTIONS.map((mood) => (
                  <label key={mood} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedMoods.includes(mood)}
                      onChange={() => toggleMood(mood)}
                      className="accent-primary"
                    />
                    <span className="text-sm">{mood}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="currentTrack">현재 트랙</Label>
              <Input
                id="currentTrack"
                value={form.currentTrack}
                onChange={(e) => handleChange("currentTrack", e.target.value)}
                placeholder="예: 봄날"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="currentArtist">현재 아티스트</Label>
              <Input
                id="currentArtist"
                value={form.currentArtist}
                onChange={(e) => handleChange("currentArtist", e.target.value)}
                placeholder="예: 방탄소년단"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                취소
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "처리 중..." : editingStore ? "저장하기" : "등록하기"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
