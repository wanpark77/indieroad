import { get, post } from "@/lib/api"

export interface FeedbackTrack {
  id: number
  title: string
  artist: string
  genre: string
  mood: string
  description: string
  reward: number
  duration: string
  applicants: number
  maxApplicants: number
  status: string
  bpm: number
}

export interface FeedbackSubmission {
  id: number
  trackId: number
  trackTitle?: string
  trackArtist?: string
  userId: number
  impression: string
  highlights: string
  improvements: string
  status: string
  submittedAt: string
  reward: number
}

export interface FeedbackSubmissionRequest {
  impression: string
  highlights: string
  improvements: string
}

export async function getTracks(status?: string): Promise<FeedbackTrack[]> {
  const query = status ? `?status=${status}` : ""
  const res = await get<FeedbackTrack[]>(`/api/feedback/tracks${query}`)
  return res.data
}

export async function getTrack(id: number): Promise<FeedbackTrack> {
  const res = await get<FeedbackTrack>(`/api/feedback/tracks/${id}`)
  return res.data
}

export async function applyFeedback(trackId: number): Promise<void> {
  await post<{ status: string }>(`/api/feedback/tracks/${trackId}/apply`)
}

export async function submitFeedback(
  trackId: number,
  data: FeedbackSubmissionRequest
): Promise<FeedbackSubmission> {
  const res = await post<FeedbackSubmission>(`/api/feedback/tracks/${trackId}/submit`, data)
  return res.data
}

export async function getMyFeedbacks(): Promise<FeedbackSubmission[]> {
  const res = await get<FeedbackSubmission[]>("/api/feedback/my")
  return res.data
}
