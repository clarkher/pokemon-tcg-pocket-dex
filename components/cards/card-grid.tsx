"use client"

import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

// 卡牌模擬數據
const cards = [
  {
    id: "1",
    name: "皮卡丘",
    nameEn: "Pikachu",
    attribute: "雷",
    rarity: "普通",
    series: "基本系列",
    expansion: "基本",
    cardNumber: "58/102",
    imageUrl: "/placeholder.svg?height=300&width=215",
  },
  {
    id: "2",
    name: "噴火龍",
    nameEn: "Charizard",
    attribute: "火",
    rarity: "稀有閃卡",
    series: "基本系列",
    expansion: "基本",
    cardNumber: "4/102",
    imageUrl: "/placeholder.svg?height=300&width=215",
  },
  {
    id: "3",
    name: "水箭龜",
    nameEn: "Blastoise",
    attribute: "水",
    rarity: "稀有閃卡",
    series: "基本系列",
    expansion: "基本",
    cardNumber: "2/102",
    imageUrl: "/placeholder.svg?height=300&width=215",
  },
  {
    id: "4",
    name: "妙蛙花",
    nameEn: "Venusaur",
    attribute: "草",
    rarity: "稀有閃卡",
    series: "基本系列",
    expansion: "基本",
    cardNumber: "15/102",
    imageUrl: "/placeholder.svg?height=300&width=215",
  },
  {
    id: "5",
    name: "超夢",
    nameEn: "Mewtwo",
    attribute: "超能",
    rarity: "稀有閃卡",
    series: "基本系列",
    expansion: "基本",
    cardNumber: "10/102",
    imageUrl: "/placeholder.svg?height=300&width=215",
  },
  {
    id: "6",
    name: "快龍",
    nameEn: "Dragonite",
    attribute: "無色",
    rarity: "稀有閃卡",
    series: "化石",
    expansion: "化石",
    cardNumber: "4/62",
    imageUrl: "/placeholder.svg?height=300&width=215",
  },
  {
    id: "7",
    name: "暴鯉龍",
    nameEn: "Gyarados",
    attribute: "水",
    rarity: "稀有閃卡",
    series: "基本系列",
    expansion: "基本",
    cardNumber: "6/102",
    imageUrl: "/placeholder.svg?height=300&width=215",
  },
  {
    id: "8",
    name: "三頭地鼠",
    nameEn: "Dugtrio",
    attribute: "格鬥",
    rarity: "稀有",
    series: "基本系列",
    expansion: "基本",
    cardNumber: "19/102",
    imageUrl: "/placeholder.svg?height=300&width=215",
  },
  {
    id: "9",
    name: "耿鬼",
    nameEn: "Gengar",
    attribute: "超能",
    rarity: "稀有閃卡",
    series: "化石",
    expansion: "化石",
    cardNumber: "5/62",
    imageUrl: "/placeholder.svg?height=300&width=215",
  },
]

export function CardGrid() {
  const getAttributeColor = (attribute: string) => {
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
    return colors[attribute] || "default"
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {cards.map((card) => (
        <Link key={card.id} href={`/cards/${card.id}`}>
          <Card className="overflow-hidden transition-all hover:shadow-md">
            <div className="relative aspect-[2/3] w-full overflow-hidden">
              <Image src={card.imageUrl || "/placeholder.svg"} alt={card.name} fill className="object-cover" />
            </div>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{card.name}</h3>
                <Badge variant={getAttributeColor(card.attribute) as any}>{card.attribute}</Badge>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between p-3 pt-0 text-xs text-muted-foreground">
              <span>{card.series}</span>
              <span>{card.cardNumber}</span>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}

