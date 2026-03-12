import React from "react"
import type { Metadata, Viewport } from "next"
import { Noto_Sans_KR } from "next/font/google"

import "./globals.css"

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-sans-kr",
})

export const metadata: Metadata = {
  title: "인디로드 | IndieRoad - 음악이 자연스럽게 흐르는 곳",
  description:
    "음악 매거진, 음악 피드백, 매장 음원 홍보까지. 인디 음악을 위한 따뜻한 커뮤니티 플랫폼.",
}

export const viewport: Viewport = {
  themeColor: "#D74F50",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={notoSansKR.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
