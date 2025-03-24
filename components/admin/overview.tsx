"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { useAuth } from "@/lib/context/auth-context"
import { Skeleton } from "@/components/ui/skeleton"

interface MonthlyStats {
  name: string
  cards: number
  decks: number
  users: number
}

// 模擬數據
const mockData = [
  {
    name: "一月",
    cards: 12,
    decks: 8,
    users: 25,
  },
  {
    name: "二月",
    cards: 18,
    decks: 12,
    users: 30,
  },
  {
    name: "三月",
    cards: 24,
    decks: 18,
    users: 42,
  },
  {
    name: "四月",
    cards: 32,
    decks: 24,
    users: 58,
  },
  {
    name: "五月",
    cards: 40,
    decks: 30,
    users: 70,
  },
  {
    name: "六月",
    cards: 48,
    decks: 36,
    users: 85,
  },
]

export function Overview() {
  const [data, setData] = useState<MonthlyStats[]>([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()
  const isDevelopment = process.env.NODE_ENV === "development"

  useEffect(() => {
    async function fetchDashboardData() {
      if (!token && !isDevelopment) return

      try {
        // 在開發環境中，如果沒有token，使用模擬數據
        if (isDevelopment && !token) {
          setData(mockData)
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
        setData(dashboardData.monthlyStats)
      } catch (error) {
        console.error("獲取儀表板數據錯誤:", error)
        // 在開發環境中，如果API請求失敗，使用模擬數據
        if (isDevelopment) {
          setData(mockData)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [token, isDevelopment])

  if (loading) {
    return (
      <div className="w-full h-[350px] flex items-center justify-center">
        <Skeleton className="w-full h-full" />
      </div>
    )
  }

  // 如果沒有數據且在開發環境中，使用模擬數據
  const displayData = data.length > 0 ? data : isDevelopment ? mockData : []

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={displayData}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Bar dataKey="cards" name="卡牌" fill="#adfa1d" radius={[4, 4, 0, 0]} />
        <Bar dataKey="decks" name="牌組" fill="#f97316" radius={[4, 4, 0, 0]} />
        <Bar dataKey="users" name="用戶" fill="#06b6d4" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

