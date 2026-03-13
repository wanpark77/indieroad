"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle2, Eye, EyeOff } from "lucide-react"
import { resetPassword } from "@/lib/api/auth"

type Step = "verify" | "newPassword" | "done"

function PasswordInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-input bg-card px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        required
      />
      <button
        type="button"
        onClick={() => setShow((p) => !p)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  )
}

export default function ResetPasswordPage() {
  const [step, setStep] = useState<Step>("verify")

  // 본인 확인 필드
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [verifyError, setVerifyError] = useState("")
  const [verifyLoading, setVerifyLoading] = useState(false)

  // 새 비밀번호 필드
  const [newPassword, setNewPassword] = useState("")
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("")
  const [resetError, setResetError] = useState("")
  const [resetLoading, setResetLoading] = useState(false)

  // 1단계: 본인 확인 (이메일+이름+전화번호 일치 여부를 백엔드에서 최종 검증)
  function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setVerifyError("")
    if (phone.length < 10) {
      setVerifyError("올바른 전화번호를 입력해주세요.")
      return
    }
    setStep("newPassword")
  }

  // 2단계: 새 비밀번호 설정
  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setResetError("")
    if (newPassword !== newPasswordConfirm) {
      setResetError("새 비밀번호가 일치하지 않습니다.")
      return
    }
    if (newPassword.length < 8) {
      setResetError("비밀번호는 8자 이상이어야 합니다.")
      return
    }
    setResetLoading(true)
    try {
      await resetPassword(email, name, phone, newPassword)
      setStep("done")
    } catch (err: unknown) {
      setResetError(err instanceof Error ? err.message : "비밀번호 재설정에 실패했습니다.")
    } finally {
      setResetLoading(false)
    }
  }

  if (step === "done") {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">비밀번호가 변경되었습니다</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          새 비밀번호로 로그인해주세요.
        </p>
        <div className="mt-8">
          <Button size="lg" className="w-full" asChild>
            <Link href="/login">로그인하기</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (step === "newPassword") {
    return (
      <div className="w-full max-w-sm">
        <button
          onClick={() => setStep("verify")}
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          이전으로
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold">새 비밀번호 설정</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            사용할 새 비밀번호를 입력해주세요.
          </p>
        </div>

        <form onSubmit={handleReset} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">새 비밀번호</label>
            <PasswordInput
              value={newPassword}
              onChange={setNewPassword}
              placeholder="영문 대/소문자, 숫자, 특수문자 포함 8자 이상"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">새 비밀번호 확인</label>
            <PasswordInput
              value={newPasswordConfirm}
              onChange={setNewPasswordConfirm}
              placeholder="새 비밀번호를 다시 입력하세요"
            />
            {newPasswordConfirm && newPassword !== newPasswordConfirm && (
              <p className="mt-1 text-xs text-destructive">비밀번호가 일치하지 않습니다.</p>
            )}
          </div>
          {resetError && <p className="text-sm text-destructive">{resetError}</p>}
          <Button
            size="lg"
            className="mt-2 w-full"
            disabled={!newPassword || !newPasswordConfirm || resetLoading}
          >
            {resetLoading ? "변경 중..." : "비밀번호 변경하기"}
          </Button>
        </form>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm">
      <Link
        href="/login"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        로그인으로 돌아가기
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold">비밀번호 찾기</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          가입 시 입력한 정보로 본인을 확인합니다.
        </p>
      </div>

      <form onSubmit={handleVerify} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="가입 시 사용한 이메일"
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="가입 시 입력한 실명"
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">전화번호</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
            className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="01012345678 (숫자만 입력)"
            maxLength={11}
            required
          />
        </div>
        {verifyError && <p className="text-sm text-destructive">{verifyError}</p>}
        <Button
          size="lg"
          className="mt-2 w-full"
          disabled={!email.trim() || !name.trim() || phone.length < 10 || verifyLoading}
        >
          본인 확인
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        아이디가 기억나지 않으세요?{" "}
        <Link href="/find-id" className="font-medium text-primary hover:underline">
          아이디 찾기
        </Link>
      </p>
    </div>
  )
}
