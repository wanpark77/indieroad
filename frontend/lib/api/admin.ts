import { get, post, put, del } from "@/lib/api"
import type { MagazineArticle, AdminMagazineRequest } from "./magazine"
import type { FeedbackTrack } from "./feedback"
import type { StorePromo } from "./store-promo"

export interface AdminDashboard {
  totalMembers: number
  totalMagazines: number
  pendingFeedbacks: number
  pendingPayouts: number
  recentFeedbacks: {
    id: number
    trackTitle: string
    submitter: string
    status: string
    submittedAt: string
  }[]
  recentMembers: {
    id: number
    email: string
    nickname: string
    role: string
    joinedAt: string
  }[]
}

export interface AdminMember {
  id: number
  email: string
  nickname: string
  role: string
  points: number
  artistName?: string
  createdAt: string
}

export interface AdminFeedbackSubmission {
  id: number
  trackId: number
  trackTitle: string
  userId: number
  submitterNickname: string
  impression: string
  highlights: string
  improvements: string
  status: string
  submittedAt: string
  reward: number
}

export interface AdminPayout {
  id: number
  userId: number
  memberNickname: string
  amount: number
  type: string
  status: string
  processedAt?: string
  createdAt: string
}

export interface PromoApplicationResponse {
  id: number
  userId: number
  storeId: number
  trackTitle: string
  plan: string
  startDate: string
  endDate: string
  status: string
}

export interface AdminStoreRequest {
  name: string
  location: string
  hours: string
  mood: string
}

// Dashboard
export async function getDashboard(): Promise<AdminDashboard> {
  const res = await get<AdminDashboard>("/api/admin/dashboard")
  return res.data
}

// Members
export async function getMembers(): Promise<AdminMember[]> {
  const res = await get<AdminMember[]>("/api/admin/members")
  return res.data
}

export async function updateMemberRole(id: number, role: string): Promise<AdminMember> {
  const res = await put<AdminMember>(`/api/admin/members/${id}/role`, { role })
  return res.data
}

export async function updateMemberPoints(id: number, amount: number): Promise<AdminMember> {
  const res = await put<AdminMember>(`/api/admin/members/${id}/points`, { amount })
  return res.data
}

// Magazine
export async function adminGetMagazines(): Promise<MagazineArticle[]> {
  const res = await get<MagazineArticle[]>("/api/admin/magazine")
  return res.data
}

export async function adminCreateMagazine(data: AdminMagazineRequest): Promise<MagazineArticle> {
  const res = await post<MagazineArticle>("/api/admin/magazine", data)
  return res.data
}

export async function adminUpdateMagazine(id: number, data: AdminMagazineRequest): Promise<MagazineArticle> {
  const res = await put<MagazineArticle>(`/api/admin/magazine/${id}`, data)
  return res.data
}

export async function adminDeleteMagazine(id: number): Promise<void> {
  await del<void>(`/api/admin/magazine/${id}`)
}

// Feedback
export async function adminGetFeedbackTracks(): Promise<FeedbackTrack[]> {
  const res = await get<FeedbackTrack[]>("/api/admin/feedback/tracks")
  return res.data
}

export async function adminGetFeedbackSubmissions(): Promise<AdminFeedbackSubmission[]> {
  const res = await get<AdminFeedbackSubmission[]>("/api/admin/feedback/submissions")
  return res.data
}

export async function approveSubmission(id: number): Promise<AdminFeedbackSubmission> {
  const res = await put<AdminFeedbackSubmission>(`/api/admin/feedback/submissions/${id}/approve`)
  return res.data
}

export async function rejectSubmission(id: number): Promise<AdminFeedbackSubmission> {
  const res = await put<AdminFeedbackSubmission>(`/api/admin/feedback/submissions/${id}/reject`)
  return res.data
}

// Store Promo
export async function adminGetStores(): Promise<StorePromo[]> {
  const res = await get<StorePromo[]>("/api/admin/store-promo/stores")
  return res.data
}

export async function adminCreateStore(data: AdminStoreRequest): Promise<StorePromo> {
  const res = await post<StorePromo>("/api/admin/store-promo/stores", data)
  return res.data
}

export async function adminUpdateStore(id: number, data: AdminStoreRequest): Promise<StorePromo> {
  const res = await put<StorePromo>(`/api/admin/store-promo/stores/${id}`, data)
  return res.data
}

export async function adminGetPromoApplications(): Promise<PromoApplicationResponse[]> {
  const res = await get<PromoApplicationResponse[]>("/api/admin/store-promo/applications")
  return res.data
}

// Payout
export async function getPayouts(): Promise<AdminPayout[]> {
  const res = await get<AdminPayout[]>("/api/admin/payout")
  return res.data
}

export async function processPayout(id: number): Promise<AdminPayout> {
  const res = await put<AdminPayout>(`/api/admin/payout/${id}/process`)
  return res.data
}
