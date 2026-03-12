"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, Eye, Heart } from "lucide-react"
import { adminGetMagazines, adminDeleteMagazine } from "@/lib/api/admin"
import type { MagazineArticle } from "@/lib/api/magazine"

const categoryColors: Record<string, string> = {
  INTERVIEW: "bg-purple-100 text-purple-700",
  PLAYLIST: "bg-green-100 text-green-700",
  PRODUCT: "bg-blue-100 text-blue-700",
  NEWS: "bg-yellow-100 text-yellow-700",
  CONCERT: "bg-red-100 text-red-700",
}

export default function AdminMagazinePage() {
  const router = useRouter()
  const [articles, setArticles] = useState<MagazineArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) {
      router.push("/login")
      return
    }
    const fetchArticles = async () => {
      try {
        const data = await adminGetMagazines()
        setArticles(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [router])

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return
    try {
      await adminDeleteMagazine(id)
      setArticles((prev) => prev.filter((a) => a.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return <p className="text-gray-500">로딩 중...</p>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">총 {articles.length}개의 아티클</p>
        <Button asChild>
          <Link href="/admin/magazine/new">
            <Plus className="w-4 h-4 mr-2" />
            새 아티클 등록
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>제목</TableHead>
                <TableHead>카테고리</TableHead>
                <TableHead>작성자</TableHead>
                <TableHead>날짜</TableHead>
                <TableHead>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> 조회
                  </span>
                </TableHead>
                <TableHead>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5" /> 좋아요
                  </span>
                </TableHead>
                <TableHead className="text-right">액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium max-w-xs">
                    <span className="truncate block">{article.title}</span>
                    <span className="text-xs text-gray-400">{article.slug}</span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[article.category] ?? "bg-gray-100 text-gray-700"}`}
                    >
                      {article.categoryLabel}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-600">{article.author}</TableCell>
                  <TableCell className="text-gray-500 text-sm">{article.date}</TableCell>
                  <TableCell className="text-gray-600">{article.views.toLocaleString()}</TableCell>
                  <TableCell className="text-gray-600">{article.likes.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/magazine/${article.id}`}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(article.id as number)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
