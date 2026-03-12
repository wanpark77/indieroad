// ─── Magazine Articles ────────────────────────────────────────────────────────
export type MagazineCategory =
  | "interview"
  | "playlist"
  | "product"
  | "news"
  | "concert"

export interface MagazineArticle {
  id: string
  slug: string
  title: string
  category: MagazineCategory
  categoryLabel: string
  summary: string
  coverColor: string
  author: string
  date: string
  views: number
  likes: number
  commentsCount: number
  content: string
}

export const magazineCategories: { value: MagazineCategory; label: string }[] =
  [
    { value: "interview", label: "아티스트 인터뷰" },
    { value: "playlist", label: "플레이리스트" },
    { value: "product", label: "제품" },
    { value: "news", label: "소식" },
    { value: "concert", label: "공연" },
  ]

export const magazineArticles: MagazineArticle[] = [
  {
    id: "1",
    slug: "dreaming-indie-artist",
    title: "꿈꾸는 인디 아티스트, 하늘의 이야기",
    category: "interview",
    categoryLabel: "아티스트 인터뷰",
    summary:
      "서울 홍대 골목에서 시작한 싱어송라이터 하늘. 그녀의 음악 여정과 새 앨범에 대해 이야기합니다.",
    coverColor: "from-rose-200 to-amber-100",
    author: "인디로드 에디터",
    date: "2026-02-01",
    views: 2340,
    likes: 187,
    commentsCount: 23,
    content: `서울 홍대의 작은 라이브 카페에서 처음 마이크를 잡았던 하늘. 그때의 떨림을 아직도 기억한다고 합니다.\n\n"처음엔 다섯 명 앞에서도 떨었어요. 근데 노래가 끝나고 박수를 받았을 때, 아 이게 내가 하고 싶은 거구나 싶었죠."\n\n새 앨범 '여름 끝에서'는 그녀의 20대를 담은 자전적 이야기입니다. 어쿠스틱 기타와 피아노 사운드를 중심으로, 일상의 소소한 감정들을 따뜻하게 풀어냈습니다.\n\n"이 앨범은 제가 20대를 보내면서 느꼈던 모든 감정의 기록이에요. 설레임, 불안, 그리고 결국엔 괜찮아진다는 이야기."`,
  },
  {
    id: "2",
    slug: "spring-acoustic-playlist",
    title: "봄이 오면 듣고 싶은 어쿠스틱 플레이리스트",
    category: "playlist",
    categoryLabel: "플레이리스트",
    summary:
      "포근한 봄 햇살과 잘 어울리는 인디 어쿠스틱 곡 10선을 소개합니다.",
    coverColor: "from-emerald-100 to-sky-100",
    author: "인디로드 에디터",
    date: "2026-01-28",
    views: 3120,
    likes: 245,
    commentsCount: 31,
    content:
      "봄바람이 불기 시작하면 자연스럽게 손이 가는 플레이리스트가 있습니다. 잔잔한 기타 선율과 따뜻한 목소리가 어우러진 인디 어쿠스틱 곡들을 모아봤습니다.",
  },
  {
    id: "3",
    slug: "indie-audio-gear",
    title: "인디 뮤지션이 추천하는 홈레코딩 장비",
    category: "product",
    categoryLabel: "제품",
    summary:
      "집에서도 퀄리티 있는 녹음을 할 수 있는 장비들을 인디 뮤지션들이 직접 추천합니다.",
    coverColor: "from-violet-100 to-rose-100",
    author: "장비 리뷰어 민수",
    date: "2026-01-25",
    views: 1890,
    likes: 156,
    commentsCount: 18,
    content:
      "홈레코딩의 시대가 왔습니다. 비싼 스튜디오 없이도 좋은 사운드를 만들 수 있는 장비들을 소개합니다.",
  },
  {
    id: "4",
    slug: "indie-music-festival-2026",
    title: "2026 인디 뮤직 페스티벌 라인업 총정리",
    category: "concert",
    categoryLabel: "공연",
    summary:
      "올해 놓치면 안 되는 인디 뮤직 페스티벌 라인업을 한눈에 정리했습니다.",
    coverColor: "from-amber-100 to-orange-200",
    author: "인디로드 에디터",
    date: "2026-01-20",
    views: 4520,
    likes: 312,
    commentsCount: 45,
    content:
      "2026년에도 어김없이 돌아온 인디 뮤직 페스티벌 시즌! 올해는 특히 신진 아티스트들의 참여가 눈에 띕니다.",
  },
  {
    id: "5",
    slug: "lo-fi-bedroom-pop",
    title: "Lo-fi 베드룸 팝의 매력에 빠지다",
    category: "playlist",
    categoryLabel: "플레이리스트",
    summary:
      "밤에 혼자 듣기 좋은 Lo-fi 베드룸 팝 곡들을 모아봤습니다.",
    coverColor: "from-indigo-100 to-purple-100",
    author: "인디로드 에디터",
    date: "2026-01-15",
    views: 2780,
    likes: 201,
    commentsCount: 27,
    content:
      "침실에서 태어난 음악, 베드룸 팝. 화려하지 않지만 진솔한 감성이 담긴 곡들을 소개합니다.",
  },
  {
    id: "6",
    slug: "indie-label-story",
    title: "작은 인디 레이블이 살아남는 법",
    category: "news",
    categoryLabel: "소식",
    summary:
      "치열한 음악 시장에서 자신만의 색깔을 지키며 운영되는 인디 레이블들의 이야기.",
    coverColor: "from-teal-100 to-cyan-100",
    author: "음악산업 기자 지은",
    date: "2026-01-10",
    views: 1560,
    likes: 134,
    commentsCount: 12,
    content:
      "대형 기획사의 그늘 아래에서도 꿋꿋이 자신만의 음악을 만들어가는 인디 레이블들. 그들의 생존 전략을 들어봤습니다.",
  },
]

