import { get, post } from "@/lib/api"

export interface StorePromo {
  id: number
  name: string
  location: string
  hours: string
  mood: string
  currentTrack: string
  currentArtist: string
}

export interface PromoApplication {
  id: number
  userId: number
  trackTitle: string
  storeName: string
  plan: string
  startDate: string
  endDate: string
  status: string
}

export interface ApplyStorePromoRequest {
  trackTitle: string
  storeName: string
  plan: string
  startDate: string
  endDate: string
}

export async function getStores(): Promise<StorePromo[]> {
  const res = await get<StorePromo[]>("/api/store-promo")
  return res.data
}

export async function applyStorePromo(data: ApplyStorePromoRequest): Promise<PromoApplication> {
  const res = await post<PromoApplication>("/api/store-promo/apply", data)
  return res.data
}

export async function getMyStorePromos(): Promise<PromoApplication[]> {
  const res = await get<PromoApplication[]>("/api/store-promo/my")
  return res.data
}
