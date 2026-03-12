"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getStores, applyStorePromo, type StorePromo } from "@/lib/api/store-promo"

const tempoOptions = [
  { value: "느림", label: "느림" },
  { value: "잔잔함", label: "잔잔함" },
  { value: "보통", label: "보통" },
  { value: "활기찬", label: "활기찬" },
  { value: "빠름", label: "빠름" },
]

const moodOptions = [
  "포크, 어쿠스틱",
  "R&B, 힙합",
  "인디",
  "팝",
  "발라드",
  "클래식",
  "기타",
]

const planOptions = [
  { value: "A", label: "플랜 A: 1개월 (4주)", price: 15000, weeks: 4 },
  { value: "B", label: "플랜 B: 3개월 (12주)", price: 45000, weeks: 12 },
  { value: "C", label: "플랜 C: 1년 (48주)", price: 180000, weeks: 48 },
]

const referralOptions = [
  "인스타그램 광고",
  "매거진 콘텐츠",
  "지인의 인스타그램",
  "지인 추천",
  "기타",
]

function addWeeks(date: Date, weeks: number): string {
  const d = new Date(date)
  d.setDate(d.getDate() + weeks * 7)
  return d.toISOString().split("T")[0]
}

export default function StorePromoApplyPage() {
  const router = useRouter()
  const [stores, setStores] = useState<StorePromo[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getStores().then(setStores).catch(console.error)
  }, [])

  const [form, setForm] = useState({
    trackTitle: "",
    artistName: "",
    genre: "",
    tempo: "",
    description: "",
    mood: "",
    moodOther: "",
    storeId: "",
    plan: "",
    youtubeRelease: "",
    youtubeUrl: "",
    referral: "",
    referralOther: "",
  })

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const availableStores = useMemo(() => {
    if (!form.mood) return []
    const selectedMood = form.mood === "기타" ? form.moodOther.trim() : form.mood
    if (!selectedMood) return []
    return stores.filter((s) =>
      s.mood.split("|").map((m) => m.trim()).some((m) => m === selectedMood || m === form.mood)
    )
  }, [form.mood, form.moodOther, stores])

  const selectedPlan = planOptions.find((p) => p.value === form.plan)
  const selectedStore = stores.find((s) => String(s.id) === form.storeId)
  const basePrice = selectedPlan?.price ?? 0
  const vat = Math.floor(basePrice * 0.1)
  const totalPrice = basePrice + vat

  const canSubmit =
    form.trackTitle &&
    form.artistName &&
    form.genre &&
    form.tempo &&
    form.mood &&
    (form.mood !== "기타" || form.moodOther) &&
    form.storeId &&
    form.plan &&
    form.youtubeRelease &&
    (form.youtubeRelease !== "예" || form.youtubeUrl)

  const handleSubmit = async () => {
    if (!canSubmit || !selectedPlan || !selectedStore) return
    setSubmitting(true)
    try {
      const today = new Date()
      const startDate = today.toISOString().split("T")[0]
      const endDate = addWeeks(today, selectedPlan.weeks)

      const result = await applyStorePromo({
        trackTitle: form.trackTitle,
        storeName: selectedStore.name,
        plan: form.plan,
        startDate,
        endDate,
      })

      // 완료 페이지에 전달할 데이터 저장
      sessionStorage.setItem("storePromoComplete", JSON.stringify({
        trackTitle: form.trackTitle,
        artistName: form.artistName,
        genre: form.genre,
        tempo: form.tempo,
        storeName: selectedStore.name,
        storeLocation: selectedStore.location,
        storeHours: selectedStore.hours,
        planLabel: selectedPlan.label,
        startDate,
        endDate,
        totalPrice,
      }))

      router.push("/store-promo/complete")
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
        href="/store-promo"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        매장 홍보로 돌아가기
      </Link>

      <h1 className="mb-2 text-2xl font-bold">매장 음원 홍보 신청</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        아래 정보를 입력하고 원하는 매장에서 음악을 홍보하세요
      </p>

      <div className="flex flex-col gap-6">
        {/* Track Title */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            곡 제목 <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            value={form.trackTitle}
            onChange={(e) => update("trackTitle", e.target.value)}
            className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="곡 제목을 입력하세요"
          />
        </div>

        {/* Artist Name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            가수명 <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            value={form.artistName}
            onChange={(e) => update("artistName", e.target.value)}
            className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="가수명을 입력하세요"
          />
        </div>

        {/* Genre & Tempo */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              장르 <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={form.genre}
              onChange={(e) => update("genre", e.target.value)}
              className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="예: 인디 팝"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              템포 <span className="text-destructive">*</span>
            </label>
            <select
              value={form.tempo}
              onChange={(e) => update("tempo", e.target.value)}
              className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">템포 선택</option>
              {tempoOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">곡 소개</label>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className="w-full resize-none rounded-lg border border-input bg-card px-4 py-2.5 text-sm leading-relaxed placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="곡에 대한 소개를 자유롭게 작성해주세요."
            rows={4}
          />
        </div>

        {/* Mood */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            무드 선택 <span className="text-destructive">*</span>
          </label>
          <div className="flex flex-col gap-2">
            {moodOptions.map((mood) => (
              <label
                key={mood}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-colors ${
                  form.mood === mood
                    ? "border-primary bg-primary/5"
                    : "border-input hover:border-primary/30"
                }`}
              >
                <input
                  type="radio"
                  name="mood"
                  value={mood}
                  checked={form.mood === mood}
                  onChange={(e) => {
                    update("mood", e.target.value)
                    update("storeId", "")
                    update("moodOther", "")
                  }}
                  className="accent-primary"
                />
                {mood}
              </label>
            ))}
          </div>
          {form.mood === "기타" && (
            <input
              type="text"
              value={form.moodOther}
              onChange={(e) => update("moodOther", e.target.value)}
              className="mt-2 w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="무드를 직접 입력해주세요"
            />
          )}
        </div>

        {/* Available Stores */}
        {form.mood && (
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              재생 가능한 매장 선택 <span className="text-destructive">*</span>
            </label>
            {availableStores.length === 0 ? (
              <p className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                선택한 무드에 해당하는 매장이 없습니다.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {availableStores.map((store) => (
                  <label
                    key={store.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-colors ${
                      form.storeId === String(store.id)
                        ? "border-primary bg-primary/5"
                        : "border-input hover:border-primary/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="store"
                      value={String(store.id)}
                      checked={form.storeId === String(store.id)}
                      onChange={(e) => update("storeId", e.target.value)}
                      className="accent-primary"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{store.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {store.location} | {store.hours}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Plan Selection */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            희망 플랜 선택 <span className="text-destructive">*</span>
          </label>
          <div className="flex flex-col gap-2">
            {planOptions.map((plan) => (
              <label
                key={plan.value}
                className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 text-sm transition-colors ${
                  form.plan === plan.value
                    ? "border-primary bg-primary/5"
                    : "border-input hover:border-primary/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="plan"
                    value={plan.value}
                    checked={form.plan === plan.value}
                    onChange={(e) => update("plan", e.target.value)}
                    className="accent-primary"
                  />
                  <span>{plan.label}</span>
                </div>
                <span className="font-semibold text-primary">
                  {plan.price.toLocaleString()}원
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* YouTube Release */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            유튜브 발매 여부 <span className="text-destructive">*</span>
          </label>
          <div className="flex gap-3">
            {["예", "아니오"].map((opt) => (
              <label
                key={opt}
                className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg border p-3 text-sm font-medium transition-colors ${
                  form.youtubeRelease === opt
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-input hover:border-primary/30"
                }`}
              >
                <input
                  type="radio"
                  name="youtube"
                  value={opt}
                  checked={form.youtubeRelease === opt}
                  onChange={(e) => {
                    update("youtubeRelease", e.target.value)
                    if (e.target.value === "아니오") update("youtubeUrl", "")
                  }}
                  className="sr-only"
                />
                {opt}
              </label>
            ))}
          </div>
          {form.youtubeRelease === "예" && (
            <input
              type="url"
              value={form.youtubeUrl}
              onChange={(e) => update("youtubeUrl", e.target.value)}
              className="mt-2 w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="유튜브 링크를 입력해주세요 (예: https://youtu.be/...)"
            />
          )}
        </div>

        {/* Referral (optional) */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            신청 경로 <span className="text-xs text-muted-foreground">(선택)</span>
          </label>
          <select
            value={form.referral}
            onChange={(e) => update("referral", e.target.value)}
            className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">선택해주세요</option>
            {referralOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {form.referral === "기타" && (
            <input
              type="text"
              value={form.referralOther}
              onChange={(e) => update("referralOther", e.target.value)}
              className="mt-2 w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="직접 입력해주세요"
            />
          )}
        </div>

        {/* Payment Summary */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <p className="font-semibold text-sm">결제 내용</p>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>선택 플랜</span>
              <span>{selectedPlan ? selectedPlan.label : "-"}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>플랜 금액</span>
              <span>{basePrice > 0 ? basePrice.toLocaleString() + "원" : "-"}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>부가세 (10%)</span>
              <span>{basePrice > 0 ? vat.toLocaleString() + "원" : "-"}</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between font-bold text-base">
              <span>최종 결제 금액</span>
              <span className="text-primary">
                {basePrice > 0 ? totalPrice.toLocaleString() + "원" : "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <Button
          size="lg"
          className="w-full"
          disabled={!canSubmit || submitting}
          onClick={handleSubmit}
        >
          {submitting
            ? "신청 중..."
            : basePrice > 0
            ? `총 ${totalPrice.toLocaleString()}원 결제하기`
            : "결제 및 신청하기"}
        </Button>
      </div>
    </div>
  )
}
