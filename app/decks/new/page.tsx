"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PokemonLogo } from "@/components/pokemon-logo"
import { ChevronLeft, Search, Plus, X, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/context/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function NewDeckPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const cloneId = searchParams.get("clone")
  const { isAuthenticated, token } = useAuth()
  const { toast } = useToast()

  const [deckInfo, setDeckInfo] = useState({
    name: "",
    description: "",
    isPublic: true,
    mainEnergy: "",
    tags: [],
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [selectedCards, setSelectedCards] = useState([])
  const [energyCount, setEnergyCount] = useState({
    grass: 0,
    fire: 0,
    water: 0,
    electric: 0,
    psychic: 0,
    fighting: 0,
    dark: 0,
    steel: 0,
    colorless: 0,
  })

  const [isSearching, setIsSearching] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // 如果有 cloneId，則獲取牌組數據
  useEffect(() => {
    if (cloneId) {
      fetchDeckToClone()
    }

    // 檢查用戶是否已登入
    if (!isAuthenticated) {
      toast({
        title: "請先登入",
        description: "您需要登入才能創建牌組",
        variant: "default",
      })
      router.push("/login?redirect=/decks/new")
    }
  }, [cloneId, isAuthenticated])

  const fetchDeckToClone = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/decks/${cloneId}`)

      if (!response.ok) {
        throw new Error("獲取牌組失敗")
      }

      const deck = await response.json()

      // 設置牌組信息
      setDeckInfo({
        name: `${deck.name} (複製)`,
        description: deck.description || "",
        isPublic: deck.isPublic,
        mainEnergy: deck.mainEnergy[0] || "",
        tags: deck.tags || [],
      })

      // 設置卡牌
      if (deck.cards && deck.cards.length > 0) {
        const formattedCards = deck.cards.map((cardItem) => ({
          ...cardItem.card,
          count: cardItem.count,
        }))
        setSelectedCards(formattedCards)
      }

      // 設置能量
      if (deck.energy && deck.energy.length > 0) {
        const newEnergyCount = { ...energyCount }
        deck.energy.forEach((energy) => {
          newEnergyCount[energy.type] = energy.count
        })
        setEnergyCount(newEnergyCount)
      }
    } catch (error) {
      console.error("獲取牌組錯誤:", error)
      toast({
        title: "錯誤",
        description: "無法獲取要複製的牌組",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInfoChange = (e) => {
    const { name, value } = e.target
    setDeckInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked) => {
    setDeckInfo((prev) => ({ ...prev, isPublic: checked }))
  }

  const handleSelectChange = (value) => {
    setDeckInfo((prev) => ({ ...prev, mainEnergy: value }))
  }

  const handleTagsChange = (e) => {
    const tagsString = e.target.value
    const tagsArray = tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag)
    setDeckInfo((prev) => ({ ...prev, tags: tagsArray }))
  }

  const handleSearch = async (e) => {
    e.preventDefault()

    if (!searchTerm.trim()) return

    try {
      setIsSearching(true)
      const response = await fetch(`/api/cards?search=${encodeURIComponent(searchTerm)}&limit=12`)

      if (!response.ok) {
        throw new Error("搜尋卡牌失敗")
      }

      const data = await response.json()
      setSearchResults(data.cards)
    } catch (error) {
      console.error("搜尋卡牌錯誤:", error)
      toast({
        title: "錯誤",
        description: "搜尋卡牌失敗",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleAddCard = (card) => {
    // 檢查牌組中該卡牌的數量是否已達到4張
    const existingCard = selectedCards.find((c) => c._id === card._id)

    if (existingCard) {
      if (existingCard.count < 4) {
        setSelectedCards(selectedCards.map((c) => (c._id === card._id ? { ...c, count: c.count + 1 } : c)))
      } else {
        toast({
          title: "已達上限",
          description: "每種卡牌最多只能放入4張!",
          variant: "default",
        })
      }
    } else {
      setSelectedCards([...selectedCards, { ...card, count: 1 }])
    }
  }

  const handleRemoveCard = (cardId) => {
    const existingCard = selectedCards.find((c) => c._id === cardId)

    if (existingCard && existingCard.count > 1) {
      setSelectedCards(selectedCards.map((c) => (c._id === cardId ? { ...c, count: c.count - 1 } : c)))
    } else {
      setSelectedCards(selectedCards.filter((c) => c._id !== cardId))
    }
  }

  const handleAddEnergy = (energyType) => {
    setEnergyCount({
      ...energyCount,
      [energyType]: energyCount[energyType] + 1,
    })
  }

  const handleRemoveEnergy = (energyType) => {
    if (energyCount[energyType] > 0) {
      setEnergyCount({
        ...energyCount,
        [energyType]: energyCount[energyType] - 1,
      })
    }
  }

  const getTotalCardCount = () => {
    const cardsCount = selectedCards.reduce((total, card) => total + card.count, 0)
    const energiesCount = Object.values(energyCount).reduce((a, b) => a + b, 0)
    return cardsCount + energiesCount
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

  const handleSaveDeck = async () => {
    if (deckInfo.name.trim() === "") {
      toast({
        title: "請輸入牌組名稱",
        description: "牌組名稱不能為空",
        variant: "destructive",
      })
      return
    }

    if (getTotalCardCount() !== 60) {
      toast({
        title: "卡牌數量不符",
        description: "牌組必須包含60張卡牌",
        variant: "destructive",
      })
      return
    }

    if (!deckInfo.mainEnergy) {
      toast({
        title: "請選擇主要能量類型",
        description: "請為牌組選擇一個主要能量類型",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // 構建牌組數據
      const deckData = {
        name: deckInfo.name,
        description: deckInfo.description,
        isPublic: deckInfo.isPublic,
        mainEnergy: [deckInfo.mainEnergy],
        tags: deckInfo.tags,
        cards: selectedCards.map((card) => ({
          cardId: card._id,
          count: card.count,
        })),
        energy: Object.entries(energyCount)
          .filter(([_, count]) => count > 0)
          .map(([type, count]) => ({ type, count })),
      }

      const response = await fetch("/api/decks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(deckData),
      })

      if (!response.ok) {
        throw new Error("創建牌組失敗")
      }

      const data = await response.json()

      toast({
        title: "牌組創建成功",
        description: "您的牌組已成功創建",
        variant: "default",
      })

      // 導航到新創建的牌組頁面
      router.push(`/decks/${data.deck._id}`)
    } catch (error) {
      console.error("創建牌組錯誤:", error)
      toast({
        title: "錯誤",
        description: "創建牌組失敗，請稍後再試",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 能量類型選項
  const energyTypes = [
    { id: "grass", name: "草", color: "green" },
    { id: "fire", name: "火", color: "destructive" },
    { id: "water", name: "水", color: "blue" },
    { id: "electric", name: "雷", color: "yellow" },
    { id: "psychic", name: "超能", color: "purple" },
    { id: "fighting", name: "格鬥", color: "orange" },
    { id: "dark", name: "惡", color: "default" },
    { id: "steel", name: "鋼", color: "secondary" },
    { id: "colorless", name: "無色", color: "default" },
  ]

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">正在加載牌組數據...</span>
      </div>
    )
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
            <h1 className="text-3xl font-bold tracking-tight">創建新牌組</h1>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>牌組資訊</CardTitle>
                  <CardDescription>設定您的牌組基本資訊</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">牌組名稱</Label>
                    <Input
                      id="name"
                      name="name"
                      value={deckInfo.name}
                      onChange={handleInfoChange}
                      placeholder="輸入牌組名稱"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">牌組描述</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={deckInfo.description}
                      onChange={handleInfoChange}
                      placeholder="描述您的牌組策略和特點"
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mainEnergy">主要能量類型</Label>
                    <Select onValueChange={handleSelectChange} value={deckInfo.mainEnergy}>
                      <SelectTrigger>
                        <SelectValue placeholder="選擇主要能量類型" />
                      </SelectTrigger>
                      <SelectContent>
                        {energyTypes.map((energy) => (
                          <SelectItem key={energy.id} value={energy.id}>
                            {energy.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">標籤 (用逗號分隔)</Label>
                    <Input
                      id="tags"
                      name="tags"
                      value={deckInfo.tags.join(", ")}
                      onChange={handleTagsChange}
                      placeholder="競技, 初學者友好, ..."
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isPublic">公開牌組</Label>
                    <Switch id="isPublic" checked={deckInfo.isPublic} onCheckedChange={handleSwitchChange} />
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="w-full">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium">牌組卡牌數量:</span>
                      <span
                        className={`text-sm font-bold ${
                          getTotalCardCount() === 60
                            ? "text-green-500"
                            : getTotalCardCount() > 60
                              ? "text-destructive"
                              : ""
                        }`}
                      >
                        {getTotalCardCount()} / 60
                      </span>
                    </div>
                    <Button
                      className="w-full"
                      onClick={handleSaveDeck}
                      disabled={
                        isSubmitting ||
                        getTotalCardCount() !== 60 ||
                        deckInfo.name.trim() === "" ||
                        !deckInfo.mainEnergy
                      }
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          保存中...
                        </>
                      ) : (
                        "保存牌組"
                      )}
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>能量卡</CardTitle>
                  <CardDescription>添加能量卡到您的牌組</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2">
                    {energyTypes.map((energy) => (
                      <div key={energy.id} className="flex items-center justify-between rounded-md border p-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={energy.color}>{energy.name}</Badge>
                          <span className="text-sm font-medium">{energyCount[energy.id]} 張</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleRemoveEnergy(energy.id)}
                            disabled={energyCount[energy.id] <= 0}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleAddEnergy(energy.id)}
                            disabled={getTotalCardCount() >= 60}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Tabs defaultValue="builder" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="builder">牌組構築</TabsTrigger>
                  <TabsTrigger value="preview">牌組預覽</TabsTrigger>
                </TabsList>
                <TabsContent value="builder" className="space-y-4">
                  <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="搜尋卡牌..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button type="submit" disabled={isSearching}>
                      {isSearching ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          搜尋中...
                        </>
                      ) : (
                        "搜尋"
                      )}
                    </Button>
                  </form>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {searchResults.length === 0 ? (
                      <div className="col-span-full flex h-40 items-center justify-center rounded-md border border-dashed">
                        <p className="text-center text-muted-foreground">
                          {searchTerm ? "沒有找到符合條件的卡牌" : "搜尋卡牌以添加到牌組"}
                        </p>
                      </div>
                    ) : (
                      searchResults.map((card) => (
                        <Card key={card._id} className="overflow-hidden transition-all hover:shadow-md">
                          <div className="relative aspect-[2/3] w-full overflow-hidden">
                            <Image
                              src={card.imageUrl || "/placeholder.svg?height=300&width=215"}
                              alt={card.name}
                              fill
                              className="object-cover"
                            />
                            <Button
                              variant="secondary"
                              size="icon"
                              className="absolute bottom-2 right-2 h-8 w-8 rounded-full opacity-90"
                              onClick={() => handleAddCard(card)}
                              disabled={
                                selectedCards.find((c) => c._id === card._id)?.count >= 4 || getTotalCardCount() >= 60
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <CardContent className="p-2">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-semibold">{card.name}</h3>
                              <Badge variant={getAttributeColor(card.attribute)} className="text-xs">
                                {card.attribute}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{card.type}</p>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="preview">
                  <Card>
                    <CardHeader>
                      <CardTitle>已選擇的卡牌 ({selectedCards.reduce((acc, card) => acc + card.count, 0)})</CardTitle>
                      <CardDescription>查看和管理您已選擇的卡牌</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {selectedCards.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                          {selectedCards.map((card) => (
                            <Card key={card._id} className="overflow-hidden transition-all hover:shadow-md">
                              <div className="relative aspect-[2/3] w-full overflow-hidden">
                                <Image
                                  src={card.imageUrl || "/placeholder.svg?height=300&width=215"}
                                  alt={card.name}
                                  fill
                                  className="object-cover"
                                />
                                <div className="absolute right-2 top-2 rounded-full bg-background px-2 py-1 text-xs font-bold">
                                  ×{card.count}
                                </div>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="absolute bottom-2 right-2 h-8 w-8 rounded-full opacity-90"
                                  onClick={() => handleRemoveCard(card._id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <CardContent className="p-2">
                                <div className="flex items-center justify-between">
                                  <h3 className="text-sm font-semibold">{card.name}</h3>
                                  <Badge variant={getAttributeColor(card.attribute)} className="text-xs">
                                    {card.attribute}
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                          <p className="text-center text-muted-foreground">尚未選擇任何卡牌</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>能量卡 ({Object.values(energyCount).reduce((a, b) => a + b, 0)})</CardTitle>
                      <CardDescription>查看和管理您已選擇的能量卡</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {energyTypes.map(
                          (energy) =>
                            energyCount[energy.id] > 0 && (
                              <Card key={energy.id} className="overflow-hidden transition-all hover:shadow-md">
                                <div className="flex h-full flex-col items-center justify-center p-4">
                                  <Badge variant={energy.color} className="mb-2 px-3 py-1 text-lg">
                                    {energy.name}
                                  </Badge>
                                  <p className="text-center text-xl font-bold">{energyCount[energy.id]} 張</p>
                                </div>
                              </Card>
                            ),
                        )}
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

