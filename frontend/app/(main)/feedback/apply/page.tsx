"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Music } from "lucide-react"
import { Button } from "@/components/ui/button"

const genres = ["발라드", "인디 팝", "어쿠스틱", "R&B", "포크", "밴드 팝", "재즈", "힙합", "일렉트로닉", "기타"]

export default function FeedbackApplyPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [mp3Checked, setMp3Checked] = useState(false)
  const [form, setForm] = useState({
    title: "",
    artist: "",
    duration: "",
    genre: "",
    reward: "1000",
    maxApplicants: "5",
    description: "",
  })

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const canSubmit =
    form.title &&
    form.artist &&
    form.duration &&
    form.genre &&
    form.reward &&
    form.maxApplicants &&
    form.description &&
    mp3Checked

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:8080/api/feedback/apply", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (json.success) {
        alert("피드백 신청이 완료되었습니다!")
        router.push("/feedback")
      } else {
        alert(json.message || "신청에 실패했습니다.")
      }
    } catch (err) {
      console.error(err)
      alert("신청 중 오류가 발생했습니다.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 lg:px-6 lg:py-14">
      <Link
        href="/feedback"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        피드백 목록으로
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">음원 피드백 신청</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          아티스트의 솔직한 피드백을 받아보세요. 승인된 피드백에는 포인트가 지급됩니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* 제목 */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            곡 제목 <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="예: 새벽 세시의 고백"
            required
          />
        </div>

        {/* 가수 */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            아티스트명 <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            value={form.artist}
            onChange={(e) => update("artist", e.target.value)}
            className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="예: 이수진"
            required
          />
        </div>

        {/* 곡 길이 / 장르 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              곡 길이 <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={form.duration}
              onChange={(e) => update("duration", e.target.value)}
              className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="예: 3:45"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              장르 <span className="text-destructive">*</span>
            </label>
            <select
              value={form.genre}
              onChange={(e) => update("genre", e.target.value)}
              className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              required
            >
              <option value="">장르 선택</option>
              {genres.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 총 보상 금액 / 보상 받을 사람 수 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              총 보상 금액 (포인트) <span className="text-destructive">*</span>
            </label>
            <input
              type="number"
              value={form.reward}
              onChange={(e) => update("reward", e.target.value)}
              className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="1000"
              min="100"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              보상 받을 사람 수 <span className="text-destructive">*</span>
            </label>
            <input
              type="number"
              value={form.maxApplicants}
              onChange={(e) => update("maxApplicants", e.target.value)}
              className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="5"
              min="1"
              max="50"
              required
            />
          </div>
        </div>
        {/* 인당 보상 미리보기 */}
        {form.reward && form.maxApplicants && Number(form.maxApplicants) > 0 && (
          <div className="rounded-lg bg-primary/5 border border-primary/20 px-4 py-3 text-sm">
            <span className="text-muted-foreground">인당 보상 금액: </span>
            <span className="font-semibold text-primary">
              {Math.floor(Number(form.reward) / Number(form.maxApplicants)).toLocaleString()}P
            </span>
            <span className="text-muted-foreground ml-1">
              ({Number(form.reward).toLocaleString()}P ÷ {form.maxApplicants}명)
            </span>
          </div>
        )}

        {/* 곡 소개 */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            곡 소개 <span className="text-destructive">*</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className="w-full resize-none rounded-lg border border-input bg-card px-4 py-2.5 text-sm leading-relaxed placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="곡에 대한 소개와 어떤 피드백을 원하는지 작성해주세요."
            rows={4}
            required
          />
        </div>

        {/* MP3 파일 확인 */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            MP3 파일 <span className="text-destructive">*</span>
          </label>
          <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${mp3Checked ? "border-primary bg-primary/5" : "border-input"}`}>
            <input
              type="checkbox"
              checked={mp3Checked}
              onChange={(e) => setMp3Checked(e.target.checked)}
              className="accent-primary h-4 w-4"
            />
            <div className="flex items-center gap-2">
              <Music className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">MP3 파일이 준비되어 있습니다</span>
            </div>
          </label>
          <p className="mt-1 text-xs text-muted-foreground">파일 업로드 기능은 준비 중입니다.</p>
        </div>

        {/* 안내 */}
        <div className="rounded-xl bg-muted/50 p-4 text-xs leading-relaxed text-muted-foreground">
          <p className="font-medium text-foreground">신청 전 확인사항</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>본인이 직접 창작한 곡만 신청 가능합니다.</li>
            <li>저작권 문제가 있는 곡은 신청이 반려됩니다.</li>
            <li>보상 포인트는 총 보상 금액 ÷ 보상 받을 사람 수로 인당 지급됩니다.</li>
            <li>신청 후 검토까지 1~2일이 소요될 수 있습니다.</li>
          </ul>
        </div>

        {/* 결제 내용 */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <p className="font-semibold text-sm">결제 내용</p>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>총 보상 금액</span>
              <span>{form.reward ? Number(form.reward).toLocaleString() : 0}원</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>서비스 수수료</span>
              <span>2,000원</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between font-bold text-base">
              <span>최종 결제 금액</span>
              <span className="text-primary">
                {(Number(form.reward || 0) + 2000).toLocaleString()}원
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
            취소
          </Button>
          <Button type="submit" className="flex-1" disabled={!canSubmit || submitting}>
            {submitting ? "신청 중..." : `총 ${(Number(form.reward || 0) + 2000).toLocaleString()}원 결제하기`}
          </Button>
        </div>
      </form>
    </div>
  )
}
