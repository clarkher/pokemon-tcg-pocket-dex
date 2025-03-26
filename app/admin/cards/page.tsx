"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/context/auth-context"
import { Loader2 } from "lucide-react"
import { CardTable } from "@/components/admin/card-table"

interface Card {
  _id: string
  name: string
  nameEn: string
  attribute: string
  rarity: string
  series: string
  expansion: string
  cardNumber: string
  releaseDate: string
  createdBy: {
    _id: string
    username: string
  }
}

export default function CardsPage() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [attributeFilter, setAttributeFilter] = useState("all")
  const [rarityFilter, setRarityFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { token } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchCards()
  }, [page, attributeFilter, rarityFilter])

  const fetchCards = async () => {
    if (!token) return

    try {
      setLoading(true)

      let url = `/api/admin/cards?page=${page}&limit=10`

      if (attributeFilter !== "all") {
        url += `&attribute=${attributeFilter}`
      }

      if (rarityFilter !== "all") {
        url += `&rarity=${rarityFilter}`
      }

      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("獲取卡牌失敗")
      }

      const data = await response.json()
      setCards(data.cards)
      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      console.error("獲取卡牌錯誤:", error)
      toast({
        title: "錯誤",
        description: "獲取卡牌列表失敗",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchCards()
  }

  const handleAttributeChange = (value: string) => {
    setAttributeFilter(value)
    setPage(1) // 重置頁碼
  }

  const handleRarityChange = (value: string) => {
    setRarityFilter(value)
    setPage(1) // 重置頁碼
  }

  const handleDeleteCard = async (cardId: string) => {
    if (!token) return

    try {
      const response = await fetch(`/api/admin/cards/${cardId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("刪除卡牌失敗")
      }

      toast({
        title: "成功",
        description: "卡牌已成功刪除",
      })

      // 重新獲取卡牌列表
      fetchCards()
    } catch (error) {
      console.error("刪除卡牌錯誤:", error)
      toast({
        title: "錯誤",
        description: "刪除卡牌失敗",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">卡牌管理</h1>
        <Link href="/admin/cards/new">
          <Button>新增卡牌</Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="搜尋卡牌名稱或編號..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button type="submit" variant="outline">
            搜尋
          </Button>
        </form>

        <div className="flex items-center gap-2">
          <span className="text-sm">屬性:</span>
          <Select value={attributeFilter} onValueChange={handleAttributeChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="選擇屬性" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="雷">雷</SelectItem>
              <SelectItem value="火">火</SelectItem>
              <SelectItem value="水">水</SelectItem>
              <SelectItem value="草">草</SelectItem>
              <SelectItem value="超能">超能</SelectItem>
              <SelectItem value="格鬥">格鬥</SelectItem>
              <SelectItem value="惡">惡</SelectItem>
              <SelectItem value="鋼">鋼</SelectItem>
              <SelectItem value="無色">無色</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">稀有度:</span>
          <Select value={rarityFilter} onValueChange={handleRarityChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="選擇稀有度" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="普通">普通</SelectItem>
              <SelectItem value="非普通">非普通</SelectItem>
              <SelectItem value="稀有">稀有</SelectItem>
              <SelectItem value="稀有閃卡">稀有閃卡</SelectItem>
              <SelectItem value="超稀有">超稀有</SelectItem>
              <SelectItem value="秘密稀有">秘密稀有</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">加載中...</span>
        </div>
      ) : (
        <CardTable cards={cards} onDelete={handleDeleteCard} />
      )}

      {/* 分頁控制 */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              上一頁
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button key={p} variant={p === page ? "default" : "outline"} size="sm" onClick={() => setPage(p)}>
                {p}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
            >
              下一頁
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

