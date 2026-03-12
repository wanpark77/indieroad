"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Store, Plus, MapPin, Clock, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getMyStorePromos, type PromoApplication } from "@/lib/api/store-promo"

const planLabels: Record<string, string> = {
  A: "플랜 A: 1개월 (4주)",
  B: "플랜 B: 3개월 (12주)",
  C: "플랜 C: 1년 (48주)",
}

const statusLabels: Record<string, string> = {
  ACTIVE: "재생 중",
  ENDED: "종료",
  PENDING: "검토 중",
}

const statusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  ENDED: "bg-muted text-muted-foreground",
  PENDING: "bg-amber-100 text-amber-700",
}

export default function MyStorePromoPage() {
  const router = useRouter()
  const [applications, setApplications] = useState<PromoApplication[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) {
      router.push("/login")
      return
    }
    getMyStorePromos()
      .then(setApplications)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [router])

  if (loading) return <p className="text-muted-foreground">로딩 중...</p>

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">매장 홍보 신청</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            매장에서 재생 중인 음원 홍보 현황을 확인하세요.
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href="/store-promo/apply">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            새 홍보 신청
          </Link>
        </Button>
      </div>

      {applications.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Store className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            아직 매장 홍보 신청 내역이 없습니다.
          </p>
          <Link
            href="/store-promo/apply"
            className="text-sm font-medium text-primary hover:underline"
          >
            매장 홍보 신청하기
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {applications.map((app) => (
            <div key={app.id} className="rounded-xl bg-card p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                    <Store className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-lg font-bold">{app.trackTitle}</span>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {app.storeName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Music className="h-3.5 w-3.5" />
                        {planLabels[app.plan] ?? app.plan}
                      </span>
                    </div>
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    statusColors[app.status] ?? "bg-muted text-muted-foreground"
                  }`}
                >
                  {statusLabels[app.status] ?? app.status}
                </span>
              </div>

              {(app.startDate || app.endDate) && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-3 text-sm">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">기간:</span>
                  <span className="font-medium">
                    {app.startDate ?? "-"} ~ {app.endDate ?? "-"}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
