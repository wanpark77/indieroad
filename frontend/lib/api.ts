const BASE_URL = "http://localhost:8080"

function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "요청 실패" }))
    throw new Error(error.message || `HTTP ${res.status}`)
  }

  return res.json() as Promise<T>
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
}

export function get<T>(path: string): Promise<ApiResponse<T>> {
  return request<ApiResponse<T>>(path, { method: "GET" })
}

export function post<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
  return request<ApiResponse<T>>(path, {
    method: "POST",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
}

export function put<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
  return request<ApiResponse<T>>(path, {
    method: "PUT",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
}

export function del<T>(path: string): Promise<ApiResponse<T>> {
  return request<ApiResponse<T>>(path, { method: "DELETE" })
}
