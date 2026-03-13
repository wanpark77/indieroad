export default function MarketingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-6 lg:py-16">
      <h1 className="mb-2 text-3xl font-bold">마케팅 정보 수신 동의</h1>
      <p className="mb-10 text-sm text-muted-foreground">시행일: 2026년 3월 13일</p>

      <div className="flex flex-col gap-10 text-sm leading-relaxed text-foreground/80">

        <section>
          <h2 className="mb-3 text-base font-bold text-foreground">제1조 (목적)</h2>
          <p>
            버비컴퍼니(이하 "회사")는 이용자에게 유익한 서비스 정보와 혜택을 제공하기 위해
            이메일 및 문자메시지(SMS/MMS)를 통한 마케팅 정보 발송에 대한 동의를 받고 있습니다.
            본 동의는 선택사항이며, 동의하지 않아도 인디로드 서비스 이용에 제한이 없습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-bold text-foreground">제2조 (수집 항목 및 이용 목적)</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border border-border px-3 py-2 text-left font-medium">수집 항목</th>
                  <th className="border border-border px-3 py-2 text-left font-medium">이용 목적</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border px-3 py-2">이메일 주소</td>
                  <td className="border border-border px-3 py-2">이메일을 통한 마케팅 정보 발송</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2">전화번호</td>
                  <td className="border border-border px-3 py-2">문자메시지(SMS/MMS)를 통한 마케팅 정보 발송</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-base font-bold text-foreground">제3조 (발송 내용)</h2>
          <p className="mb-2">동의 시 아래와 같은 정보를 이메일 및 문자메시지로 발송합니다.</p>
          <ul className="flex flex-col gap-2 list-disc pl-5">
            <li>인디로드 신규 서비스 및 기능 안내</li>
            <li>음악 피드백 및 매장 홍보 이벤트·프로모션 정보</li>
            <li>매거진 콘텐츠 업데이트 알림</li>
            <li>포인트 혜택 및 특별 할인 안내</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-base font-bold text-foreground">제4조 (보유 및 이용 기간)</h2>
          <p>
            마케팅 수신 동의 시점부터 동의 철회 시까지 보유 및 이용합니다.
            동의를 철회하면 즉시 마케팅 정보 발송이 중단됩니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-bold text-foreground">제5조 (동의 철회 방법)</h2>
          <ul className="flex flex-col gap-2 list-disc pl-5">
            <li>이메일 하단 수신거부 링크 클릭</li>
            <li>verbykorea@gmail.com 으로 수신 거부 요청</li>
          </ul>
          <p className="mt-3 text-muted-foreground">
            수신 거부 요청 후 영업일 기준 3일 이내에 처리되며, 처리 결과를 안내해드립니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-bold text-foreground">제6조 (동의 거부 권리)</h2>
          <p>
            이용자는 마케팅 정보 수신 동의를 거부할 권리가 있으며,
            동의하지 않아도 인디로드의 모든 서비스를 정상적으로 이용하실 수 있습니다.
          </p>
        </section>

        <section className="rounded-xl bg-muted/50 p-4 text-xs text-muted-foreground">
          <p>문의: verbykorea@gmail.com</p>
          <p className="mt-1">© 2026 IndieRoad. All rights reserved.</p>
        </section>

      </div>
    </div>
  )
}
