"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { PokemonLogo } from "@/components/pokemon-logo"
import { SearchIcon, ThumbsUp, Eye, Calendar } from "lucide-react"

// 模擬搜尋結果
const searchResults = {
  cards: [
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
      name: "超夢",
      nameEn: "Mewtwo",
      attribute: "超能",
      rarity: "稀有閃卡",
      series: "基本系列",
      expansion: "基本",
      cardNumber: "10/102",
      imageUrl: "/placeholder.svg?height=300&width=215",
    },
  ],
  decks: [
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
      id: "4",
      name: "噴火龍燃燒",
      creator: "小茂",
      description: "以噴火龍為核心的火系牌組，擁有極高的爆發力和破壞力。",
      mainEnergy: ["火"],
      likes: 312,
      views: 1542,
      createdAt: "2023-08-05",
    },
  ],
  events: [
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
  ],
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

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

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      進行中: "green",
      即將開始: "blue",
      已結束: "secondary",
    }
    return colors[status] || "default"
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("搜尋:", searchTerm)
    // 這裡會處理搜尋邏輯
  }

  const totalResults = searchResults.cards.length + searchResults.decks.length + searchResults.events.length

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
            <Link href="/cards">卡牌</Link>
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
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">搜尋</h1>
            <p className="text-muted-foreground">搜尋卡牌、牌組和活動</p>
          </div>

          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="輸入關鍵字搜尋..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit">搜尋</Button>
            </div>
          </form>

          <div className="mb-4">
            <p className="text-sm text-muted-foreground">找到 {totalResults} 個結果</p>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">全部 ({totalResults})</TabsTrigger>
              <TabsTrigger value="cards">卡牌 ({searchResults.cards.length})</TabsTrigger>
              <TabsTrigger value="decks">牌組 ({searchResults.decks.length})</TabsTrigger>
              <TabsTrigger value="events">活動 ({searchResults.events.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {searchResults.cards.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">卡牌</h2>
                    {searchResults.cards.length > 3 && (
                      <Button variant="link" onClick={() => setActiveTab("cards")}>
                        查看全部
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {searchResults.cards.slice(0, 6).map((card) => (
                      <Link key={card.id} href={`/cards/${card.id}`}>
                        <Card className="overflow-hidden transition-all hover:shadow-md">
                          <div className="relative aspect-[2/3] w-full overflow-hidden">
                            <Image
                              src={card.imageUrl || "/placeholder.svg"}
                              alt={card.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold">{card.name}</h3>
                              <Badge variant={getAttributeColor(card.attribute) as any}>{card.attribute}</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.decks.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">牌組</h2>
                    {searchResults.decks.length > 2 && (
                      <Button variant="link" onClick={() => setActiveTab("decks")}>
                        查看全部
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {searchResults.decks.slice(0, 3).map((deck) => (
                      <Link key={deck.id} href={`/decks/${deck.id}`}>
                        <Card className="h-full transition-all hover:shadow-md">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold">{deck.name}</h3>
                              <div className="flex space-x-1">
                                {deck.mainEnergy.map((energy, index) => (
                                  <Badge key={index} variant={getAttributeColor(energy) as any}>
                                    {energy}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <p className="mt-2 line-clamp-2 text-sm">{deck.description}</p>
                            <p className="mt-1 text-xs text-muted-foreground">創建者: {deck.creator}</p>
                          </CardContent>
                          <CardFooter className="flex justify-between p-4 pt-0 text-sm text-muted-foreground">
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
                          </CardFooter>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.events.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">活動</h2>
                    {searchResults.events.length > 2 && (
                      <Button variant="link" onClick={() => setActiveTab("events")}>
                        查看全部
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {searchResults.events.slice(0, 2).map((event) => (
                      <Link key={event.id} href={`/events/${event.id}`}>
                        <Card className="h-full transition-all hover:shadow-md">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <Badge variant={getStatusColor(event.status) as any}>{event.status}</Badge>
                              <Badge variant={getTypeColor(event.type) as any}>{event.type}</Badge>
                            </div>
                            <h3 className="mt-2 text-lg font-semibold">{event.title}</h3>
                            <p className="mt-2 line-clamp-2 text-sm">{event.description}</p>
                            <div className="mt-4 flex flex-col gap-2 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {event.startDate} 至 {event.endDate}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="cards">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {searchResults.cards.map((card) => (
                  <Link key={card.id} href={`/cards/${card.id}`}>
                    <Card className="overflow-hidden transition-all hover:shadow-md">
                      <div className="relative aspect-[2/3] w-full overflow-hidden">
                        <Image
                          src={card.imageUrl || "/placeholder.svg"}
                          alt={card.name}
                          fill
                          className="object-cover"
                        />
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
            </TabsContent>

            <TabsContent value="decks">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {searchResults.decks.map((deck) => (
                  <Link key={deck.id} href={`/decks/${deck.id}`}>
                    <Card className="h-full transition-all hover:shadow-md">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{deck.name}</h3>
                          <div className="flex space-x-1">
                            {deck.mainEnergy.map((energy, index) => (
                              <Badge key={index} variant={getAttributeColor(energy) as any}>
                                {energy}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <p className="mt-2 line-clamp-3 text-sm">{deck.description}</p>
                        <p className="mt-1 text-xs text-muted-foreground">創建者: {deck.creator}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between p-4 pt-0 text-sm text-muted-foreground">
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
            </TabsContent>

            <TabsContent value="events">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {searchResults.events.map((event) => (
                  <Link key={event.id} href={`/events/${event.id}`}>
                    <Card className="h-full transition-all hover:shadow-md">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <Badge variant={getStatusColor(event.status) as any}>{event.status}</Badge>
                          <Badge variant={getTypeColor(event.type) as any}>{event.type}</Badge>
                        </div>
                        <h3 className="mt-2 text-lg font-semibold">{event.title}</h3>
                        <p className="mt-2 line-clamp-3 text-sm">{event.description}</p>
                        <div className="mt-4 flex flex-col gap-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {event.startDate} 至 {event.endDate}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>
          </Tabs>
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

