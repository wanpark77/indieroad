import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <span className="text-lg font-bold text-primary">인디로드</span>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              음악이 자연스럽게 흐르는 곳.
              <br />
              인디 음악을 위한 따뜻한 커뮤니티 플랫폼.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                서비스
              </span>
              <Link
                href="/magazine"
                className="text-sm text-foreground/80 hover:text-primary"
              >
                매거진
              </Link>
              <Link
                href="/feedback"
                className="text-sm text-foreground/80 hover:text-primary"
              >
                음악 피드백
              </Link>
              <Link
                href="/store-promo"
                className="text-sm text-foreground/80 hover:text-primary"
              >
                매장 홍보
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                정책
              </span>
              <Link
                href="/terms"
                className="text-sm text-foreground/80 hover:text-primary"
              >
                이용약관
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-foreground/80 hover:text-primary"
              >
                개인정보처리방침
              </Link>
              <Link
                href="/marketing"
                className="text-sm text-foreground/80 hover:text-primary"
              >
                마케팅 수신 동의
              </Link>
              <Link
                href="/contact"
                className="text-sm text-foreground/80 hover:text-primary"
              >
                문의하기
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="text-center text-xs text-muted-foreground">
            &copy; 2026 IndieRoad. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
