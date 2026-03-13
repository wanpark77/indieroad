"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { signup } from "@/lib/api/auth"

const roles = [
  { value: "LISTENER", label: "리스너", desc: "음악을 듣고 피드백하고 싶어요" },
  { value: "ARTIST", label: "아티스트", desc: "내 음악을 홍보하고 싶어요" },
  { value: "PROFESSIONAL", label: "음악 종사자", desc: "음악 업계에서 일하고 있어요" },
]

const TERMS_CONTENT = `제1조 (목적)
이 약관은 버비컴퍼니(이하 "회사")가 운영하는 인디로드 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (정의)
• "서비스"란 회사가 제공하는 음악 피드백, 매장 음원 홍보, 매거진 등 일체의 서비스를 의미합니다.
• "이용자"란 이 약관에 동의하고 서비스를 이용하는 회원 및 비회원을 의미합니다.
• "회원"이란 회사에 개인정보를 제공하고 회원등록을 한 자를 의미합니다.
• "포인트"란 서비스 내에서 피드백 활동에 대한 보상으로 지급되는 가상의 적립금을 의미합니다.

제3조 (약관의 효력 및 변경)
• 이 약관은 서비스 화면에 게시하거나 기타 방법으로 공지함으로써 효력이 발생합니다.
• 회사는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 공지 후 7일 이내에 효력이 발생합니다.
• 이용자가 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.

제4조 (회원가입)
• 이용자는 회사가 정한 양식에 따라 정보를 기입하고 약관에 동의함으로써 회원가입을 신청합니다.
• 회원가입 시 이메일, 비밀번호, 이름(실명), 전화번호, 닉네임, 역할을 필수로 입력해야 합니다. 이름과 전화번호는 아이디 찾기 및 비밀번호 재설정에 활용됩니다.
• 타인의 명의를 도용하거나, 허위 정보를 기재하거나, 만 14세 미만인 경우 가입이 거절될 수 있습니다.

제5조 (서비스 이용)
• 서비스는 연중무휴 24시간 제공을 원칙으로 하나, 시스템 점검 등의 이유로 일시 중단될 수 있습니다.
• 음악 피드백 서비스는 본인이 직접 창작한 음원에 한하여 신청 가능합니다.
• 포인트는 현금으로 환전되지 않으며, 서비스 내에서만 사용 가능합니다.

제6조 (이용자의 의무)
• 이용자는 타인의 저작권을 침해하는 음원을 업로드하거나 신청해서는 안 됩니다.
• 이용자는 타인을 사칭하거나 허위 정보를 제공해서는 안 됩니다.
• 이용자는 비방, 욕설 등 타인에게 불쾌감을 주는 피드백을 작성해서는 안 됩니다.

제7조 (포인트 정책)
• 포인트는 피드백 활동이 승인된 경우에 한하여 지급됩니다.
• 부정한 방법으로 획득한 포인트는 회수될 수 있습니다.
• 회원 탈퇴 시 잔여 포인트는 자동 소멸됩니다.

제8조 (결제 및 환불)
• 매장 음원 홍보 서비스는 선결제 방식으로 운영됩니다.
• 서비스 시작 전 취소 시 전액 환불됩니다.
• 서비스 시작 후 취소 시 잔여 기간에 해당하는 금액을 환불합니다.

제9조 (분쟁 해결)
이 약관과 관련하여 발생한 분쟁은 대한민국 법률에 따라 해결하며, 분쟁 발생 시 관할 법원은 회사 소재지의 법원으로 합니다.

문의: verbykorea@gmail.com`

