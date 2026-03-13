import { get, put } from "@/lib/api"

export interface UserProfile {
  id: number
  email: string
  nickname: string
  role: string
  points: number
  artistName?: string
  artistLink?: string
  createdAt: string
}

export interface UpdateProfileRequest {
  nickname?: string
  role?: string
  artistName?: string
  artistLink?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface PointsResponse {
  points: number
}

export async function getMe(): Promise<UserProfile> {
  const res = await get<UserProfile>("/api/me")
  return res.data
}

export async function updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
  const res = await put<UserProfile>("/api/me/profile", data)
  return res.data
}

export async function changePassword(data: ChangePasswordRequest): Promise<void> {
  await put("/api/me/password", data)
}

export async function getPoints(): Promise<PointsResponse> {
  const res = await get<PointsResponse>("/api/me/points")
  return res.data
}
