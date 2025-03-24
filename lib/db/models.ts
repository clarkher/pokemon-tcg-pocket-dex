// 數據庫模型定義

// 用戶模型
export interface User {
  _id: string
  username: string
  email: string
  password: string // 存儲加密後的密碼
  avatar?: string
  bio?: string
  location?: string
  favoriteType?: string
  isAdmin: boolean
  googleId?: string
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
  status: "active" | "inactive" | "banned"
  followers: string[] // 用戶ID數組
  following: string[] // 用戶ID數組
}

// 卡牌模型
export interface Card {
  _id: string
  name: string
  nameEn: string
  attribute: string
  rarity: string
  series: string
  expansion: string
  hp?: number
  type: string
  cardNumber: string
  releaseDate: Date
  imageUrl?: string
  attacks?: {
    name: string
    cost: string[]
    damage: string
    description: string
  }[]
  weaknesses?: {
    type: string
    value: string
  }[]
  retreatCost?: number
  createdAt: Date
  updatedAt: Date
  createdBy: string // 用戶ID
}

// 牌組模型
export interface Deck {
  _id: string
  name: string
  description?: string
  isPublic: boolean
  mainEnergy: string[]
  cards: {
    cardId: string
    count: number
  }[]
  energy: {
    type: string
    count: number
  }[]
  likes: string[] // 用戶ID數組
  views: number
  createdAt: Date
  updatedAt: Date
  createdBy: string // 用戶ID
  tags?: string[]
}

// 活動模型
export interface Event {
  _id: string
  title: string
  type: string
  startDate: Date
  endDate: Date
  status: "upcoming" | "active" | "completed"
  location: string
  organizer: string
  description: string
  imageUrl?: string
  rules?: string[]
  prizes?: string[]
  participants?: string[] // 用戶ID數組
  registrationDeadline?: Date
  registrationFee?: string
  contactPerson?: string
  contactEmail?: string
  createdAt: Date
  updatedAt: Date
  createdBy: string // 用戶ID
}

// 評論模型
export interface Comment {
  _id: string
  content: string
  targetType: "card" | "deck" | "event" | "post"
  targetId: string
  createdAt: Date
  updatedAt: Date
  createdBy: string // 用戶ID
  likes: string[] // 用戶ID數組
  replies?: Comment[]
}

// 論壇帖子模型
export interface Post {
  _id: string
  title: string
  content: string
  category: string
  tags?: string[]
  createdAt: Date
  updatedAt: Date
  createdBy: string // 用戶ID
  likes: string[] // 用戶ID數組
  views: number
  isPinned: boolean
  isLocked: boolean
}

// 通知模型
export interface Notification {
  _id: string
  type: "like" | "comment" | "follow" | "mention" | "system"
  message: string
  isRead: boolean
  targetType?: "card" | "deck" | "event" | "post" | "user"
  targetId?: string
  createdAt: Date
  userId: string // 接收通知的用戶ID
  triggeredBy?: string // 觸發通知的用戶ID
}

