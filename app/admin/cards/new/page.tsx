"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft } from "lucide-react"

export default function NewCardPage() {
  const [cardData, setCardData] = useState({
    name: "",
    nameEn: "",
    attribute: "",
    rarity: "",
    series: "",
    expansion: "",
    hp: "",
    type: "",
    cardNumber: "",
    releaseDate: "",
    imageUrl: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCardData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setCardData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("卡牌數據已提交:", cardData)
    // 這裡通常會將數據發送到API
    alert("卡牌創建成功！")
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Link href="/admin/cards">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">新增卡牌</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>卡牌資訊</CardTitle>
            <CardDescription>輸入新寶可夢卡牌的詳細資訊。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">卡牌名稱 (中文)</Label>
                <Input
                  id="name"
                  name="name"
                  value={cardData.name}
                  onChange={handleChange}
                  placeholder="輸入卡牌中文名稱"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameEn">卡牌名稱 (英文)</Label>
                <Input
                  id="nameEn"
                  name="nameEn"
                  value={cardData.nameEn}
                  onChange={handleChange}
                  placeholder="輸入卡牌英文名稱"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="attribute">屬性</Label>
                <Select onValueChange={(value) => handleSelectChange("attribute", value)} value={cardData.attribute}>
                  <SelectTrigger>
                    <SelectValue placeholder="選擇屬性" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="草">草</SelectItem>
                    <SelectItem value="火">火</SelectItem>
                    <SelectItem value="水">水</SelectItem>
                    <SelectItem value="雷">雷</SelectItem>
                    <SelectItem value="超能">超能</SelectItem>
                    <SelectItem value="格鬥">格鬥</SelectItem>
                    <SelectItem value="惡">惡</SelectItem>
                    <SelectItem value="鋼">鋼</SelectItem>
                    <SelectItem value="無色">無色</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rarity">稀有度</Label>
                <Select onValueChange={(value) => handleSelectChange("rarity", value)} value={cardData.rarity}>
                  <SelectTrigger>
                    <SelectValue placeholder="選擇稀有度" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="普通">普通</SelectItem>
                    <SelectItem value="非普通">非普通</SelectItem>
                    <SelectItem value="稀有">稀有</SelectItem>
                    <SelectItem value="稀有閃卡">稀有閃卡</SelectItem>
                    <SelectItem value="超稀有">超稀有</SelectItem>
                    <SelectItem value="秘密稀有">秘密稀有</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="series">系列</Label>
                <Input
                  id="series"
                  name="series"
                  value={cardData.series}
                  onChange={handleChange}
                  placeholder="輸入卡牌系列"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expansion">擴充包</Label>
                <Input
                  id="expansion"
                  name="expansion"
                  value={cardData.expansion}
                  onChange={handleChange}
                  placeholder="輸入擴充包名稱"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hp">HP值</Label>
                <Input
                  id="hp"
                  name="hp"
                  type="number"
                  value={cardData.hp}
                  onChange={handleChange}
                  placeholder="輸入HP值"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">類型</Label>
                <Select onValueChange={(value) => handleSelectChange("type", value)} value={cardData.type}>
                  <SelectTrigger>
                    <SelectValue placeholder="選擇類型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="基本">基本</SelectItem>
                    <SelectItem value="第一階段">第一階段</SelectItem>
                    <SelectItem value="第二階段">第二階段</SelectItem>
                    <SelectItem value="EX">EX</SelectItem>
                    <SelectItem value="GX">GX</SelectItem>
                    <SelectItem value="V">V</SelectItem>
                    <SelectItem value="VMAX">VMAX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardNumber">卡牌編號</Label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  value={cardData.cardNumber}
                  onChange={handleChange}
                  placeholder="輸入卡牌編號 (例如: 58/102)"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="releaseDate">發行日期</Label>
                <Input
                  id="releaseDate"
                  name="releaseDate"
                  type="date"
                  value={cardData.releaseDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">卡牌圖片URL</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={cardData.imageUrl}
                onChange={handleChange}
                placeholder="輸入卡牌圖片的URL"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button">
              取消
            </Button>
            <Button type="submit">創建卡牌</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

