export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-6 lg:py-16">
      <h1 className="mb-2 text-3xl font-bold">이용약관</h1>
      <p className="mb-10 text-sm text-muted-foreground">시행일: 2026년 3월 13일</p>

      <div className="flex flex-col gap-10 text-sm leading-relaxed text-foreground/80">

        <section>
          <h2 className="mb-3 text-base font-bold text-foreground">제1조 (목적)</h2>
          <p>
            이 약관은 버비컴퍼니(이하 "회사")가 운영하는 인디로드 서비스(이하 "서비스")의 이용과 관련하여
            회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-bold text-foreground">제2조 (정의)</h2>
          <ul className="flex flex-col gap-2 list-disc pl-5">
            <li>"서비스"란 회사가 제공하는 음악 피드백, 매장 음원 홍보, 매거진 등 일체의 서비스를 의미합니다.</li>
            <li>"이용자"란 이 약관에 동의하고 서비스를 이용하는 회원 및 비회원을 의미합니다.</li>
            <li>"회원"이란 회사에 개인정보를 제공하고 회원등록을 한 자를 의미합니다.</li>
            <li>"포인트"란 서비스 내에서 피드백 활동에 대한 보상으로 지급되는 가상의 적립금을 의미합니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-base font-bold text-foreground">제3조 (약관의 효력 및 변경)</h2>
          <ul className="flex flex-col gap-2 list-disc pl-5">
            <li>이 약관은 서비스 화면에 게시하거나 기타 방법으로 공지함으로써 효력이 발생합니다.</li>
            <li>회사는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 공지 후 7일 이내에 효력이 발생합니다.</li>
            <li>이용자가 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-base font-bold text-foreground">제4조 (회원가입)</h2>
          <ul className="flex flex-col gap-2 list-disc pl-5">
            <li>이용자는 회사가 정한 양식에 따라 정보를 기입하고 약관에 동의함으로써 회원가입을 신청합니다.</li>
            <li>회원가입 시 이메일, 비밀번호, 이름(실명), 전화번호, 닉네임, 역할을 필수로 입력해야 합니다. 이름과 전화번호는 아이디 찾기 및 비밀번호 재설정에 활용됩니다.</li>
            <li>회사는 다음 각 호에 해당하는 경우 회원가입을 거절할 수 있습니다.
              <ul className="mt-1 flex flex-col gap-1 list-disc pl-5 text-muted-foreground">
                <li>타인의 명의를 도용한 경우</li>
                <li>허위 정보를 기재한 경우</li>
                <li>만 14세 미만인 경우</li>
              </ul>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-base font-bold text-foreground">제5조 (서비스 이용)</h2>
          <ul className="flex flex-col gap-2 list-disc pl-5">
            <li>서비스는 연중무휴 24시간 제공을 원칙으로 하나, 시스템 점검 등의 이유로 일시 중단될 수 있습니다.</li>
            <li>음악 피드백 서비스는 본인이 직접 창작한 음원에 한하여 신청 가능합니다.</li>
            <li>매장 음원 홍보 서비스는 결제 후 이용 가능하며, 담당자 확인 후 재생이 시작됩니다.</li>
            <li>포인트는 현금으로 환전되지 않으며, 서비스 내에서만 사용 가능합니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-base font-bold text-foreground">제6조 (이용자의 의무)</h2>
          <ul className="flex flex-col gap-2 list-disc pl-5">
            <li>이용자는 타인의 저작권을 침해하는 음원을 업로드하거나 신청해서는 안 됩니다.</li>
            <li>이용자는 타인을 사칭하거나 허위 정보를 제공해서는 안 됩니다.</li>
            <li>이용자는 서비스의 정상적인 운영을 방해하는 행위를 해서는 안 됩니다.</li>
            <li>이용자는 비방, 욕설 등 타인에게 불쾌감을 주는 피드백을 작성해서는 안 됩니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-base font-bold text-foreground">제7조 (포인트 정책)</h2>
          <ul className="flex flex-col gap-2 list-disc pl-5">
            <li>포인트는 피드백 활동이 승인된 경우에 한하여 지급됩니다.</li>
            <li>부정한 방법으로 획득한 포인트는 회수될 수 있습니다.</li>
            <li>포인트의 유효기간 및 사용 조건은 회사의 정책에 따릅니다.</li>
            <li>회원 탈퇴 시 잔여 포인트는 자동 소멸됩니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-base font-bold text-foreground">제8조 (결제 및 환불)</h2>
          <ul className="flex flex-col gap-2 list-disc pl-5">
            <li>매장 음원 홍보 서비스는 선결제 방식으로 운영됩니다.</li>
            <li>서비스 시작 전 취소 시 전액 환불됩니다.</li>
            <li>서비스 시작 후 취소 시 잔여 기간에 해당하는 금액을 환불합니다.</li>
            <li>환불 처리는 영업일 기준 3~5일 소요됩니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-base font-bold text-foreground">제9조 (책임의 한계)</h2>
          <ul className="flex flex-col gap-2 list-disc pl-5">
            <li>회사는 천재지변, 시스템 장애 등 불가항력적 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다.</li>
            <li>회사는 이용자가 게재한 콘텐츠의 정확성, 신뢰성에 대해 책임을 지지 않습니다.</li>
            <li>회사는 이용자 간의 분쟁에 대해 개입하지 않으며 이로 인한 손해를 배상하지 않습니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-base font-bold text-foreground">제10조 (분쟁 해결)</h2>
          <p>
            이 약관과 관련하여 발생한 분쟁은 대한민국 법률에 따라 해결하며,
            분쟁 발생 시 관할 법원은 회사 소재지의 법원으로 합니다.
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
