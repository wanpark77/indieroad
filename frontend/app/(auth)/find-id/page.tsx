"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react"
import { findEmail } from "@/lib/api/auth"

export default function FindIdPage() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [foundEmail, setFoundEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const email = await findEmail(name, phone)
      setFoundEmail(email)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "이메일을 찾을 수 없습니다.")
    } finally {
      setLoading(false)
    }
  }

  if (foundEmail) {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">아이디를 찾았습니다</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          입력하신 정보와 일치하는 계정입니다.
        </p>
        <div className="mt-6 rounded-xl bg-muted/60 px-6 py-4">
          <div className="flex items-center justify-center gap-2">
            <Mail className="h-4 w-4 text-primary" />
            <span className="text-base font-semibold">{foundEmail}</span>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-3">
          <Button size="lg" className="w-full" asChild>
            <Link href="/login">로그인하기</Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full bg-transparent" asChild>
            <Link href="/reset-password">비밀번호 찾기</Link>
          </Button>
        </div>
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
        <h1 className="text-2xl font-bold">아이디 찾기</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          가입 시 입력한 이름과 전화번호로 이메일을 찾을 수 있습니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button
          size="lg"
          className="mt-2 w-full"
          disabled={!name.trim() || phone.length < 10 || loading}
        >
          {loading ? "조회 중..." : "아이디 찾기"}
        </Button>
      </form>
    </div>
  )
}
