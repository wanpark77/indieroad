import Link from "next/link"
import { ArrowRight, MapPin, Clock, Music, Star, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { promoStores, storePromoReviews } from "@/lib/mock-data"

export default function StorePromoPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:px-6 lg:py-24">
          <div className="flex flex-col items-center text-center">
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
              매장 음원 홍보 서비스
            </span>
            <h1 className="max-w-2xl text-balance text-3xl font-bold leading-tight tracking-tight lg:text-4xl">
              실제 매장에서
              <br />
              <span className="text-primary">
                여러분의 음악이 흘러나옵니다
              </span>
            </h1>
            <p className="mt-4 max-w-lg text-pretty text-muted-foreground">
              카페, 서점, 레코드샵 등 감성적인 오프라인 공간에서 여러분의 음악을
              직접 들려드립니다. 온라인을 넘어 새로운 리스너를 만나보세요.
            </p>
            <Button size="lg" className="mt-8" asChild>
              <Link href="/store-promo/apply">
                매장 음원 홍보 신청하기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/50">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:px-6 lg:py-20">
          <h2 className="mb-10 text-center text-2xl font-bold tracking-tight">
            어떻게 진행되나요?
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "곡 정보 입력",
                desc: "홍보할 곡의 정보와 무드를 입력하고, 재생 가능한 매장을 선택해요.",
              },
              {
                step: "02",
                title: "플랜 선택 & 결제",
                desc: "1개월, 3개월, 1년 중 원하는 기간의 플랜을 선택하고 결제합니다.",
              },
              {
                step: "03",
                title: "매장에서 재생 시작",
                desc: "선택한 매장에서 여러분의 음악이 실제로 재생됩니다.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-xl bg-card p-6 shadow-sm"
              >
                <span className="text-2xl font-bold text-primary">
                  {item.step}
                </span>
                <h3 className="mt-3 text-base font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Stores */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 lg:px-6 lg:py-20">
        <h2 className="mb-2 text-2xl font-bold tracking-tight">제휴 매장</h2>
        <p className="mb-8 text-sm text-muted-foreground">
          현재 인디로드와 함께하는 매장들이에요
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          {promoStores.map((store) => (
            <div
              key={store.id}
              className="flex gap-4 rounded-xl bg-card p-5 shadow-sm"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Store className="h-6 w-6 text-primary" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold">{store.name}</span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {store.location}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {store.hours}
                </span>
                <span className="flex items-center gap-1 text-xs text-primary">
                  <Music className="h-3 w-3" />
                  {store.currentTrack} - {store.currentArtist}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-muted/50">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:px-6 lg:py-20">
          <h2 className="mb-2 text-2xl font-bold tracking-tight">
            이용 후기
          </h2>
          <p className="mb-8 text-sm text-muted-foreground">
            매장 음원 홍보 서비스를 이용한 분들의 후기입니다
          </p>
          <div className="grid gap-5 sm:grid-cols-3">
            {storePromoReviews.map((review) => (
              <div
                key={review.id}
                className="rounded-xl bg-card p-5 shadow-sm"
              >
                <div className="mb-3 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i < review.rating ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                    />
                  ))}
                </div>
                <p className="mb-3 text-sm leading-relaxed text-foreground/80">
                  {review.content}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {review.author[0]}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium">{review.author}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {review.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 lg:px-6 lg:py-20">
        <h2 className="mb-2 text-center text-2xl font-bold tracking-tight">
          요금 안내
        </h2>
        <p className="mb-10 text-center text-sm text-muted-foreground">
          합리적인 가격으로 음악을 홍보해보세요
        </p>
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            {
              plan: "플랜 A",
              period: "1개월 (4주)",
              price: "15,000",
              perWeek: "3,750",
            },
            {
              plan: "플랜 B",
              period: "3개월 (12주)",
              price: "45,000",
              perWeek: "3,750",
              popular: true,
            },
            {
              plan: "플랜 C",
              period: "1년 (48주)",
              price: "180,000",
              perWeek: "3,750",
            },
          ].map((item) => (
            <div
              key={item.plan}
              className={`relative rounded-xl p-6 shadow-sm ${item.popular ? "border-2 border-primary bg-card" : "bg-card"}`}
            >
              {item.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
                  인기
                </span>
              )}
              <h3 className="text-lg font-bold">{item.plan}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {item.period}
              </p>
              <p className="mt-4 text-2xl font-bold text-primary">
                {item.price}
                <span className="text-sm font-normal text-muted-foreground">
                  원
                </span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                주당 {item.perWeek}원
              </p>
              <Button
                className="mt-6 w-full"
                variant={item.popular ? "default" : "outline"}
                asChild
              >
                <Link href="/store-promo/apply">선택하기</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-primary/5">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center lg:px-6">
          <h2 className="text-2xl font-bold tracking-tight">
            지금 바로 시작해보세요
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            여러분의 음악이 매장에서 흘러나오는 경험을 만들어드립니다
          </p>
          <Button size="lg" className="mt-6" asChild>
            <Link href="/store-promo/apply">
              매장 음원 홍보 신청하기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
