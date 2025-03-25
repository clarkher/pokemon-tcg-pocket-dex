"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PokemonLogo } from "@/components/pokemon-logo"
import { ChevronLeft, ThumbsUp, Eye, MessageSquare, Share2, Download } from "lucide-react"

// 模擬牌組詳細數據
const deckDetails = {
  _id: "1",
  name: "皮卡丘之力",
  description:
    "以皮卡丘為核心的雷系牌組，搭配多種雷系寶可夢提供強大的攻擊力。這個牌組專注於快速進化和高爆發傷害，適合喜歡積極進攻的玩家。牌組中包含多張能量加速卡牌，可以快速為寶可夢提供能量支持。",
  isPublic: true,
  mainEnergy: ["雷"],
  cards: [
    {
      cardId: "1",
      count: 4,
      card: {
        _id: "1",
        name: "皮卡丘",
        attribute: "雷",
        type: "基本",
        imageUrl: "/placeholder.svg?height=300&width=215",
      },
    },
    {
      cardId: "6",
      count: 3,
      card: {
        _id: "6",
        name: "雷丘",
        attribute: "雷",
        type: "第一階段",
        imageUrl: "/placeholder.svg?height=300&width=215",
      },
    },
    {
      cardId: "9",
      count: 2,
      card: {
        _id: "9",
        name: "頑皮雷彈",
        attribute: "雷",
        type: "基本",
        imageUrl: "/placeholder.svg?height=300&width=215",
      },
    },
    {
      cardId: "10",
      count: 2,
      card: {
        _id: "10",
        name: "電擊獸",
        attribute: "雷",
        type: "基本",
        imageUrl: "/placeholder.svg?height=300&width=215",
      },
    },
    {
      cardId: "11",
      count: 2,
      card: {
        _id: "11",
        name: "雷電球",
        attribute: "雷",
        type: "基本",
        imageUrl: "/placeholder.svg?height=300&width=215",
      },
    },
    {
      cardId: "12",
      count: 2,
      card: {
        _id: "12",
        name: "電龍",
        attribute: "雷",
        type: "基本",
        imageUrl: "/placeholder.svg?height=300&width=215",
      },
    },
    {
      cardId: "13",
      count: 2,
      card: {
        _id: "13",
        name: "電擊魔獸",
        attribute: "雷",
        type: "第一階段",
        imageUrl: "/placeholder.svg?height=300&width=215",
      },
    },
    {
      cardId: "14",
      count: 3,
      card: {
        _id: "14",
        name: "能量回收",
        attribute: "無色",
        type: "道具",
        imageUrl: "/placeholder.svg?height=300&width=215",
      },
    },
    {
      cardId: "15",
      count: 3,
      card: {
        _id: "15",
        name: "寶可夢通訊",
        attribute: "無色",
        type: "道具",
        imageUrl: "/placeholder.svg?height=300&width=215",
      },
    },
    {
      cardId: "16",
      count: 2,
      card: {
        _id: "16",
        name: "超級球",
        attribute: "無色",
        type: "道具",
        imageUrl: "/placeholder.svg?height=300&width=215",
      },
    },
    {
      cardId: "17",
      count: 2,
      card: {
        _id: "17",
        name: "博士的研究",
        attribute: "無色",
        type: "支援者",
        imageUrl: "/placeholder.svg?height=300&width=215",
      },
    },
    {
      cardId: "18",
      count: 3,
      card: {
        _id: "18",
        name: "小剛",
        attribute: "無色",
        type: "支援者",
        imageUrl: "/placeholder.svg?height=300&width=215",
      },
    },
  ],
  energy: [
    { type: "electric", count: 25 },
    { type: "colorless", count: 5 },
  ],
  likes: 245,
  views: 1024,
  createdAt: "2023-05-15",
  updatedAt: "2023-05-15",
  createdBy: "user_123",
  creator: {
    _id: "user_123",
    username: "小智",
    avatar: "/placeholder.svg?height=128&width=128",
  },
  tags: ["競技", "初學者友好"],
}