const PRIVACY_CONTENT = `제1조 (개인정보의 처리 목적)
버비컴퍼니(이하 "회사")는 다음의 목적을 위하여 개인정보를 처리합니다.
• 회원가입 및 회원 관리 (본인 확인, 서비스 이용)
• 이름 및 전화번호를 통한 아이디(이메일) 찾기 및 비밀번호 재설정
• 음악 피드백 서비스 제공 (트랙 등록, 피드백 매칭, 포인트 지급)
• 매장 음원 홍보 서비스 제공 (신청 접수, 결제, 재생 관리)
• 서비스 개선 및 통계 분석
• 고객 문의 응대 및 불만 처리

제2조 (수집하는 개인정보 항목)
[필수] 이메일 주소, 비밀번호(암호화 저장), 이름(실명), 전화번호, 닉네임, 역할
[선택] 아티스트명, 활동 장르, 자기소개
[자동] 서비스 이용 기록, 포인트 내역, 접속 로그, IP 주소

제3조 (개인정보의 처리 및 보유 기간)
• 회원 정보: 회원 탈퇴 시까지
• 결제 및 거래 기록: 전자상거래법에 따라 5년 보관
• 서비스 이용 기록: 통신비밀보호법에 따라 3개월 보관

제4조 (개인정보의 제3자 제공)
회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다.
다만, 이용자 동의 또는 법령에 의한 경우는 예외입니다.

제5조 (개인정보 처리의 위탁)
회사는 현재 개인정보 처리 업무를 외부에 위탁하고 있지 않습니다.
향후 위탁이 필요한 경우 사전에 공지 및 동의 절차를 진행합니다.

제6조 (이용자의 권리)
• 개인정보 조회 및 수정: 마이페이지 → 프로필
• 개인정보 삭제: 회원 탈퇴
• 처리 정지 및 이전 요청: verbykorea@gmail.com

제7조 (개인정보의 파기)
전자적 파일은 복구 불가능한 방법으로 영구 삭제합니다.

제8조 (쿠키 사용)
로그인 상태 유지를 위해 JWT 토큰을 로컬스토리지에 저장하며, 브라우저 설정으로 언제든 삭제 가능합니다.

제9조 (개인정보 보호책임자)
버비컴퍼니 개인정보 보호책임자
이메일: verbykorea@gmail.com

개인정보 피해구제: 개인정보분쟁조정위원회(www.kopico.go.kr)`

const MARKETING_CONTENT = `버비컴퍼니는 이용자에게 유익한 서비스 정보와 혜택을 제공하기 위해 이메일 및 문자메시지(SMS/MMS)를 통한 마케팅 정보를 발송합니다. 본 동의는 선택사항이며, 동의하지 않아도 서비스 이용에 제한이 없습니다.

[수집 항목]
• 이메일 주소 — 이메일을 통한 마케팅 정보 발송
• 전화번호 — 문자메시지(SMS/MMS)를 통한 마케팅 정보 발송

[발송 내용]
• 인디로드 신규 서비스 및 기능 안내
• 음악 피드백 및 매장 홍보 이벤트·프로모션 정보
• 매거진 콘텐츠 업데이트 알림
• 포인트 혜택 및 특별 할인 안내

[보유 기간]
마케팅 수신 동의 시점부터 동의 철회 시까지 보유 및 이용합니다.

[동의 철회 방법]
verbykorea@gmail.com 으로 요청하실 수 있습니다.`

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "영문 대문자 포함", ok: /[A-Z]/.test(password) },
    { label: "영문 소문자 포함", ok: /[a-z]/.test(password) },
    { label: "숫자 포함", ok: /\d/.test(password) },
    { label: "특수문자 포함", ok: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
    { label: "8자 이상", ok: password.length >= 8 },
  ]
  const score = checks.filter((c) => c.ok).length
  const strengthLabel = score <= 2 ? "취약" : score <= 3 ? "보통" : score === 4 ? "강함" : "매우 강함"
  const strengthColor = score <= 2 ? "bg-destructive" : score <= 3 ? "bg-yellow-500" : score === 4 ? "bg-blue-500" : "bg-green-500"

  return (
    <div className="mt-2 flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={cn("h-1 flex-1 rounded-full transition-colors", i <= score ? strengthColor : "bg-muted")}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">{strengthLabel}</span>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-0.5">
        {checks.map((c) => (
          <span key={c.label} className={cn("text-xs", c.ok ? "text-green-600" : "text-muted-foreground")}>
            {c.ok ? "✓" : "○"} {c.label}
          </span>
        ))}
      </div>
    </div>
  )
}

