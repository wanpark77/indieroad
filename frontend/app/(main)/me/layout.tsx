"use client"

import React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  User,
  MessageSquare,
  Heart,
  Wallet,
  Music,
  Store,
  Radio,
} from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarLinks = [
  { href: "/me/profile", label: "프로필", icon: User },
  { href: "/me/feedbacks", label: "내 피드백", icon: MessageSquare },
  { href: "/me/my-tracks", label: "내 신청곡", icon: Radio },
  { href: "/me/store-promo", label: "매장 홍보 신청", icon: Store },
  { href: "/me/likes", label: "좋아요", icon: Heart },
  { href: "/me/payout", label: "포인트/정산", icon: Wallet },
]

const artistLinks = [
  { href: "/me/promotions", label: "내 홍보곡", icon: Music },
]

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const stored = typeof window !== "undefined" ? localStorage.getItem("user") : null
  const user = stored ? JSON.parse(stored) : null
  const isArtist = user?.role === "ARTIST"

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 lg:flex-row lg:gap-8 lg:px-6 lg:py-12">
      {/* Sidebar */}
      <aside className="w-full shrink-0 lg:w-56">
        <div className="rounded-xl bg-card p-4 shadow-sm">
          {/* User Info */}
          <div className="mb-4 flex items-center gap-3 border-b border-border pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              {user?.nickname?.charAt(0) ?? "?"}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{user?.nickname ?? ""}</span>
              <span className="text-xs text-muted-foreground">
                {user?.role === "ARTIST" ? "아티스트" : user?.role === "PROFESSIONAL" ? "음악 종사자" : "리스너"}
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col gap-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive(link.href, link.exact)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })}

            {isArtist && (
              <>
                <div className="my-2 border-t border-border" />
                <span className="mb-1 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  아티스트
                </span>
                {artistLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive(link.href)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  )
                })}
              </>
            )}
          </nav>
        </div>
      </aside>

      {/* Content */}
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  )
}
