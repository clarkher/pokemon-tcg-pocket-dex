"use client"

import type React from "react"

import { useState } from "react"
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
import { ChevronLeft, Search, Plus, X } from "lucide-react"

// 模擬卡牌數據
const mockCards = [
  {
    id: "1",
    name: "皮卡丘",
    attribute: "雷",
    type: "基本",
    imageUrl: "/placeholder.svg?height=300&width=215",
  },
  {
    id: "2",
    name: "噴火龍",
    attribute: "火",
    type: "第二階段",
    imageUrl: "/placeholder.svg?height=300&width=215",
  },
  {
    id: "3",
    name: "水箭龜",
    attribute: "水",
    type: "第二階段",
    imageUrl: "/placeholder.svg?height=300&width=215",
  },
  {
    id: "4",
    name: "妙蛙花",
    attribute: "草",
    type: "第二階段",
    imageUrl: "/placeholder.svg?height=300&width=215",
  },
  {
    id: "5",
    name: "超夢",
    attribute: "超能",
    type: "基本",
    imageUrl: "/placeholder.svg?height=300&width=215",
  },
  {
    id: "6",
    name: "雷丘",
    attribute: "雷",
    type: "第一階段",
    imageUrl: "/placeholder.svg?height=300&width=215",
  },
  {
    id: "7",
    name: "小火龍",
    attribute: "火",
    type: "基本",
    imageUrl: "/placeholder.svg?height=300&width=215",
  },
  {
    id: "8",
    name: "傑尼龜",
    attribute: "水",
    type: "基本",
    imageUrl: "/placeholder.svg?height=300&width=215",
  },
]

// 能量卡類型
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

export default function NewDeckPage() {
  const [deckInfo, setDeckInfo] = useState({
    name: "",
    description: "",
    isPublic: true,
    mainEnergy: "",
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCards, setSelectedCards] = useState<any[]>([])
  const [energyCount, setEnergyCount] = useState<Record<string, number>>({
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

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setDeckInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setDeckInfo((prev) => ({ ...prev, isPublic: checked }))
  }

  const handleSelectChange = (value: string) => {
    setDeckInfo((prev) => ({ ...prev, mainEnergy: value }))
  }

  const handleAddCard = (card: any) => {
    // 檢查牌組中該卡牌的數量是否已達到4張
    const cardCount = selectedCards.filter((c) => c.id === card.id).length
    if (cardCount < 4) {
      setSelectedCards([...selectedCards, card])
    } else {
      alert("每種卡牌最多只能放入4張!")
    }
  }

  const handleRemoveCard = (index: number) => {
    const newSelectedCards = [...selectedCards]
    newSelectedCards.splice(index, 1)
    setSelectedCards(newSelectedCards)
  }

  const handleAddEnergy = (energyType: string) => {
    if (getTotalCardCount() < 60) {
      setEnergyCount({
        ...energyCount,
        [energyType]: energyCount[energyType as keyof typeof energyCount] + 1,
      })
    } else {
      alert("牌組最多只能包含60張卡牌!")
    }
  }

  const handleRemoveEnergy = (energyType: string) => {
    if (energyCount[energyType as keyof typeof energyCount] > 0) {
      setEnergyCount({
        ...energyCount,
        [energyType]: energyCount[energyType as keyof typeof energyCount] - 1,
      })
    }
  }

  const getTotalCardCount = () => {
    return selectedCards.length + Object.values(energyCount).reduce((a, b) => a + b, 0)
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

  const filteredCards = mockCards.filter(
    (card) =>
      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.attribute.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSaveDeck = () => {
    if (deckInfo.name.trim() === "") {
      alert("請輸入牌組名稱!")
      return
    }

    if (getTotalCardCount() < 60) {
      alert("牌組必須包含60張卡牌!")
      return
    }

    const deckData = {
      ...deckInfo,
      cards: selectedCards,
      energy: energyCount,
      totalCards: getTotalCardCount(),
    }

    console.log("保存牌組:", deckData)
    // 這裡會處理保存牌組的邏輯
    alert("牌組保存成功!")
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
                        className={`text-sm font-bold ${getTotalCardCount() === 60 ? "text-green" : getTotalCardCount() > 60 ? "text-destructive" : ""}`}
                      >
                        {getTotalCardCount()} / 60
                      </span>
                    </div>
                    <Button
                      className="w-full"
                      onClick={handleSaveDeck}
                      disabled={getTotalCardCount() !== 60 || deckInfo.name.trim() === ""}
                    >
                      保存牌組
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
                          <Badge variant={energy.color as any}>{energy.name}</Badge>
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
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="搜尋卡牌..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {filteredCards.map((card) => (
                      <Card key={card.id} className="overflow-hidden transition-all hover:shadow-md">
                        <div className="relative aspect-[2/3] w-full overflow-hidden">
                          <Image
                            src={card.imageUrl || "/placeholder.svg"}
                            alt={card.name}
                            fill
                            className="object-cover"
                          />
                          <Button
                            variant="secondary"
                            size="icon"
                            className="absolute bottom-2 right-2 h-8 w-8 rounded-full opacity-90"
                            onClick={() => handleAddCard(card)}
                            disabled={selectedCards.filter((c) => c.id === card.id).length >= 4}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <CardContent className="p-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold">{card.name}</h3>
                            <Badge variant={getAttributeColor(card.attribute) as any} className="text-xs">
                              {card.attribute}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{card.type}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="preview">
                  <Card>
                    <CardHeader>
                      <CardTitle>已選擇的卡牌 ({selectedCards.length})</CardTitle>
                      <CardDescription>查看和管理您已選擇的卡牌</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {selectedCards.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                          {selectedCards.map((card, index) => (
                            <Card key={index} className="overflow-hidden transition-all hover:shadow-md">
                              <div className="relative aspect-[2/3] w-full overflow-hidden">
                                <Image
                                  src={card.imageUrl || "/placeholder.svg"}
                                  alt={card.name}
                                  fill
                                  className="object-cover"
                                />
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="absolute bottom-2 right-2 h-8 w-8 rounded-full opacity-90"
                                  onClick={() => handleRemoveCard(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <CardContent className="p-2">
                                <div className="flex items-center justify-between">
                                  <h3 className="text-sm font-semibold">{card.name}</h3>
                                  <Badge variant={getAttributeColor(card.attribute) as any} className="text-xs">
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
                                  <Badge variant={energy.color as any} className="mb-2 px-3 py-1 text-lg">
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

