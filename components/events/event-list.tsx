"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin } from "lucide-react"

// 活動模擬數據
const events = [
  {
    id: "1",
    title: "真新鎮錦標賽",
    type: "特級護照",
    startDate: "2023-10-15",
    endDate: "2023-10-20",
    status: "進行中",
    location: "真新鎮寶可夢中心",
    organizer: "寶可夢聯盟",
    description: "一年一度的真新鎮錦標賽，歡迎所有訓練家參加。優勝者將獲得限定卡牌和獎品。",
  },
  {
    id: "2",
    title: "華藍市水系挑戰",
    type: "任務",
    startDate: "2023-11-05",
    endDate: "2023-11-10",
    status: "即將開始",
    location: "華藍道館",
    organizer: "小霞",
    description: "專為水系寶可夢愛好者設計的特別挑戰，完成任務可獲得稀有水系卡牌。",
  },
  {
    id: "3",
    title: "尼比市岩石系展示會",
    type: "得卡挑戰",
    startDate: "2023-09-20",
    endDate: "2023-09-25",
    status: "已結束",
    location: "尼比道館",
    organizer: "小剛",
    description: "展示您最強大的岩石系牌組，並有機會獲得限定版小剛簽名卡牌。",
  },
  {
    id: "4",
    title: "常磐森林探險",
    type: "單人對戰",
    startDate: "2023-12-01",
    endDate: "2023-12-15",
    status: "即將開始",
    location: "常磐森林",
    organizer: "寶可夢巡護員",
    description: "在常磐森林中進行一系列單人對戰挑戰，探索森林並收集稀有卡牌。",
  },
  {
    id: "5",
    title: "石英高原冠軍賽",
    type: "特級護照",
    startDate: "2024-01-10",
    endDate: "2024-01-20",
    status: "即將開始",
    location: "石英高原",
    organizer: "四天王",
    description: "年度最盛大的比賽，挑戰四天王並有機會成為新的寶可夢卡牌冠軍。",
  },
]

export function EventList() {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      進行中: "green",
      即將開始: "blue",
      已結束: "secondary",
    }
    return colors[status] || "default"
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      特級護照: "purple",
      任務: "yellow",
      得卡挑戰: "orange",
      單人對戰: "destructive",
      錦標賽: "blue",
    }
    return colors[type] || "default"
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {events.map((event) => (
        <Link key={event.id} href={`/events/${event.id}`}>
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant={getStatusColor(event.status) as any}>{event.status}</Badge>
                <Badge variant={getTypeColor(event.type) as any}>{event.type}</Badge>
              </div>
              <CardTitle>{event.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-2 text-sm">{event.description}</p>
              <div className="mt-4 flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {event.startDate} 至 {event.endDate}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-muted-foreground">主辦方: {event.organizer}</div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}

