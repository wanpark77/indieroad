export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-6 lg:py-16">
      <h1 className="mb-2 text-3xl font-bold">개인정보처리방침</h1>
      <p className="mb-10 text-sm text-muted-foreground">시행일: 2026년 3월 13일</p>

      <div className="flex flex-col gap-10 text-sm leading-relaxed text-foreground/80">

        <section>
          <h2 className="mb-3 text-base font-bold text-foreground">제1조 (개인정보의 처리 목적)</h2>
          <p className="mb-2">버비컴퍼니(이하 "회사")는 다음의 목적을 위하여 개인정보를 처리합니다.</p>
          <ul className="flex flex-col gap-2 list-disc pl-5">
            <li>회원가입 및 회원 관리 (본인 확인, 서비스 이용)</li>
            <li>이름 및 전화번호를 통한 아이디(이메일) 찾기 및 비밀번호 재설정</li>
            <li>음악 피드백 서비스 제공 (트랙 등록, 피드백 매칭, 포인트 지급)</li>
            <li>매장 음원 홍보 서비스 제공 (신청 접수, 결제, 재생 관리)</li>
            <li>서비스 개선 및 통계 분석</li>
            <li>고객 문의 응대 및 불만 처리</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-base font-bold text-foreground">제2조 (수집하는 개인정보 항목)</h2>
          <div className="flex flex-col gap-4">
            <div>
              <p className="mb-2 font-medium text-foreground">필수 수집 항목</p>
              <ul className="flex flex-col gap-1 list-disc pl-5">
                <li>이메일 주소</li>
                <li>비밀번호 (암호화 저장)</li>
                <li>이름 (실명)</li>
                <li>전화번호</li>
                <li>닉네임</li>
                <li>역할 (리스너 / 아티스트 / 음악 종사자)</li>
              </ul>
            </div>
            <div>
              <p className="mb-2 font-medium text-foreground">선택 수집 항목</p>
              <ul className="flex flex-col gap-1 list-disc pl-5">
                <li>아티스트명</li>
                <li>활동 장르</li>
                <li>자기소개</li>
              </ul>
            </div>
            <div>
              <p className="mb-2 font-medium text-foreground">서비스 이용 과정에서 자동 수집</p>
              <ul className="flex flex-col gap-1 list-disc pl-5">
                <li>서비스 이용 기록 (피드백 신청, 매장 홍보 신청 내역)</li>
                <li>포인트 적립/사용 내역</li>
                <li>접속 로그, IP 주소</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-base font-bold text-foreground">제3조 (개인정보의 처리 및 보유 기간)</h2>
          <ul className="flex flex-col gap-2 list-disc pl-5">
            <li>회원 정보: 회원 탈퇴 시까지</li>
            <li>결제 및 거래 기록: 전자상거래법에 따라 5년 보관</li>
            <li>서비스 이용 기록: 통신비밀보호법에 따라 3개월 보관</li>
            <li>탈퇴 후 개인정보는 즉시 파기하되, 법령에 의한 보존 의무가 있는 경우 해당 기간 동안 보관합니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-base font-bold text-foreground">제4조 (개인정보의 제3자 제공)</h2>
          <p className="mb-2">회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 다만, 다음의 경우는 예외입니다.</p>
          <ul className="flex flex-col gap-2 list-disc pl-5">
            <li>이용자가 사전에 동의한 경우</li>
            <li>법령의 규정에 의거하거나 수사 목적으로 법령에 정해진 절차에 따라 요청된 경우</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-base font-bold text-foreground">제5조 (개인정보 처리의 위탁)</h2>
          <p>
            회사는 현재 개인정보 처리 업무를 외부에 위탁하고 있지 않습니다.
            향후 위탁이 필요한 경우 사전에 공지 및 동의 절차를 진행하겠습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-bold text-foreground">제6조 (이용자의 권리)</h2>
          <p className="mb-2">이용자는 언제든지 다음의 권리를 행사할 수 있습니다.</p>
          <ul className="flex flex-col gap-2 list-disc pl-5">
            <li>개인정보 조회 및 수정: 마이페이지 → 프로필에서 직접 수정 가능</li>
            <li>개인정보 삭제: 회원 탈퇴를 통해 처리</li>
            <li>개인정보 처리 정지 요청: verbykorea@gmail.com 으로 문의</li>
            <li>개인정보 이전 요청: verbykorea@gmail.com 으로 문의</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-base font-bold text-foreground">제7조 (개인정보의 파기)</h2>
          <ul className="flex flex-col gap-2 list-disc pl-5">
            <li>전자적 파일 형태의 정보는 복구 불가능한 방법으로 영구 삭제합니다.</li>
            <li>종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각합니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-base font-bold text-foreground">제8조 (쿠키 사용)</h2>
          <ul className="flex flex-col gap-2 list-disc pl-5">
            <li>회사는 로그인 상태 유지를 위해 JWT 토큰을 로컬스토리지에 저장합니다.</li>
            <li>이용자는 브라우저 설정을 통해 언제든지 저장된 정보를 삭제할 수 있습니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-base font-bold text-foreground">제9조 (개인정보 보호책임자)</h2>
          <div className="rounded-xl bg-muted/50 p-4">
            <ul className="flex flex-col gap-1">
              <li><span className="font-medium">성명:</span> 버비컴퍼니 개인정보 보호책임자</li>
              <li><span className="font-medium">이메일:</span> verbykorea@gmail.com</li>
            </ul>
          </div>
          <p className="mt-3 text-muted-foreground">
            개인정보 처리에 관한 불만 및 피해구제는 개인정보분쟁조정위원회(www.kopico.go.kr) 또는
            개인정보침해신고센터(privacy.kisa.or.kr)에 신청하실 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-bold text-foreground">제10조 (개인정보처리방침 변경)</h2>
          <p>
            이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경이 있을 경우
            변경사항을 서비스 공지사항을 통해 사전 고지합니다.
          </p>
        </section>

        <section className="rounded-xl bg-muted/50 p-4 text-xs text-muted-foreground">
          <p>시행일: 2026년 3월 13일</p>
          <p className="mt-1">© 2026 IndieRoad. All rights reserved.</p>
        </section>

      </div>
    </div>
  )
}