function AgreementItem({
  label,
  required,
  checked,
  onChange,
  content,
}: {
  label: string
  required: boolean
  checked: boolean
  onChange: (v: boolean) => void
  content: string
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-lg border border-input overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2.5">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="accent-primary"
          />
          <span>
            {label}{" "}
            {required ? (
              <span className="text-xs text-destructive">(필수)</span>
            ) : (
              <span className="text-xs text-muted-foreground">(선택)</span>
            )}
          </span>
        </label>
        <button
          type="button"
          onClick={() => setExpanded((p) => !p)}
          className="text-muted-foreground hover:text-foreground p-1"
          aria-label="내용 펼치기"
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>
      {expanded && (
        <div className="border-t border-input bg-muted/30 px-4 py-3 text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap max-h-48 overflow-y-auto">
          {content}
        </div>
      )}
    </div>
  )
}

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
    name: "",
    phone: "",
    role: "",
    termsAgreed: false,
    privacyAgreed: false,
    marketingAgreed: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const update = (key: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const phoneValid = /^01[016789]\d{7,8}$/.test(form.phone)

  const passwordValid =
    form.password.length >= 8 &&
    /[A-Z]/.test(form.password) &&
    /[a-z]/.test(form.password) &&
    /\d/.test(form.password) &&
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password)

  const canSubmit =
    form.email &&
    form.password &&
    form.password === form.passwordConfirm &&
    passwordValid &&
    form.nickname &&
    form.name &&
    phoneValid &&
    form.role &&
    form.termsAgreed &&
    form.privacyAgreed

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    setError("")
    try {
      await signup({
        email: form.email,
        password: form.password,
        nickname: form.nickname,
        name: form.name,
        phone: form.phone,
        role: form.role,
      })
      router.push("/login")
    } catch (err: unknown) {
      console.error(err)
      setError(err instanceof Error ? err.message : "회원가입에 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">회원가입</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          인디로드에 오신 것을 환영합니다
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Email */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            이메일 <span className="text-destructive">*</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="email@example.com"
          />
        </div>

        {/* Password */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            비밀번호 <span className="text-destructive">*</span>
          </label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="영문 대/소문자, 숫자, 특수문자 포함 8자 이상"
          />
          {form.password && <PasswordStrength password={form.password} />}
        </div>

        {/* Password Confirm */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            비밀번호 확인 <span className="text-destructive">*</span>
          </label>
          <input
            type="password"
            value={form.passwordConfirm}
            onChange={(e) => update("passwordConfirm", e.target.value)}
            className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="비밀번호를 다시 입력하세요"
          />
          {form.passwordConfirm && form.password !== form.passwordConfirm && (
            <p className="mt-1 text-xs text-destructive">
              비밀번호가 일치하지 않습니다
            </p>
          )}
        </div>

        {/* Nickname */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            닉네임 <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            value={form.nickname}
            onChange={(e) => update("nickname", e.target.value)}
            className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="사용할 닉네임을 입력하세요"
          />
        </div>

        {/* Name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            이름 <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="실명을 입력하세요"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            전화번호 <span className="text-destructive">*</span>
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value.replace(/[^0-9]/g, ""))}
            className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="01012345678 (숫자만 입력)"
            maxLength={11}
          />
          {form.phone && !phoneValid && (
            <p className="mt-1 text-xs text-destructive">올바른 전화번호 형식이 아닙니다.</p>
          )}
        </div>

        {/* Role */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            역할 선택 <span className="text-destructive">*</span>
          </label>
          <div className="flex flex-col gap-2">
            {roles.map((role) => (
              <label
                key={role.value}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
                  form.role === role.value
                    ? "border-primary bg-primary/5"
                    : "border-input hover:border-primary/30",
                )}
              >
                <input
                  type="radio"
                  name="role"
                  value={role.value}
                  checked={form.role === role.value}
                  onChange={(e) => update("role", e.target.value)}
                  className="accent-primary"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{role.label}</span>
                  <span className="text-xs text-muted-foreground">{role.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Agreements */}
        <div className="flex flex-col gap-2">
          <AgreementItem
            label="서비스 이용약관 동의"
            required={true}
            checked={form.termsAgreed}
            onChange={(v) => update("termsAgreed", v)}
            content={TERMS_CONTENT}
          />
          <AgreementItem
            label="개인정보처리방침 동의"
            required={true}
            checked={form.privacyAgreed}
            onChange={(v) => update("privacyAgreed", v)}
            content={PRIVACY_CONTENT}
          />
          <AgreementItem
            label="마케팅 정보 수신 동의"
            required={false}
            checked={form.marketingAgreed}
            onChange={(v) => update("marketingAgreed", v)}
            content={MARKETING_CONTENT}
          />
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <Button size="lg" className="w-full" type="submit" disabled={!canSubmit || loading}>
          {loading ? "처리 중..." : "회원가입"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          로그인
        </Link>
      </p>
    </div>
  )
}
