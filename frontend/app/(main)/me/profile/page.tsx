"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { getMe, updateProfile, changePassword, UserProfile } from "@/lib/api/me"
import { Save, Lock, Eye, EyeOff } from "lucide-react"

const roleOptions = [
  { value: "LISTENER", label: "리스너" },
  { value: "ARTIST", label: "아티스트" },
  { value: "PROFESSIONAL", label: "음악 종사자" },
]

function PasswordField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-input bg-background px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [nickname, setNickname] = useState("")
  const [role, setRole] = useState("")
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState("")

  // 비밀번호 변경
  const [showPasswordSection, setShowPasswordSection] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("")
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [passwordLoading, setPasswordLoading] = useState(false)

  useEffect(() => {
    getMe()
      .then((data) => {
        setUser(data)
        setNickname(data.nickname)
        setRole(data.role)
      })
      .catch(() => setFetchError("프로필을 불러오지 못했습니다."))
      .finally(() => setLoading(false))
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setSaveError("")
    try {
      const updated = await updateProfile({ nickname, role })
      setUser(updated)
      setNickname(updated.nickname)
      setRole(updated.role)

      // localStorage의 user 정보 업데이트 → 사이드바에 즉시 반영
      const stored = localStorage.getItem("user")
      if (stored) {
        const parsed = JSON.parse(stored)
        localStorage.setItem("user", JSON.stringify({
          ...parsed,
          nickname: updated.nickname,
          role: updated.role,
        }))
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "저장에 실패했습니다."
      if (msg.includes("닉네임")) {
        alert("이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해주세요.")
      } else {
        setSaveError(msg)
      }
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setPasswordError("")
    if (newPassword !== newPasswordConfirm) {
      setPasswordError("새 비밀번호가 일치하지 않습니다.")
      return
    }
    if (newPassword.length < 8) {
      setPasswordError("비밀번호는 8자 이상이어야 합니다.")
      return
    }
    setPasswordLoading(true)
    try {
      await changePassword({ currentPassword, newPassword })
      setPasswordSaved(true)
      setTimeout(() => {
        setPasswordSaved(false)
        setShowPasswordSection(false)
        setCurrentPassword("")
        setNewPassword("")
        setNewPasswordConfirm("")
      }, 2000)
    } catch (err: unknown) {
      setPasswordError(err instanceof Error ? err.message : "비밀번호 변경에 실패했습니다.")
    } finally {
      setPasswordLoading(false)
    }
  }

  function handleCancelPassword() {
    setShowPasswordSection(false)
    setCurrentPassword("")
    setNewPassword("")
    setNewPasswordConfirm("")
    setPasswordError("")
  }

  if (loading) return <p className="text-sm text-muted-foreground">불러오는 중...</p>
  if (!user) return <p className="text-sm text-destructive">{fetchError}</p>

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">프로필</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          기본 정보를 확인하고 수정할 수 있습니다.
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        <div className="rounded-xl bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-base font-bold">내 정보</h2>
          <div className="flex flex-col gap-4">
            {/* 이메일 — 변경 불가 */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                이메일 (변경 불가)
              </label>
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-2.5 text-sm">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
            </div>

            {/* 닉네임 */}
            <div>
              <label className="mb-1.5 block text-sm font-medium">닉네임</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* 역할 */}
            <div>
              <label className="mb-1.5 block text-sm font-medium">역할</label>
              <div className="flex gap-3">
                {roleOptions.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                      role === opt.value
                        ? "border-primary bg-primary/5 font-medium"
                        : "border-input hover:border-primary/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={opt.value}
                      checked={role === opt.value}
                      onChange={(e) => setRole(e.target.value)}
                      className="accent-primary"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {/* 비밀번호 변경 */}
            <div>
              <label className="mb-1.5 block text-sm font-medium">비밀번호</label>
              {!showPasswordSection ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="bg-transparent"
                  onClick={() => setShowPasswordSection(true)}
                >
                  비밀번호 변경하기
                </Button>
              ) : (
                <div className="rounded-lg border border-input p-4">
                  <div className="flex flex-col gap-3">
                    <PasswordField
                      label="현재 비밀번호"
                      value={currentPassword}
                      onChange={setCurrentPassword}
                      placeholder="현재 비밀번호를 입력하세요"
                    />
                    <PasswordField
                      label="새 비밀번호"
                      value={newPassword}
                      onChange={setNewPassword}
                      placeholder="영문 대/소문자, 숫자, 특수문자 포함 8자 이상"
                    />
                    <PasswordField
                      label="새 비밀번호 확인"
                      value={newPasswordConfirm}
                      onChange={setNewPasswordConfirm}
                      placeholder="새 비밀번호를 다시 입력하세요"
                    />
                    {newPasswordConfirm && newPassword !== newPasswordConfirm && (
                      <p className="text-xs text-destructive">새 비밀번호가 일치하지 않습니다.</p>
                    )}
                    {passwordError && (
                      <p className="text-xs text-destructive">{passwordError}</p>
                    )}
                    {passwordSaved && (
                      <p className="text-xs text-emerald-600">비밀번호가 변경되었습니다!</p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleChangePassword}
                        disabled={!currentPassword || !newPassword || !newPasswordConfirm || passwordLoading}
                      >
                        {passwordLoading ? "변경 중..." : "변경하기"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelPassword}
                      >
                        취소
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {saveError && <p className="text-sm text-destructive">{saveError}</p>}

        <div className="flex items-center gap-3">
          <Button size="lg">
            <Save className="mr-2 h-4 w-4" />
            저장하기
          </Button>
          {saved && (
            <span className="text-sm font-medium text-emerald-600">저장되었습니다!</span>
          )}
        </div>
      </form>
    </div>
  )
}