// 模擬評論數據
const comments = [
  {
    _id: "comment_1",
    content: "這個牌組非常適合初學者，我用它贏了好幾場比賽！",
    createdAt: "2023-06-01",
    user: {
      _id: "user_456",
      username: "小霞",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    likes: 12,
  },
  {
    _id: "comment_2",
    content: "我覺得可以考慮加入更多的能量加速卡牌，這樣可以更快地為雷丘提供能量。",
    createdAt: "2023-06-05",
    user: {
      _id: "user_789",
      username: "小剛",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    likes: 8,
  },
  {
    _id: "comment_3",
    content: "我用這個牌組參加了真新鎮錦標賽，表現不錯！感謝分享。",
    createdAt: "2023-06-10",
    user: {
      _id: "user_101",
      username: "小茂",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    likes: 5,
  },
]

// 模擬相似牌組數據
const similarDecks = [
  {
    _id: "2",
    name: "雷電進化",
    creator: "小剛",
    mainEnergy: ["雷"],
    likes: 189,
    views: 876,
  },
  {
    _id: "3",
    name: "雷系控制",
    creator: "小霞",
    mainEnergy: ["雷", "超能"],
    likes: 156,
    views: 723,
  },
  {
    _id: "4",
    name: "皮卡丘與朋友們",
    creator: "小茂",
    mainEnergy: ["雷", "無色"],
    likes: 312,
    views: 1542,
  },
]

export default function DeckDetailPage({ params }: { params: { id: string } }) {
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(deckDetails.likes)
  const [commentText, setCommentText] = useState("")

  const handleLike = () => {
    if (liked) {
      setLikesCount(likesCount - 1)
    } else {
      setLikesCount(likesCount + 1)
    }
    setLiked(!liked)

    // 這裡會發送API請求更新點讚狀態
    // fetch(`/api/decks/${params.id}/like`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ action: liked ? 'unlike' : 'like' })
    // })
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (commentText.trim() === "") return

    // 這裡會發送API請求添加評論
    // fetch(`/api/decks/${params.id}/comments`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ content: commentText })
    // })

    console.log("提交評論:", commentText)
    setCommentText("")
  }

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

  const getCardTypeCount = () => {
    const typeCounts: Record<string, number> = {}
    deckDetails.cards.forEach((card) => {
      if (typeCounts[card.card.type]) {
        typeCounts[card.card.type] += card.count
      } else {
        typeCounts[card.card.type] = card.count
      }
    })
    return typeCounts
  }

  const getAttributeCount = () => {
    const attributeCounts: Record<string, number> = {}
    deckDetails.cards.forEach((card) => {
      if (attributeCounts[card.card.attribute]) {
        attributeCounts[card.card.attribute] += card.count
      } else {
        attributeCounts[card.card.attribute] = card.count
      }
    })
    return attributeCounts
  }

  const cardTypeCounts = getCardTypeCount()
  const attributeCounts = getAttributeCount()

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
            <Link href="/decks" className="font-bold">
              牌組
            </Link>
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
            <Link href="/decks">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">牌組詳情</h1>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle className="text-2xl">{deckDetails.name}</CardTitle>
                      <div className="mt-1 flex items-center gap-2">
                        <Link href={`/profile/${deckDetails.creator._id}`} className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={deckDetails.creator.avatar} alt={deckDetails.creator.username} />
                            <AvatarFallback>{deckDetails.creator.username.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">{deckDetails.creator.username}</span>
                        </Link>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{deckDetails.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {deckDetails.mainEnergy.map((energy, index) => (
                        <Badge key={index} variant={getAttributeColor(energy) as any} className="px-3 py-1">
                          {energy}
                        </Badge>
                      ))}
                      {deckDetails.tags?.map((tag, index) => (
                        <Badge key={index} variant="outline" className="px-3 py-1">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{deckDetails.description}</p>

                  <div className="mt-6 flex flex-wrap gap-4">
                    <Button variant={liked ? "default" : "outline"} size="sm" onClick={handleLike} className="gap-2">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{likesCount}</span>
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="h-4 w-4" />
                      <span>{deckDetails.views}</span>
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>{comments.length}</span>
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Share2 className="h-4 w-4" />
                      <span>分享</span>
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      <span>匯出</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6">
                <Tabs defaultValue="cards" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="cards">卡牌列表</TabsTrigger>
                    <TabsTrigger value="stats">牌組統計</TabsTrigger>
                    <TabsTrigger value="comments">評論 ({comments.length})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="cards" className="space-y-4">
                    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                      {deckDetails.cards.map((cardItem, index) => (
                        <Link key={index} href={`/cards/${cardItem.card._id}`}>
                          <Card className="overflow-hidden transition-all hover:shadow-md">
                            <div className="relative aspect-[2/3] w-full overflow-hidden">
                              <Image
                                src={cardItem.card.imageUrl || "/placeholder.svg"}
                                alt={cardItem.card.name}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute right-2 top-2 rounded-full bg-background px-2 py-1 text-xs font-bold">
                                ×{cardItem.count}
                              </div>
                            </div>
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold">{cardItem.card.name}</h3>
                                <Badge variant={getAttributeColor(cardItem.card.attribute) as any} className="text-xs">
                                  {cardItem.card.attribute}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">{cardItem.card.type}</p>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>

                    <div className="mt-4">
                      <h3 className="mb-2 text-lg font-semibold">能量卡</h3>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {deckDetails.energy.map((energy, index) => (
                          <Card key={index} className="overflow-hidden transition-all hover:shadow-md">
                            <div className="flex h-full flex-col items-center justify-center p-4">
                              <Badge
                                variant={getAttributeColor(energy.type === "electric" ? "雷" : "無色") as any}
                                className="mb-2 px-3 py-1 text-lg"
                              >
                                {energy.type === "electric" ? "雷" : "無色"}
                              </Badge>
                              <p className="text-center text-xl font-bold">{energy.count} 張</p>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="stats" className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle>卡牌類型分佈</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {Object.entries(cardTypeCounts).map(([type, count]) => (
                              <div key={type} className="flex items-center justify-between">
                                <span>{type}</span>
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                                    <div
                                      className="h-full bg-primary"
                                      style={{ width: `${(count / 30) * 100}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm">{count}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>屬性分佈</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {Object.entries(attributeCounts).map(([attribute, count]) => (
                              <div key={attribute} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Badge variant={getAttributeColor(attribute) as any}>{attribute}</Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                                    <div
                                      className={`h-full bg-${getAttributeColor(attribute)}`}
                                      style={{ width: `${(count / 30) * 100}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm">{count}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="md:col-span-2">
                        <CardHeader>
                          <CardTitle>牌組組成</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-center">
                            <div className="relative h-64 w-64">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                  <div className="text-2xl font-bold">60</div>
                                  <div className="text-sm text-muted-foreground">總卡牌數</div>
                                </div>
                              </div>
                              {/* 這裡可以添加圓餅圖 */}
                            </div>
                          </div>
                          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-xl font-bold">
                                {deckDetails.cards.reduce((acc, card) => acc + card.count, 0)}
                              </div>
                              <div className="text-sm text-muted-foreground">寶可夢卡牌</div>
                            </div>
                            <div>
                              <div className="text-xl font-bold">
                                {deckDetails.energy.reduce((acc, energy) => acc + energy.count, 0)}
                              </div>
                              <div className="text-sm text-muted-foreground">能量卡</div>
                            </div>
                            <div>
                              <div className="text-xl font-bold">
                                {60 -
                                  deckDetails.cards.reduce((acc, card) => acc + card.count, 0) -
                                  deckDetails.energy.reduce((acc, energy) => acc + energy.count, 0)}
                              </div>
                              <div className="text-sm text-muted-foreground">道具/支援者</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="comments" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>發表評論</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleSubmitComment}>
                          <div className="space-y-4">
                            <textarea
                              className="w-full rounded-md border border-input bg-background px-3 py-2"
                              rows={3}
                              placeholder="分享您對這個牌組的看法..."
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                            ></textarea>
                            <Button type="submit" disabled={commentText.trim() === ""}>
                              發表評論
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>

                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <Card key={comment._id}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={comment.user.avatar} alt={comment.user.username} />
                                <AvatarFallback>{comment.user.username.slice(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold">{comment.user.username}</span>
                                    <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
                                  </div>
                                  <Button variant="ghost" size="sm" className="h-8 gap-1">
                                    <ThumbsUp className="h-4 w-4" />
                                    <span>{comment.likes}</span>
                                  </Button>
                                </div>
                                <p className="mt-2">{comment.content}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>牌組資訊</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">創建日期</span>
                    <span className="font-medium">{deckDetails.createdAt}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">更新日期</span>
                    <span className="font-medium">{deckDetails.updatedAt}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">總卡牌數</span>
                    <span className="font-medium">60</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">寶可夢卡牌</span>
                    <span className="font-medium">{deckDetails.cards.reduce((acc, card) => acc + card.count, 0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">能量卡</span>
                    <span className="font-medium">
                      {deckDetails.energy.reduce((acc, energy) => acc + energy.count, 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">道具/支援者</span>
                    <span className="font-medium">
                      {60 -
                        deckDetails.cards.reduce((acc, card) => acc + card.count, 0) -
                        deckDetails.energy.reduce((acc, energy) => acc + energy.count, 0)}
                    </span>
                  </div>

                  <div className="pt-4">
                    <Link href={`/decks/new?clone=${params.id}`}>
                      <Button className="w-full">複製牌組</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>相似牌組</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {similarDecks.map((deck) => (
                    <Link key={deck._id} href={`/decks/${deck._id}`}>
                      <div className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-muted">
                        <div className="flex flex-col">
                          <span className="font-medium">{deck.name}</span>
                          <span className="text-xs text-muted-foreground">by {deck.creator}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {deck.mainEnergy.map((energy, index) => (
                            <Badge key={index} variant={getAttributeColor(energy) as any} className="text-xs">
                              {energy}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
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

