// ─── Admin Mock Data ──────────────────────────────────────────────────────────

import { magazineArticles, feedbackTracks, promoStores, myFeedbacks } from "./mock-data"

// ─── Admin Members ────────────────────────────────────────────────────────────
export type AdminRole = "LISTENER" | "ARTIST" | "PROFESSIONAL" | "ADMIN"

export interface AdminMember {
  id: string
  email: string
  nickname: string
  role: AdminRole
  points: number
  artistName?: string
  createdAt: string
}

export const adminMembers: AdminMember[] = [
  {
    id: "1",
    email: "admin@indiroad.com",
    nickname: "관리자",
    role: "ADMIN",
    points: 0,
    createdAt: "2025-12-01",
  },
  {
    id: "2",
    email: "haneul@example.com",
    nickname: "하늘",
    role: "ARTIST",
    points: 3500,
    artistName: "하늘",
    createdAt: "2026-01-05",
  },
  {
    id: "3",
    email: "sujin@example.com",
    nickname: "이수진",
    role: "ARTIST",
    points: 2000,
    artistName: "이수진",
    createdAt: "2026-01-08",
  },
  {
    id: "4",
    email: "hyunwoo@example.com",
    nickname: "박현우",
    role: "ARTIST",
    points: 1500,
    artistName: "박현우",
    createdAt: "2026-01-10",
  },
  {
    id: "5",
    email: "listener1@example.com",
    nickname: "음악사랑",
    role: "LISTENER",
    points: 1000,
    createdAt: "2026-01-15",
  },
  {
    id: "6",
    email: "listener2@example.com",
    nickname: "인디팬",
    role: "LISTENER",
    points: 2500,
    createdAt: "2026-01-20",
  },
  {
    id: "7",
    email: "pro@example.com",
    nickname: "음악전문가",
    role: "PROFESSIONAL",
    points: 5000,
    createdAt: "2026-01-25",
  },
  {
    id: "8",
    email: "dohyun@example.com",
    nickname: "김도현",
    role: "ARTIST",
    points: 1200,
    artistName: "김도현",
    createdAt: "2026-02-01",
  },
]

// ─── Admin Feedback Submissions ───────────────────────────────────────────────
export type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED"

export interface AdminFeedbackSubmission {
  id: string
  trackId: string
  trackTitle: string
  userId: string
  submitterNickname: string
  impression: string
  highlights: string
  improvements: string
  status: SubmissionStatus
  submittedAt: string
  reward: number
}

export const adminFeedbackSubmissions: AdminFeedbackSubmission[] = [
  {
    id: "s1",
    trackId: "1",
    trackTitle: "새벽 세시의 고백",
    userId: "5",
    submitterNickname: "음악사랑",
    impression: "감성적인 멜로디가 인상적이었습니다.",
    highlights: "보컬의 호흡이 매우 자연스러웠고 가사가 공감을 불러일으킵니다.",
    improvements: "후반부 브릿지 구간에서 편곡이 좀 더 풍성해지면 좋을 것 같습니다.",
    status: "APPROVED",
    submittedAt: "2026-01-20",
    reward: 1000,
  },
  {
    id: "s2",
    trackId: "2",
    trackTitle: "서울의 밤",
    userId: "6",
    submitterNickname: "인디팬",
    impression: "도시적인 감성이 잘 담겨있습니다.",
    highlights: "기타 리프가 중독성 있고 전체적인 편곡이 세련되었습니다.",
    improvements: "믹싱에서 보컬이 좀 더 앞으로 나오면 좋겠습니다.",
    status: "PENDING",
    submittedAt: "2026-02-05",
    reward: 1000,
  },
  {
    id: "s3",
    trackId: "4",
    trackTitle: "우리의 계절",
    userId: "5",
    submitterNickname: "음악사랑",
    impression: "따뜻한 R&B 감성이 좋았습니다.",
    highlights: "화음이 아름답고 가사가 서정적입니다.",
    improvements: "드럼 비트가 좀 더 그루비했으면 합니다.",
    status: "REJECTED",
    submittedAt: "2026-01-30",
    reward: 1000,
  },
  {
    id: "s4",
    trackId: "1",
    trackTitle: "새벽 세시의 고백",
    userId: "7",
    submitterNickname: "음악전문가",
    impression: "프로덕션 퀄리티가 좋습니다.",
    highlights: "마스터링이 깔끔하게 처리되었고 전체적인 사운드 밸런스가 좋습니다.",
    improvements: "인트로가 조금 길어서 리스너의 집중도를 잃을 수 있습니다.",
    status: "PENDING",
    submittedAt: "2026-02-10",
    reward: 1000,
  },
  {
    id: "s5",
    trackId: "6",
    trackTitle: "빛나는 순간",
    userId: "6",
    submitterNickname: "인디팬",
    impression: "에너지 넘치는 밴드 사운드가 인상적입니다.",
    highlights: "기타와 드럼의 호흡이 잘 맞고 라이브 에너지가 느껴집니다.",
    improvements: "보컬 피치가 일부 구간에서 불안정합니다.",
    status: "PENDING",
    submittedAt: "2026-02-15",
    reward: 1000,
  },
]

// ─── Admin Payout ─────────────────────────────────────────────────────────────
export type PayoutStatus = "PENDING" | "PAID"

export interface AdminPayout {
  id: string
  userId: string
  memberNickname: string
  amount: number
  type: string
  status: PayoutStatus
  processedAt?: string
  createdAt: string
}

export const adminPayouts: AdminPayout[] = [
  {
    id: "pay1",
    userId: "5",
    memberNickname: "음악사랑",
    amount: 1000,
    type: "피드백 보상",
    status: "PAID",
    processedAt: "2026-01-25",
    createdAt: "2026-01-20",
  },
  {
    id: "pay2",
    userId: "6",
    memberNickname: "인디팬",
    amount: 1000,
    type: "피드백 보상",
    status: "PENDING",
    createdAt: "2026-02-05",
  },
  {
    id: "pay3",
    userId: "7",
    memberNickname: "음악전문가",
    amount: 1000,
    type: "피드백 보상",
    status: "PENDING",
    createdAt: "2026-02-10",
  },
  {
    id: "pay4",
    userId: "5",
    memberNickname: "음악사랑",
    amount: 1000,
    type: "피드백 보상",
    status: "PENDING",
    createdAt: "2026-02-15",
  },
]

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export const dashboardStats = {
  totalMembers: adminMembers.length,
  totalMagazines: magazineArticles.length,
  pendingFeedbacks: adminFeedbackSubmissions.filter((s) => s.status === "PENDING").length,
  pendingPayouts: adminPayouts.filter((p) => p.status === "PENDING").length,
}
