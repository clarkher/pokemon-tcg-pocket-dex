"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ThumbsUp, Eye, Calendar } from "lucide-react"

// 牌組模擬數據
const decks = [
  {
    id: "1",
    name: "皮卡丘之力",
    creator: "小智",
    description: "以皮卡丘為核心的雷系牌組，搭配多種雷系寶可夢提供強大的攻擊力。",
    mainEnergy: ["雷"],
    likes: 245,
    views: 1024,
    createdAt: "2023-05-15",
  },
  {
    id: "2",
    name: "水系策略",
    creator: "小霞",
    description: "利用水系寶可夢的特性，控制場上節奏並逐步累積優勢的牌組。",
    mainEnergy: ["水"],
    likes: 189,
    views: 876,
    createdAt: "2023-06-22",
  },
  {
    id: "3",
    name: "岩石堅固牌組",
    creator: "小剛",
    description: "以格鬥系寶可夢為主，擁有高耐久性和穩定輸出的平衡型牌組。",
    mainEnergy: ["格鬥"],
    likes: 156,
    views: 723,
    createdAt: "2023-07-10",
  },
  {
    id: "4",
    name: "噴火龍燃燒",
    creator: "小茂",
    description: "以噴火龍為核心的火系牌組，擁有極高的爆發力和破壞力。",
    mainEnergy: ["火"],
    likes: 312,
    views: 1542,
    createdAt: "2023-08-05",
  },
  {
    id: "5",
    name: "超能控制",
    creator: "娜姿",
    description: "利用超能系寶可夢的特殊能力，控制對手行動並逐步取得優勢。",
    mainEnergy: ["超能"],
    likes: 98,
    views: 432,
    createdAt: "2023-09-18",
  },
  {
    id: "6",
    name: "草系成長",
    creator: "小菊兒",
    description: "以草系寶可夢為主，通過能量加速和進化路線快速成長的牌組。",
    mainEnergy: ["草"],
    likes: 87,
    views: 356,
    createdAt: "2023-10-03",
  },
]

export function DeckGrid() {
  const getEnergyColor = (energy: string) => {
    const colors: Record<string, string> = {
      雷: "yellow",
      火: "destructive",
      水: "blue",
      草: "green",
      超能: "purple",
      格鬥: "orange",
      惡: "default",
      鋼: "secondary",
      無色: "default",
    }
    return colors[energy] || "default"
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {decks.map((deck) => (
        <Link key={deck.id} href={`/decks/${deck.id}`}>
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{deck.name}</span>
                <div className="flex space-x-1">
                  {deck.mainEnergy.map((energy, index) => (
                    <Badge key={index} variant={getEnergyColor(energy) as any}>
                      {energy}
                    </Badge>
                  ))}
                </div>
              </CardTitle>
              <div className="text-sm text-muted-foreground">作者: {deck.creator}</div>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3 text-sm">{deck.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{deck.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{deck.views}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{deck.createdAt}</span>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}

