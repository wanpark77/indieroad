"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react"

export default function FindIdPage() {
  const [nickname, setNickname] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [foundEmail, setFoundEmail] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Mock: simulate finding an email
    setFoundEmail("mu***@example.com")
    setSubmitted(true)
  }

  if (submitted) {
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
          가입 시 사용한 닉네임을 입력해주세요.
          <br />
          등록된 이메일(아이디)을 알려드립니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">닉네임</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="가입 시 사용한 닉네임"
            required
          />
        </div>
        <Button size="lg" className="mt-2 w-full" disabled={!nickname.trim()}>
          아이디 찾기
        </Button>
      </form>
    </div>
  )
}
