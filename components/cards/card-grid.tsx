"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useAuth } from "@/lib/context/auth-context"
import { useToast } from "@/hooks/use-toast"

export function CardGrid({ cards }) {
  const { isAuthenticated, token } = useAuth()
  const { toast } = useToast()
  const [favorites, setFavorites] = useState({})

  const getAttributeColor = (attribute) => {
    const colors = {
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

  const toggleFavorite = async (e, cardId) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      toast({
        title: "請先登入",
        description: "您需要登入才能收藏卡牌",
        variant: "default",
      })
      return
    }

    try {
      const isFavorite = favorites[cardId]
      const action = isFavorite ? "unfavorite" : "favorite"

      const response = await fetch(`/api/cards/${cardId}/favorite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      })

      if (!response.ok) {
        throw new Error("操作失敗")
      }

      setFavorites({
        ...favorites,
        [cardId]: !isFavorite,
      })

      toast({
        title: isFavorite ? "已取消收藏" : "已加入收藏",
        description: isFavorite ? "卡牌已從收藏中移除" : "卡牌已加入您的收藏",
        variant: "default",
      })
    } catch (error) {
      console.error("收藏操作錯誤:", error)
      toast({
        title: "操作失敗",
        description: "無法完成收藏操作，請稍後再試",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {cards.length === 0 ? (
        <div className="col-span-full flex h-40 items-center justify-center rounded-md border border-dashed">
          <p className="text-center text-muted-foreground">沒有找到符合條件的卡牌</p>
        </div>
      ) : (
        cards.map((card) => (
          <Link key={card._id} href={`/cards/${card._id}`}>
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <div className="relative aspect-[2/3] w-full overflow-hidden">
                <Image
                  src={card.imageUrl || "/placeholder.svg?height=300&width=215"}
                  alt={card.name}
                  fill
                  className="object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                  onClick={(e) => toggleFavorite(e, card._id)}
                >
                  <Heart className={`h-4 w-4 ${favorites[card._id] ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
              </div>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{card.name}</h3>
                  <Badge variant={getAttributeColor(card.attribute)}>{card.attribute}</Badge>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between p-3 pt-0 text-xs text-muted-foreground">
                <span>{card.series}</span>
                <span>{card.cardNumber}</span>
              </CardFooter>
            </Card>
          </Link>
        ))
      )}
    </div>
  )
}

