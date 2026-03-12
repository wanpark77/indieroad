"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { mockUser, myFeedbacks } from "@/lib/mock-data"
import { Wallet, AlertCircle, CheckCircle2, CreditCard } from "lucide-react"

const banks = [
  "국민은행",
  "신한은행",
  "우리은행",
  "하나은행",
  "농협은행",
  "카카오뱅크",
  "토스뱅크",
  "기업은행",
  "SC제일은행",
  "대구은행",
]

export default function PayoutPage() {
  const [accountHolder, setAccountHolder] = useState("")
  const [bank, setBank] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [requested, setRequested] = useState(false)

  const totalEarned = myFeedbacks
    .filter((f) => f.status === "approved")
    .reduce((sum, f) => sum + f.reward, 0)

  const minPayout = 5000
  const canRequest = mockUser.points >= minPayout

  function handleRequest(e: React.FormEvent) {
    e.preventDefault()
    setRequested(true)
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">포인트/정산</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          적립된 포인트를 확인하고 정산을 요청하세요.
        </p>
      </div>

      {/* Balance Card */}
      <div className="rounded-xl bg-gradient-to-br from-primary/10 to-accent/30 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-card shadow-sm">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">보유 포인트</span>
            <span className="text-3xl font-bold tracking-tight text-foreground">
              {mockUser.points.toLocaleString()}
              <span className="ml-1 text-base font-medium text-muted-foreground">
                P
              </span>
            </span>
          </div>
        </div>
        <div className="mt-4 flex gap-4 text-sm">
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground">총 적립</span>
            <span className="font-semibold">{totalEarned.toLocaleString()}P</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground">최소 정산 금액</span>
            <span className="font-semibold">{minPayout.toLocaleString()}원</span>
          </div>
        </div>
      </div>

      {/* Payout Info */}
      <div className="rounded-xl bg-card p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div className="flex flex-col gap-1 text-sm leading-relaxed text-muted-foreground">
            <span>포인트는 현금과 1:1로 정산됩니다.</span>
            <span>정산 요청 후 5일 이내 입금됩니다.</span>
            <span>최소 정산 금액은 5,000원입니다.</span>
          </div>
        </div>
      </div>

      {/* Account Form */}
      {requested ? (
        <div className="rounded-xl bg-card p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="text-lg font-bold">정산 요청이 완료되었습니다</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            5일 이내에 등록하신 계좌로 입금됩니다.
          </p>
          <Button
            className="mt-6 bg-transparent"
            variant="outline"
            onClick={() => setRequested(false)}
          >
            확인
          </Button>
        </div>
      ) : (
        <form onSubmit={handleRequest} className="flex flex-col gap-6">
          <div className="rounded-xl bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <h2 className="text-base font-bold">계좌 정보 입력</h2>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  예금주 <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="예금주명을 입력하세요"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  은행 <span className="text-destructive">*</span>
                </label>
                <select
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                >
                  <option value="">은행을 선택하세요</option>
                  {banks.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  계좌번호 <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="'-' 없이 입력하세요"
                  required
                />
              </div>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full sm:w-auto"
            disabled={
              !canRequest || !accountHolder || !bank || !accountNumber
            }
          >
            {canRequest
              ? `${mockUser.points.toLocaleString()}P 정산 요청하기`
              : `최소 ${minPayout.toLocaleString()}원 이상 필요합니다`}
          </Button>
        </form>
      )}
    </div>
  )
}
