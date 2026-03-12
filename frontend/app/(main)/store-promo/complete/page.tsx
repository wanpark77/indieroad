"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle2, Music, Store, Calendar, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CompleteData {
  trackTitle: string
  artistName: string
  genre: string
  tempo: string
  storeName: string
  storeLocation: string
  storeHours: string
  planLabel: string
  startDate: string
  endDate: string
  totalPrice: number
}

export default function StorePromoCompletePage() {
  const [data, setData] = useState<CompleteData | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem("storePromoComplete")
    if (raw) {
      setData(JSON.parse(raw))
      sessionStorage.removeItem("storePromoComplete")
    }
  }, [])

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-16 text-center lg:px-6 lg:py-24">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <CheckCircle2 className="h-8 w-8 text-primary" />
      </div>

      <h1 className="mt-6 text-2xl font-bold">신청이 완료되었습니다</h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
        매장 음원 홍보 신청이 정상적으로 접수되었습니다. 담당자 확인 후 재생이
        시작됩니다.
      </p>

      {data && (
        <div className="mt-8 w-full rounded-xl bg-card p-6 shadow-sm text-left space-y-3">
          <h2 className="mb-4 text-sm font-semibold">신청 내역</h2>

          {/* 곡 정보 */}
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
            <Music className="h-5 w-5 shrink-0 text-primary" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">재생 곡</span>
              <span className="text-sm font-medium">
                {data.trackTitle}
                {data.artistName && ` — ${data.artistName}`}
              </span>
              <span className="text-xs text-muted-foreground">
                {[data.genre, data.tempo].filter(Boolean).join(" | ")}
              </span>
            </div>
          </div>

          {/* 매장 정보 */}
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
            <Store className="h-5 w-5 shrink-0 text-primary" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">재생 매장</span>
              <span className="text-sm font-medium">{data.storeName}</span>
              <span className="text-xs text-muted-foreground">
                {data.storeLocation}
                {data.storeHours && ` | ${data.storeHours}`}
              </span>
            </div>
          </div>

          {/* 플랜 / 기간 */}
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
            <Calendar className="h-5 w-5 shrink-0 text-primary" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">플랜 및 기간</span>
              <span className="text-sm font-medium">{data.planLabel}</span>
              <span className="text-xs text-muted-foreground">
                {data.startDate} ~ {data.endDate}
              </span>
            </div>
          </div>

          {/* 결제 금액 */}
          <div className="flex items-center justify-between rounded-lg bg-primary/5 border border-primary/20 px-4 py-3">
            <span className="text-sm font-medium">결제 금액</span>
            <span className="text-base font-bold text-primary">
              {data.totalPrice.toLocaleString()}원
            </span>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/me/store-promo">
            홍보 현황 보기
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">홈으로 돌아가기</Link>
        </Button>
      </div>
    </div>
  )
}
