"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/admin/overview"
import { RecentActivity } from "@/components/admin/recent-activity"
import { useAuth } from "@/lib/context/auth-context"
import { Skeleton } from "@/components/ui/skeleton"

interface DashboardCounts {
  users: number
  activeUsers: number
  cards: number
  decks: number
  events: number
  activeEvents: number
  posts: number
}

// 模擬數據
const mockCounts: DashboardCounts = {
  users: 573,
  activeUsers: 201,
  cards: 1254,
  decks: 324,
  events: 12,
  activeEvents: 3,
  posts: 87,
}

export default function AdminDashboard() {
  const [counts, setCounts] = useState<DashboardCounts | null>(null)
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()
  const isDevelopment = process.env.NODE_ENV === "development"

  useEffect(() => {
    async function fetchDashboardData() {
      if (!token && !isDevelopment) return

      try {
        // 在開發環境中，如果沒有token，使用模擬數據
        if (isDevelopment && !token) {
          setCounts(mockCounts)
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
        setCounts(dashboardData.counts)
      } catch (error) {
        console.error("獲取儀表板數據錯誤:", error)
        // 在開發環境中，如果API請求失敗，使用模擬數據
        if (isDevelopment) {
          setCounts(mockCounts)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [token, isDevelopment])

  // 如果在開發環境中且沒有數據，使用模擬數據
  const displayCounts = counts || (isDevelopment ? mockCounts : null)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">管理後台</h1>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">總覽</TabsTrigger>
          <TabsTrigger value="analytics">分析</TabsTrigger>
          <TabsTrigger value="reports">報表</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              <>
                {Array.from({ length: 4 }).map((_, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        <Skeleton className="h-4 w-[100px]" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-[60px]" />
                      <Skeleton className="h-4 w-[120px] mt-1" />
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">卡牌總數</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{displayCounts?.cards || 0}</div>
                    <p className="text-xs text-muted-foreground">較上月增加24張</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">牌組總數</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{displayCounts?.decks || 0}</div>
                    <p className="text-xs text-muted-foreground">較上月增加18個</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">活躍用戶</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{displayCounts?.activeUsers || 0}</div>
                    <p className="text-xs text-muted-foreground">較上月增加201人</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">進行中活動</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{displayCounts?.activeEvents || 0}</div>
                    <p className="text-xs text-muted-foreground">較上月增加3個</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>數據概覽</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>最近活動</CardTitle>
                <CardDescription>平台上的最近用戶活動</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivity />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>分析</CardTitle>
              <CardDescription>查看詳細的平台使用分析和趨勢。</CardDescription>
            </CardHeader>
            <CardContent>
              <p>分析功能正在開發中...</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>報表</CardTitle>
              <CardDescription>生成和下載平台數據報表。</CardDescription>
            </CardHeader>
            <CardContent>
              <p>報表功能正在開發中...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

