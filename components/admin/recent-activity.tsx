"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/context/auth-context"
import { Skeleton } from "@/components/ui/skeleton"

interface RecentUser {
  _id: string
  username: string
  avatar?: string
  createdAt: string
}

interface RecentDeck {
  _id: string
  name: string
  mainEnergy: string[]
  createdAt: string
  createdBy: {
    _id: string
    username: string
  }
}

// 模擬活動數據
const mockActivities = [
  {
    user: {
      name: "小智",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "小智",
    },
    action: "創建了新牌組",
    target: "皮卡丘之力",
    time: "2小時前",
  },
  {
    user: {
      name: "小霞",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "小霞",
    },
    action: "評論了",
    target: "水系策略",
    time: "4小時前",
  },
  {
    user: {
      name: "小剛",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "小剛",
    },
    action: "點讚了",
    target: "岩石堅固牌組",
    time: "5小時前",
  },
  {
    user: {
      name: "小茂",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "小茂",
    },
    action: "添加了新卡牌",
    target: "噴火龍EX",
    time: "1天前",
  },
  {
    user: {
      name: "大木博士",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "大木",
    },
    action: "創建了新活動",
    target: "真新鎮錦標賽",
    time: "2天前",
  },
]

export function RecentActivity() {
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([])
  const [recentDecks, setRecentDecks] = useState<RecentDeck[]>([])
  const [loading, setLoading] = useState(true)
  const [activities, setActivities] = useState<any[]>([])
  const { token } = useAuth()
  const isDevelopment = process.env.NODE_ENV === "development"

  useEffect(() => {
    async function fetchDashboardData() {
      if (!token && !isDevelopment) return

      try {
        // 在開發環境中，如果沒有token，使用模擬數據
        if (isDevelopment && !token) {
          setActivities(mockActivities)
          setLoading(false)
          return
        }

        const response = await fetch("/api/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("獲取儀表板數據失敗")
        }

        const dashboardData = await response.json()
        setRecentUsers(dashboardData.recent.users)
        setRecentDecks(dashboardData.recent.decks)

        // 合併用戶和牌組活動，並按時間排序
        const combinedActivities = [
          ...dashboardData.recent.users.map((user: RecentUser) => ({
            user: {
              name: user.username,
              avatar: user.avatar || "/placeholder.svg?height=32&width=32",
              initials: user.username.slice(0, 2),
            },
            action: "註冊了帳號",
            target: "",
            time: new Date(user.createdAt).toLocaleDateString(),
          })),
          ...dashboardData.recent.decks.map((deck: RecentDeck) => ({
            user: {
              name: deck.createdBy.username,
              avatar: "/placeholder.svg?height=32&width=32",
              initials: deck.createdBy.username.slice(0, 2),
            },
            action: "創建了新牌組",
            target: deck.name,
            time: new Date(deck.createdAt).toLocaleDateString(),
          })),
        ]
          .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
          .slice(0, 5)

        setActivities(combinedActivities)
      } catch (error) {
        console.error("獲取儀表板數據錯誤:", error)
        // 在開發環境中，如果API請求失敗，使用模擬數據
        if (isDevelopment) {
          setActivities(mockActivities)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [token, isDevelopment])

  if (loading) {
    return (
      <div className="space-y-8">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="ml-4 space-y-1">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // 如果沒有活動且在開發環境中，使用模擬數據
  const displayActivities = activities.length > 0 ? activities : isDevelopment ? mockActivities : []

  return (
    <div className="space-y-8">
      {displayActivities.map((activity, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
            <AvatarFallback>{activity.user.initials}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {activity.user.name} <span className="text-muted-foreground">{activity.action}</span>{" "}
              {activity.target && <span className="font-medium">{activity.target}</span>}
            </p>
            <p className="text-sm text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

