"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { signup } from "@/lib/api/auth"

const roles = [
  { value: "LISTENER", label: "리스너", desc: "음악을 듣고 피드백하고 싶어요" },
  { value: "ARTIST", label: "아티스트", desc: "내 음악을 홍보하고 싶어요" },
  {
    value: "PROFESSIONAL",
    label: "음악 종사자",
    desc: "음악 업계에서 일하고 있어요",
  },
]

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
    role: "",
    termsAgreed: false,
    privacyAgreed: false,
    marketingAgreed: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const update = (key: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const canSubmit =
    form.email &&
    form.password &&
    form.password === form.passwordConfirm &&
    form.password.length >= 8 &&
    form.nickname &&
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
            placeholder="최소 8자 (영문+숫자 권장)"
          />
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
                  <span className="text-xs text-muted-foreground">
                    {role.desc}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Agreements */}
        <div className="flex flex-col gap-2 rounded-xl bg-muted/50 p-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.termsAgreed}
              onChange={(e) => update("termsAgreed", e.target.checked)}
              className="accent-primary"
            />
            <span>
              <Link href="/terms" className="underline">
                서비스 이용약관
              </Link>{" "}
              동의{" "}
              <span className="text-xs text-destructive">(필수)</span>
            </span>
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.privacyAgreed}
              onChange={(e) => update("privacyAgreed", e.target.checked)}
              className="accent-primary"
            />
            <span>
              <Link href="/privacy" className="underline">
                개인정보처리방침
              </Link>{" "}
              동의{" "}
              <span className="text-xs text-destructive">(필수)</span>
            </span>
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.marketingAgreed}
              onChange={(e) => update("marketingAgreed", e.target.checked)}
              className="accent-primary"
            />
            <span>
              마케팅 수신 동의{" "}
              <span className="text-xs text-muted-foreground">(선택)</span>
            </span>
          </label>
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
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          로그인
        </Link>
      </p>
    </div>
  )
}
