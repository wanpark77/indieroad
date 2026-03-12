"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react"

export default function ResetPasswordPage() {
  const [step, setStep] = useState<"email" | "sent">("email")
  const [email, setEmail] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Mock: simulate sending reset email
    setStep("sent")
  }

  if (step === "sent") {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">이메일을 확인해주세요</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground">{email}</span>
          으로
          <br />
          비밀번호 재설정 링크를 보내드렸습니다.
        </p>
        <div className="mt-6 rounded-xl bg-muted/60 px-6 py-4">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              이메일이 도착하지 않으면 스팸함을 확인해주세요
            </span>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-3">
          <Button size="lg" className="w-full" asChild>
            <Link href="/login">로그인으로 돌아가기</Link>
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="w-full"
            onClick={() => setStep("email")}
          >
            다시 보내기
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
        <h1 className="text-2xl font-bold">비밀번호 찾기</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          가입하신 이메일 주소를 입력해주세요.
          <br />
          비밀번호 재설정 링크를 보내드립니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="email@example.com"
            required
          />
        </div>
        <Button size="lg" className="mt-2 w-full" disabled={!email.trim()}>
          재설정 링크 보내기
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        아이디가 기억나지 않으세요?{" "}
        <Link
          href="/find-id"
          className="font-medium text-primary hover:underline"
        >
          아이디 찾기
        </Link>
      </p>
    </div>
  )
}
