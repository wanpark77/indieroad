"use client"

import { usePathname } from "next/navigation"
import { Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"

const pageTitles: Record<string, string> = {
  "/admin": "대시보드",
  "/admin/magazine": "매거진 관리",
  "/admin/feedback": "피드백 관리",
  "/admin/store-promo": "매장홍보 관리",
  "/admin/store-promo/applications": "홍보 신청 목록",
  "/admin/members": "회원 관리",
  "/admin/payout": "정산 관리",
}

export default function AdminHeader() {
  const pathname = usePathname()

  const getPageTitle = () => {
    if (pageTitles[pathname]) return pageTitles[pathname]
    if (pathname.startsWith("/admin/magazine/")) return "매거진 등록/수정"
    if (pathname.startsWith("/admin/feedback/")) return "피드백 제출 목록"
    return "관리자 패널"
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-gray-900">{getPageTitle()}</h1>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-4 h-4 text-gray-500" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">관리자</p>
            <p className="text-xs text-gray-400">admin@indiroad.com</p>
          </div>
        </div>
      </div>
    </header>
  )
}
