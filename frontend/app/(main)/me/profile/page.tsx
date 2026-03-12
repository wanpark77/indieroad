"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { mockUser } from "@/lib/mock-data"
import { Save, Lock, ExternalLink } from "lucide-react"

const roleLabels: Record<string, string> = {
  listener: "리스너",
  artist: "아티스트",
  professional: "음악 종사자",
}

export default function ProfilePage() {
  const [nickname, setNickname] = useState(mockUser.nickname)
  const [marketingAgreed, setMarketingAgreed] = useState(true)
  const [artistName, setArtistName] = useState(mockUser.artistName || "")
  const [artistLink, setArtistLink] = useState(mockUser.artistLink || "")
  const [saved, setSaved] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">프로필</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          기본 정보를 확인하고 수정할 수 있습니다.
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Read-only fields */}
        <div className="rounded-xl bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-base font-bold">기본 정보</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                이메일 (변경 불가)
              </label>
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-2.5 text-sm">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{mockUser.email}</span>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                역할 (변경 불가)
              </label>
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-2.5 text-sm">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{roleLabels[mockUser.role]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Editable fields */}
        <div className="rounded-xl bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-base font-bold">수정 가능 정보</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">닉네임</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                비밀번호 변경
              </label>
              <Button type="button" variant="outline" size="sm" className="bg-transparent">
                비밀번호 변경하기
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="marketing"
                checked={marketingAgreed}
                onChange={(e) => setMarketingAgreed(e.target.checked)}
                className="accent-primary"
              />
              <label htmlFor="marketing" className="text-sm">
                마케팅 수신 동의
              </label>
            </div>
          </div>
        </div>

        {/* Artist fields */}
        {mockUser.role === "artist" && (
          <div className="rounded-xl bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-base font-bold">아티스트 정보 (선택)</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  아티스트명
                </label>
                <input
                  type="text"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="활동명을 입력하세요"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  대표 링크
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={artistLink}
                    onChange={(e) => setArtistLink(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="유튜브, 인스타, 사운드클라우드 등"
                  />
                  {artistLink && (
                    <a
                      href={artistLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 rounded-lg border border-input p-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Button size="lg">
            <Save className="mr-2 h-4 w-4" />
            저장하기
          </Button>
          {saved && (
            <span className="text-sm font-medium text-emerald-600">
              저장되었습니다!
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
