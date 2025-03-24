"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PokemonLogo } from "@/components/pokemon-logo"
import { ChevronLeft, ThumbsUp, Eye, MessageSquare, Share2, Download, Loader2, Pencil } from "lucide-react"
import { useAuth } from "@/lib/context/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"

export default function DeckDetailPage({ params }) {
  const router = useRouter()
  const { isAuthenticated, token, user } = useAuth()
  const { toast } = useToast()

  const [deck, setDeck] = useState(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [isLiking, setIsLiking] = useState(false)

  useEffect(() => {
    fetchDeckDetails()
    if (isAuthenticated) {
      checkIfLiked()
    }
    fetchComments()
  }, [params.id, isAuthenticated])

  const fetchDeckDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/decks/${params.id}`)

      if (!response.ok) {
        throw new Error("獲取牌組失敗")
      }

      const data = await response.json()
      setDeck(data)
      setLikesCount(data.likes?.length || 0)
    } catch (error) {
      console.error("獲取牌組錯誤:", error)
      toast({
        title: "錯誤",
        description: "獲取牌組詳情失敗",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const checkIfLiked = async () => {
    try {
      const response = await fetch(`/api/decks/${params.id}/like/check`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setLiked(data.isLiked)
      }
    } catch (error) {
      console.error("檢查點讚狀態錯誤:", error)
    }
  }

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/decks/${params.id}/comments`)

      if (!response.ok) {
        throw new Error("獲取評論失敗")
      }

      const data = await response.json()
      setComments(data.comments)
    } catch (error) {
      console.error("獲取評論錯誤:", error)
    }
  }

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast({
        title: "請先登入",
        description: "您需要登入才能點讚",
        variant: "default",
      })
      return
    }

    try {
      setIsLiking(true)
      const action = liked ? "unlike" : "like"

      const response = await fetch(`/api/decks/${params.id}/like`, {
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

      setLiked(!liked)
      setLikesCount((prev) => (liked ? prev - 1 : prev + 1))
    } catch (error) {
      console.error("點讚操作錯誤:", error)
      toast({
        title: "操作失敗",
        description: "無法完成點讚操作，請稍後再試",
        variant: "destructive",
      })
    } finally {
      setIsLiking(false)
    }
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()

    if (!isAuthenticated) {
      toast({
        title: "請先登入",
        description: "您需要登入才能發表評論",
        variant: "default",
      })
      return
    }

    if (!commentText.trim()) {
      toast({
        title: "評論不能為空",
        description: "請輸入評論內容",
        variant: "default",
      })
      return
    }

    try {
      setIsSubmittingComment(true)

      const response = await fetch(`/api/decks/${params.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: commentText }),
      })

      if (!response.ok) {
        throw new Error("發表評論失敗")
      }

      const data = await response.json()

      // 添加新評論到評論列表
      setComments([data.comment, ...comments])
      setCommentText("")

      toast({
        title: "評論發表成功",
        description: "您的評論已成功發表",
        variant: "default",
      })
    } catch (error) {
      console.error("發表評論錯誤:", error)
      toast({
        title: "錯誤",
        description: "發表評論失敗，請稍後再試",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: deck?.name,
        text: `查看寶可夢卡牌牌組：${deck?.name}`,
        url: window.location.href,
      })
    } else {
      // 複製連結到剪貼簿
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "連結已複製",
        description: "牌組連結已複製到剪貼簿",
        variant: "default",
      })
    }
  }

  const handleExport = () => {
    if (!deck) return

    // 構建牌組數據
    const deckData = {
      name: deck.name,
      description: deck.description,
      mainEnergy: deck.mainEnergy,
      cards: deck.cards.map((card) => ({
        name: card.card.name,
        count: card.count,
        attribute: card.card.attribute,
        type: card.card.type,
      })),
      energy: deck.energy.map((energy) => ({
        type: energy.type,
        count: energy.count,
      })),
      creator: deck.creator.username,
      exportDate: new Date().toISOString(),
    }

    // 轉換為 JSON 字符串
    const jsonString = JSON.stringify(deckData, null, 2)

    // 創建 Blob
    const blob = new Blob([jsonString], { type: "application/json" })

    // 創建下載連結
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${deck.name.replace(/\s+/g, "_")}.json`
    document.body.appendChild(a)
    a.click()

    // 清理
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 0)
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

  const getEnergyTypeLabel = (type) => {
    const labels = {
      grass: "草",
      fire: "火",
      water: "水",
      electric: "雷",
      psychic: "超能",
      fighting: "格鬥",
      dark: "惡",
      steel: "鋼",
      colorless: "無色",
    }
    return labels[type] || type
  }

  const getEnergyTypeColor = (type) => {
    const colors = {
      grass: "green",
      fire: "destructive",
      water: "blue",
      electric: "yellow",
      psychic: "purple",
      fighting: "orange",
      dark: "default",
      steel: "secondary",
      colorless: "default",
    }
    return colors[type] || "default"
  }

  const getCardTypeCount = () => {
    if (!deck) return {}

    const typeCounts = {}
    deck.cards.forEach((card) => {
      if (typeCounts[card.card.type]) {
        typeCounts[card.card.type] += card.count
      } else {
        typeCounts[card.card.type] = card.count
      }
    })
    return typeCounts
  }

  const getAttributeCount = () => {
    if (!deck) return {}

    const attributeCounts = {}
    deck.cards.forEach((card) => {
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

  const canEdit = isAuthenticated && deck?.creator?._id === user?.id

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

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">加載中...</span>
            </div>
          ) : deck ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <CardTitle className="text-2xl">{deck.name}</CardTitle>
                        <div className="mt-1 flex items-center gap-2">
                          <Link href={`/profile/${deck.creator._id}`} className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={deck.creator.avatar} alt={deck.creator.username} />
                              <AvatarFallback>{deck.creator.username.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">{deck.creator.username}</span>
                          </Link>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(deck.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {deck.mainEnergy.map((energy, index) => (
                          <Badge key={index} variant={getEnergyTypeColor(energy)} className="px-3 py-1">
                            {getEnergyTypeLabel(energy)}
                          </Badge>
                        ))}
                        {deck.tags?.map((tag, index) => (
                          <Badge key={index} variant="outline" className="px-3 py-1">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line">{deck.description}</p>

                    <div className="mt-6 flex flex-wrap gap-4">
                      <Button
                        variant={liked ? "default" : "outline"}
                        size="sm"
                        onClick={handleLike}
                        className="gap-2"
                        disabled={isLiking}
                      >
                        {isLiking ? <Loader2 className="h-4 w-4 animate-spin" /> : <ThumbsUp className="h-4 w-4" />}
                        <span>{likesCount}</span>
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="h-4 w-4" />
                        <span>{deck.views}</span>
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <MessageSquare className="h-4 w-4" />
                        <span>{comments.length}</span>
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2" onClick={handleShare}>
                        <Share2 className="h-4 w-4" />
                        <span>分享</span>
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
                        <Download className="h-4 w-4" />
                        <span>匯出</span>
                      </Button>
                      {canEdit && (
                        <Link href={`/decks/${params.id}/edit`}>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Pencil className="h-4 w-4" />
                            <span>編輯</span>
                          </Button>
                        </Link>
                      )}
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
                        {deck.cards.map((cardItem, index) => (
                          <Link key={index} href={`/cards/${cardItem.card._id}`}>
                            <Card className="overflow-hidden transition-all hover:shadow-md">
                              <div className="relative aspect-[2/3] w-full overflow-hidden">
                                <Image
                                  src={cardItem.card.imageUrl || "/placeholder.svg?height=300&width=215"}
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
                                  <Badge variant={getAttributeColor(cardItem.card.attribute)} className="text-xs">
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
                          {deck.energy.map((energy, index) => (
                            <Card key={index} className="overflow-hidden transition-all hover:shadow-md">
                              <div className="flex h-full flex-col items-center justify-center p-4">
                                <Badge variant={getEnergyTypeColor(energy.type)} className="mb-2 px-3 py-1 text-lg">
                                  {getEnergyTypeLabel(energy.type)}
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
                                    <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
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
                                    <Badge variant={getAttributeColor(attribute)}>{attribute}</Badge>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
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
                                  {deck.cards.reduce((acc, card) => acc + card.count, 0)}
                                </div>
                                <div className="text-sm text-muted-foreground">寶可夢卡牌</div>
                              </div>
                              <div>
                                <div className="text-xl font-bold">
                                  {deck.energy.reduce((acc, energy) => acc + energy.count, 0)}
                                </div>
                                <div className="text-sm text-muted-foreground">能量卡</div>
                              </div>
                              <div>
                                <div className="text-xl font-bold">
                                  {60 -
                                    deck.cards.reduce((acc, card) => acc + card.count, 0) -
                                    deck.energy.reduce((acc, energy) => acc + energy.count, 0)}
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
                              <Textarea
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                                rows={3}
                                placeholder="分享您對這個牌組的看法..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                              ></Textarea>
                              <Button type="submit" disabled={isSubmittingComment || !commentText.trim()}>
                                {isSubmittingComment ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    發表中...
                                  </>
                                ) : (
                                  "發表評論"
                                )}
                              </Button>
                            </div>
                          </form>
                        </CardContent>
                      </Card>

                      <div className="space-y-4">
                        {comments.length === 0 ? (
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex h-20 items-center justify-center">
                                <p className="text-center text-muted-foreground">暫無評論，成為第一個評論的人吧！</p>
                              </div>
                            </CardContent>
                          </Card>
                        ) : (
                          comments.map((comment) => (
                            <Card key={comment._id}>
                              <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={comment.user?.avatar} alt={comment.user?.username} />
                                    <AvatarFallback>{comment.user?.username?.slice(0, 2) || "匿名"}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold">{comment.user?.username || "匿名用戶"}</span>
                                        <span className="text-xs text-muted-foreground">
                                          {new Date(comment.createdAt).toLocaleDateString()}
                                        </span>
                                      </div>
                                      <Button variant="ghost" size="sm" className="h-8 gap-1">
                                        <ThumbsUp className="h-4 w-4" />
                                        <span>{comment.likes?.length || 0}</span>
                                      </Button>
                                    </div>
                                    <p className="mt-2">{comment.content}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        )}
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
                      <span className="font-medium">{new Date(deck.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">更新日期</span>
                      <span className="font-medium">{new Date(deck.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">總卡牌數</span>
                      <span className="font-medium">60</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">寶可夢卡牌</span>
                      <span className="font-medium">{deck.cards.reduce((acc, card) => acc + card.count, 0)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">能量卡</span>
                      <span className="font-medium">{deck.energy.reduce((acc, energy) => acc + energy.count, 0)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">道具/支援者</span>
                      <span className="font-medium">
                        {60 -
                          deck.cards.reduce((acc, card) => acc + card.count, 0) -
                          deck.energy.reduce((acc, energy) => acc + energy.count, 0)}
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
                    <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                      <p className="text-center text-muted-foreground">正在尋找相似牌組...</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
              <p className="text-center text-muted-foreground">找不到牌組</p>
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

