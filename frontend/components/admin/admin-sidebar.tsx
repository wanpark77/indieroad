"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Store,
  Users,
  CreditCard,
} from "lucide-react"

const menuItems = [
  {
    href: "/admin",
    label: "대시보드",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/magazine",
    label: "매거진",
    icon: BookOpen,
  },
  {
    href: "/admin/feedback",
    label: "피드백",
    icon: MessageSquare,
  },
  {
    href: "/admin/store-promo",
    label: "매장홍보",
    icon: Store,
  },
  {
    href: "/admin/members",
    label: "회원관리",
    icon: Users,
  },
  {
    href: "/admin/payout",
    label: "정산",
    icon: CreditCard,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-40">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-200">
        <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
          <span className="text-white text-xs font-bold">IR</span>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">IndieRoad</p>
          <p className="text-xs text-gray-400">관리자 패널</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-200">
        <p className="text-xs text-gray-400 text-center">IndieRoad Admin v1.0</p>
      </div>
    </aside>
  )
}
