import { get, post, put, del } from "@/lib/api"

export interface MagazineArticle {
  id: number
  slug: string
  title: string
  category: string
  categoryLabel: string
  summary: string
  coverColor: string
  author: string
  date: string
  views: number
  likes: number
  commentsCount: number
  content?: string
  coverImageUrl?: string
}

export interface AdminMagazineRequest {
  title: string
  slug: string
  category: string
  summary: string
  content: string
  author: string
  coverColor: string
}

export async function getMagazines(category?: string): Promise<MagazineArticle[]> {
  const query = category ? `?category=${category}` : ""
  const res = await get<MagazineArticle[]>(`/api/magazine${query}`)
  return res.data
}

export async function getMagazine(slug: string): Promise<MagazineArticle> {
  const res = await get<MagazineArticle>(`/api/magazine/${slug}`)
  return res.data
}

export async function createMagazine(data: AdminMagazineRequest): Promise<MagazineArticle> {
  const res = await post<MagazineArticle>("/api/admin/magazine", data)
  return res.data
}

export async function updateMagazine(id: number, data: AdminMagazineRequest): Promise<MagazineArticle> {
  const res = await put<MagazineArticle>(`/api/admin/magazine/${id}`, data)
  return res.data
}

export async function deleteMagazine(id: number): Promise<void> {
  await del<void>(`/api/admin/magazine/${id}`)
}