// ─── Feedback Tracks ──────────────────────────────────────────────────────────
export type FeedbackStatus = "open" | "closed"

export interface FeedbackTrack {
  id: string
  title: string
  artist: string
  genre: string
  mood: string
  description: string
  reward: number
  duration: string
  applicants: number
  maxApplicants: number
  status: FeedbackStatus
  bpm: number
}

export const feedbackTracks: FeedbackTrack[] = [
  {
    id: "1",
    title: "새벽 세시의 고백",
    artist: "이수진",
    genre: "발라드",
    mood: "Slow",
    description:
      "새벽 감성을 담은 발라드 곡입니다. 솔직한 피드백을 기다리고 있어요.",
    reward: 1000,
    duration: "4:32",
    applicants: 2,
    maxApplicants: 5,
    status: "open",
    bpm: 72,
  },
  {
    id: "2",
    title: "서울의 밤",
    artist: "박현우",
    genre: "인디 팝",
    mood: "Mid-tempo",
    description:
      "도시의 밤 풍경을 그린 인디 팝. 여러분의 솔직한 의견이 궁금합니다.",
    reward: 1000,
    duration: "3:48",
    applicants: 4,
    maxApplicants: 5,
    status: "open",
    bpm: 110,
  },
  {
    id: "3",
    title: "여름 끝에서",
    artist: "하늘",
    genre: "어쿠스틱",
    mood: "Slow",
    description:
      "여름이 끝나갈 때의 아쉬움을 담은 어쿠스틱 곡입니다.",
    reward: 1000,
    duration: "4:15",
    applicants: 3,
    maxApplicants: 3,
    status: "closed",
    bpm: 88,
  },
  {
    id: "4",
    title: "우리의 계절",
    artist: "김도현",
    genre: "R&B",
    mood: "Mid-tempo",
    description: "따뜻한 R&B 트랙. 보컬과 사운드에 대한 피드백을 원합니다.",
    reward: 1000,
    duration: "3:56",
    applicants: 7,
    maxApplicants: 10,
    status: "open",
    bpm: 95,
  },
  {
    id: "5",
    title: "달빛 아래",
    artist: "정서영",
    genre: "포크",
    mood: "Slow",
    description: "포크 기타와 함께하는 잔잔한 노래입니다.",
    reward: 1000,
    duration: "3:22",
    applicants: 5,
    maxApplicants: 5,
    status: "closed",
    bpm: 80,
  },
  {
    id: "6",
    title: "빛나는 순간",
    artist: "밴드 루미너스",
    genre: "밴드 팝",
    mood: "Up-tempo",
    description: "에너지 넘치는 밴드 사운드! 솔직한 리뷰 부탁드려요.",
    reward: 1000,
    duration: "3:40",
    applicants: 1,
    maxApplicants: 3,
    status: "open",
    bpm: 140,
  },
]

// ─── Store Promo ──────────────────────────────────────────────────────────────
export interface PromoStore {
  id: string
  name: string
  location: string
  hours: string
  mood: string
  currentTrack: string
  currentArtist: string
}

export const promoStores: PromoStore[] = [
  {
    id: "1",
    name: "카페 봄날",
    location: "서울 마포구 연남동",
    hours: "10:00 - 22:00",
    mood: "Slow - 포크, 발라드, 어쿠스틱",
    currentTrack: "봄이 오면",
    currentArtist: "이수진",
  },
  {
    id: "2",
    name: "레코드샵 비닐",
    location: "서울 용산구 이태원",
    hours: "12:00 - 21:00",
    mood: "Mid-tempo - R&B, 인디",
    currentTrack: "서울의 밤",
    currentArtist: "박현우",
  },
  {
    id: "3",
    name: "브런치 카페 모닝",
    location: "서울 강남구 신사동",
    hours: "08:00 - 20:00",
    mood: "Slow - 팝",
    currentTrack: "달빛 아래",
    currentArtist: "정서영",
  },
  {
    id: "4",
    name: "독립서점 페이지",
    location: "서울 종로구 삼청동",
    hours: "11:00 - 20:00",
    mood: "Slow - 포크, 발라드, 어쿠스틱",
    currentTrack: "여름 끝에서",
    currentArtist: "하늘",
  },
]

