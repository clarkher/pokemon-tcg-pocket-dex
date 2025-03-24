"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PokemonLogo } from "@/components/pokemon-logo"
import { User, Mail, MapPin, Calendar, Edit, ThumbsUp, Eye } from "lucide-react"

// 模擬用戶數據
const userData = {
  id: "1",
  username: "小智",
  email: "ash@pokemon.com",
  avatar: "/placeholder.svg?height=128&width=128",
  bio: "熱愛寶可夢卡牌遊戲的訓練家，專注於雷系和火系牌組。希望能與更多訓練家交流學習！",
  location: "真新鎮",
  joinedDate: "2023-01-15",
  favoriteType: "雷",
  decksCount: 12,
  followersCount: 156,
  followingCount: 89,
}

// 模擬牌組數據
const userDecks = [
  {
    id: "1",
    name: "皮卡丘之力",
    description: "以皮卡丘為核心的雷系牌組，搭配多種雷系寶可夢提供強大的攻擊力。",
    mainEnergy: ["雷"],
    likes: 245,
    views: 1024,
    createdAt: "2023-05-15",
  },
  {
    id: "2",
    name: "噴火龍燃燒",
    description: "以噴火龍為核心的火系牌組，擁有極高的爆發力和破壞力。",
    mainEnergy: ["火"],
    likes: 312,
    views: 1542,
    createdAt: "2023-08-05",
  },
  {
    id: "3",
    name: "混合能量",
    description: "結合雷系和火系的混合牌組，靈活多變的戰術選擇。",
    mainEnergy: ["雷", "火"],
    likes: 178,
    views: 876,
    createdAt: "2023-09-20",
  },
]

// 模擬收藏卡牌數據
const favoriteCards = [
  {
    id: "1",
    name: "皮卡丘",
    attribute: "雷",
    rarity: "普通",
    imageUrl: "/placeholder.svg?height=300&width=215",
  },
  {
    id: "2",
    name: "噴火龍",
    attribute: "火",
    rarity: "稀有閃卡",
    imageUrl: "/placeholder.svg?height=300&width=215",
  },
  {
    id: "3",
    name: "超夢",
    attribute: "超能",
    rarity: "稀有閃卡",
    imageUrl: "/placeholder.svg?height=300&width=215",
  },
  {
    id: "4",
    name: "快龍",
    attribute: "無色",
    rarity: "稀有閃卡",
    imageUrl: "/placeholder.svg?height=300&width=215",
  },
]

// 模擬活動歷史
const activityHistory = [
  {
    id: "1",
    type: "deck_created",
    content: "創建了新牌組 「皮卡丘之力」",
    date: "2023-05-15",
  },
  {
    id: "2",
    type: "card_added",
    content: "將「噴火龍EX」加入收藏",
    date: "2023-06-22",
  },
  {
    id: "3",
    type: "event_joined",
    content: "參加了「真新鎮錦標賽」",
    date: "2023-07-10",
  },
  {
    id: "4",
    type: "deck_created",
    content: "創建了新牌組 「噴火龍燃燒」",
    date: "2023-08-05",
  },
  {
    id: "5",
    type: "comment_added",
    content: "評論了「小霞」的牌組 「水系策略」",
    date: "2023-09-18",
  },
]

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    username: userData.username,
    bio: userData.bio,
    location: userData.location,
    email: userData.email,
    favoriteType: userData.favoriteType,
  })

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = () => {
    console.log("保存個人資料:", profileData)
    // 這裡會處理保存個人資料的邏輯
    setIsEditing(false)
  }

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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <div className="md:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={userData.avatar} alt={userData.username} />
                      <AvatarFallback>{userData.username.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1 text-center">
                      <h2 className="text-2xl font-bold">{userData.username}</h2>
                      <Badge variant={getEnergyColor(userData.favoriteType) as any}>
                        {userData.favoriteType}系訓練家
                      </Badge>
                    </div>
                    {!isEditing && (
                      <Button variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        編輯個人資料
                      </Button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="mt-6 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">用戶名</Label>
                        <Input
                          id="username"
                          name="username"
                          value={profileData.username}
                          onChange={handleProfileChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">電子郵件</Label>
                        <Input id="email" name="email" value={profileData.email} onChange={handleProfileChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">個人簡介</Label>
                        <Textarea id="bio" name="bio" value={profileData.bio} onChange={handleProfileChange} rows={4} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">所在地</Label>
                        <Input
                          id="location"
                          name="location"
                          value={profileData.location}
                          onChange={handleProfileChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="favoriteType">喜愛屬性</Label>
                        <Input
                          id="favoriteType"
                          name="favoriteType"
                          value={profileData.favoriteType}
                          onChange={handleProfileChange}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1" onClick={() => setIsEditing(false)}>
                          取消
                        </Button>
                        <Button className="flex-1" onClick={handleSaveProfile}>
                          保存
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 space-y-4">
                      <div className="flex items-start gap-2">
                        <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">個人簡介</p>
                          <p className="text-sm">{userData.bio}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">電子郵件</p>
                          <p className="text-sm">{userData.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">所在地</p>
                          <p className="text-sm">{userData.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">加入日期</p>
                          <p className="text-sm">{userData.joinedDate}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 grid grid-cols-3 gap-2 rounded-md border p-2">
                    <div className="text-center">
                      <p className="text-xl font-bold">{userData.decksCount}</p>
                      <p className="text-xs text-muted-foreground">牌組</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold">{userData.followersCount}</p>
                      <p className="text-xs text-muted-foreground">粉絲</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold">{userData.followingCount}</p>
                      <p className="text-xs text-muted-foreground">關注</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-3">
              <Tabs defaultValue="decks" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="decks">我的牌組</TabsTrigger>
                  <TabsTrigger value="cards">收藏卡牌</TabsTrigger>
                  <TabsTrigger value="activity">活動歷史</TabsTrigger>
                </TabsList>
                <TabsContent value="decks" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">我的牌組 ({userDecks.length})</h2>
                    <Link href="/decks/new">
                      <Button>創建新牌組</Button>
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {userDecks.map((deck) => (
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
                </TabsContent>
                <TabsContent value="cards" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">收藏卡牌 ({favoriteCards.length})</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {favoriteCards.map((card) => (
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
                              <Badge variant={getEnergyColor(card.attribute) as any}>{card.attribute}</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="activity" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">活動歷史</h2>
                  </div>

                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-8">
                        {activityHistory.map((activity) => (
                          <div key={activity.id} className="flex items-start gap-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                              <Calendar className="h-4 w-4 text-primary" />
                            </div>
                            <div className="space-y-1">
                              <p>{activity.content}</p>
                              <p className="text-sm text-muted-foreground">{activity.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
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

