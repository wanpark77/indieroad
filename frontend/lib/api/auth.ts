import { post } from "@/lib/api"

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  tokenType: string
  userId: number
  email: string
  nickname: string
  role: string
}

export interface SignupRequest {
  email: string
  password: string
  nickname: string
  role: string
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const res = await post<LoginResponse>("/api/auth/login", data)
  return res.data
}

export async function signup(data: SignupRequest): Promise<{ userId: number }> {
  const res = await post<{ userId: number }>("/api/auth/signup", data)
  return res.data
}