// ─── Reviews / Testimonials ───────────────────────────────────────────────────
export interface Review {
  id: string
  author: string
  role: string
  content: string
  rating: number
}

export const storePromoReviews: Review[] = [
  {
    id: "1",
    author: "이수진",
    role: "싱어송라이터",
    content:
      "매장에서 제 노래가 흘러나온다는 게 정말 신기하고 감사해요. 실제로 그 매장에서 제 음악을 들은 분이 SNS로 연락을 주시기도 했어요!",
    rating: 5,
  },
  {
    id: "2",
    author: "카페 봄날 사장님",
    role: "매장 운영자",
    content:
      "인디 음악이 카페 분위기와 정말 잘 맞아요. 손님들이 음악이 좋다고 물어보시는 경우가 많아졌어요.",
    rating: 5,
  },
  {
    id: "3",
    author: "김도현",
    role: "R&B 아티스트",
    content:
      "새로운 홍보 채널이 생긴 느낌이에요. 스트리밍 숫자만 보던 것에서 벗어나 실제 공간에서 음악이 흐르는 경험이 좋았습니다.",
    rating: 4,
  },
]

// ─── User Mock Data (for My Page) ─────────────────────────────────────────────
export interface MockUser {
  id: string
  email: string
  nickname: string
  role: "listener" | "artist" | "professional"
  points: number
  artistName?: string
  artistLink?: string
}

export const mockUser: MockUser = {
  id: "user-1",
  email: "music@example.com",
  nickname: "음악사랑",
  role: "artist",
  points: 3500,
  artistName: "하늘",
  artistLink: "https://youtube.com/@sky-music",
}

export interface MyFeedback {
  id: string
  trackTitle: string
  artist: string
  status: "pending" | "approved" | "rejected"
  submittedAt: string
  reward: number
}

export const myFeedbacks: MyFeedback[] = [
  {
    id: "f1",
    trackTitle: "새벽 세시의 고백",
    artist: "이수진",
    status: "approved",
    submittedAt: "2026-01-20",
    reward: 1000,
  },
  {
    id: "f2",
    trackTitle: "서울의 밤",
    artist: "박현우",
    status: "pending",
    submittedAt: "2026-02-05",
    reward: 1000,
  },
  {
    id: "f3",
    trackTitle: "우리의 계절",
    artist: "김도현",
    status: "rejected",
    submittedAt: "2026-01-30",
    reward: 1000,
  },
]

export interface MyPromotion {
  id: string
  trackTitle: string
  status: "waiting" | "in-progress" | "review" | "complete"
  applicants: number
  maxApplicants: number
  createdAt: string
}

export const myPromotions: MyPromotion[] = [
  {
    id: "p1",
    trackTitle: "여름 끝에서",
    status: "complete",
    applicants: 3,
    maxApplicants: 3,
    createdAt: "2026-01-10",
  },
  {
    id: "p2",
    trackTitle: "새로운 시작",
    status: "in-progress",
    applicants: 2,
    maxApplicants: 5,
    createdAt: "2026-02-01",
  },
]

export interface MyStorePromo {
  id: string
  trackTitle: string
  storeName: string
  plan: string
  startDate: string
  endDate: string
  status: "active" | "ended"
}

export const myStorePromos: MyStorePromo[] = [
  {
    id: "sp1",
    trackTitle: "여름 끝에서",
    storeName: "카페 봄날",
    plan: "플랜 A (1개월)",
    startDate: "2026-01-15",
    endDate: "2026-02-15",
    status: "active",
  },
]

// ─── Comments ─────────────────────────────────────────────────────────────────
export interface Comment {
  id: string
  author: string
  content: string
  date: string
}

export const mockComments: Comment[] = [
  {
    id: "c1",
    author: "음악좋아",
    content:
      "정말 좋은 인터뷰네요! 하늘 님의 음악을 좋아하는데 이런 이야기를 들을 수 있어서 좋았어요.",
    date: "2026-02-02",
  },
  {
    id: "c2",
    author: "인디팬",
    content: "새 앨범 기대됩니다. 응원합니다!",
    date: "2026-02-03",
  },
  {
    id: "c3",
    author: "뮤직러버",
    content: "홍대 라이브 때 직접 본 적 있는데 정말 감동이었어요.",
    date: "2026-02-05",
  },
]
