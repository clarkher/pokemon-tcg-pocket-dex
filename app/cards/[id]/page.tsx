"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, Heart, Share2 } from "lucide-react"
import { PokemonLogo } from "@/components/pokemon-logo"
import { useAuth } from "@/lib/context/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export default function CardDetailPage({ params }) {
  const [card, setCard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const { isAuthenticated, token } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchCardDetails()
    if (isAuthenticated) {
      checkIfFavorite()
    }
  }, [params.id, isAuthenticated])

  const fetchCardDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/cards/${params.id}`)

      if (!response.ok) {
        throw new Error("獲取卡牌詳情失敗")
      }

      const data = await response.json()
      setCard(data)
    } catch (error) {
      console.error("獲取卡牌詳情錯誤:", error)
      toast({
        title: "錯誤",
        description: "獲取卡牌詳情失敗",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const checkIfFavorite = async () => {
    try {
      const response = await fetch(`/api/users/me/favorite-cards/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setIsFavorite(data.isFavorite)
      }
    } catch (error) {
      console.error("檢查收藏狀態錯誤:", error)
    }
  }

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      toast({
        title: "請先登入",
        description: "您需要登入才能收藏卡牌",
        variant: "default",
      })
      return
    }

    try {
      const action = isFavorite ? "unfavorite" : "favorite"

      const response = await fetch(`/api/cards/${params.id}/favorite`, {
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

      setIsFavorite(!isFavorite)

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

  const shareCard = () => {
    if (navigator.share) {
      navigator.share({
        title: card?.name,
        text: `查看寶可夢卡牌：${card?.name}`,
        url: window.location.href,
      })
    } else {
      // 複製連結到剪貼簿
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "連結已複製",
        description: "卡牌連結已複製到剪貼簿",
        variant: "default",
      })
    }
  }

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

  const getEnergyCost = (cost) => {
    return cost.map((energy, index) => (
      <Badge key={index} variant={getAttributeColor(energy)} className="mr-1">
        {energy}
      </Badge>
    ))
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <PokemonLogo className="h-8 w-8" />
              <span className="text-xl font-bold">寶可夢集換式卡牌資料庫</span>
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/cards" className="font-bold">
              卡牌
            </Link>
            <Link href="/decks">牌組</Link>
            <Link href="/events">活動</Link>
            <Link href="/about">關於</Link>
            <Link href="/admin">
              <Button variant="outline">管理後台</Button>
            </Link>
            <Link href="/login">
              <Button>登入</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          <div className="mb-6 flex items-center gap-2">
            <Link href="/cards">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">卡牌詳情</h1>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex justify-center">
                <Skeleton className="aspect-[2/3] w-full max-w-[350px] rounded-lg" />
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-8 w-[200px]" />
                  <Skeleton className="h-6 w-[80px]" />
                </div>
                <Skeleton className="h-[200px] w-full rounded-lg" />
                <Skeleton className="h-[150px] w-full rounded-lg" />
                <Skeleton className="h-[100px] w-full rounded-lg" />
              </div>
            </div>
          ) : card ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex justify-center">
                <div className="relative aspect-[2/3] w-full max-w-[350px] overflow-hidden rounded-lg">
                  <Image
                    src={card.imageUrl || "/placeholder.svg?height=400&width=286"}
                    alt={card.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{card.name}</h2>
                    <p className="text-muted-foreground">{card.nameEn}</p>
                  </div>
                  <Badge variant={getAttributeColor(card.attribute)} className="text-lg">
                    {card.attribute}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="gap-2" onClick={toggleFavorite}>
                    <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                    {isFavorite ? "已收藏" : "收藏"}
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={shareCard}>
                    <Share2 className="h-4 w-4" />
                    分享
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">HP</p>
                        <p className="font-medium">{card.hp}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">類型</p>
                        <p className="font-medium">{card.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">稀有度</p>
                        <p className="font-medium">{card.rarity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">系列</p>
                        <p className="font-medium">{card.series}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">擴充包</p>
                        <p className="font-medium">{card.expansion}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">卡牌編號</p>
                        <p className="font-medium">{card.cardNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">發行日期</p>
                        <p className="font-medium">{new Date(card.releaseDate).toLocaleDateString()}</p>
                      </div>
                      {card.retreatCost !== undefined && (
                        <div>
                          <p className="text-sm text-muted-foreground">撤退消耗</p>
                          <p className="font-medium">{card.retreatCost} 能量</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {card.attacks && card.attacks.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">招式</h3>
                    {card.attacks.map((attack, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{attack.name}</h4>
                            <div className="flex items-center">{getEnergyCost(attack.cost)}</div>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <p className="text-sm">{attack.description}</p>
                            <p className="font-bold">{attack.damage}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {card.weaknesses && card.weaknesses.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">弱點</h3>
                    {card.weaknesses.map((weakness, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant={getAttributeColor(weakness.type)}>{weakness.type}</Badge>
                        <span>{weakness.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
              <p className="text-center text-muted-foreground">找不到卡牌</p>
            </div>
          )}
        </div>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 寶可夢集換式卡牌資料庫。保留所有權利。
          </p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="text-sm text-muted-foreground">
              關於
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground">
              隱私政策
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground">
              使用條款
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

