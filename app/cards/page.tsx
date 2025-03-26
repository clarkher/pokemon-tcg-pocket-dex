"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CardGrid } from "@/components/cards/card-grid"
import { CardFilters } from "@/components/cards/card-filters"
import { PokemonLogo } from "@/components/pokemon-logo"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CardsPage() {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    attribute: [],
    rarity: [],
    series: [],
    expansion: [],
  })
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { toast } = useToast()

  useEffect(() => {
    fetchCards()
  }, [page, filters])

  const fetchCards = async () => {
    try {
      setLoading(true)

      // 構建查詢參數
      const params = new URLSearchParams()
      params.append("page", page.toString())
      params.append("limit", "20")

      if (searchTerm) {
        params.append("search", searchTerm)
      }

      if (filters.attribute.length > 0) {
        filters.attribute.forEach((attr) => params.append("attribute", attr))
      }

      if (filters.rarity.length > 0) {
        filters.rarity.forEach((rarity) => params.append("rarity", rarity))
      }

      if (filters.series.length > 0) {
        filters.series.forEach((series) => params.append("series", series))
      }

      if (filters.expansion.length > 0) {
        filters.expansion.forEach((expansion) => params.append("expansion", expansion))
      }

      const response = await fetch(`/api/cards?${params.toString()}`)

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

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1) // 重置頁碼
    fetchCards()
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setPage(1) // 重置頁碼
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
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">卡牌資料庫</h1>
              <div className="flex items-center gap-2">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <Input
                    placeholder="搜尋卡牌..."
                    className="w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button variant="outline" type="submit">
                    搜尋
                  </Button>
                </form>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <div className="md:col-span-1">
                <CardFilters filters={filters} onFilterChange={handleFilterChange} />
              </div>
              <div className="md:col-span-3">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">加載中...</span>
                  </div>
                ) : (
                  <>
                    <CardGrid cards={cards} />

                    {/* 分頁控制 */}
                    {totalPages > 1 && (
                      <div className="flex justify-center mt-6">
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            disabled={page === 1}
                          >
                            上一頁
                          </Button>

                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            // 顯示當前頁附近的頁碼
                            let pageNum = i + 1
                            if (page > 3 && totalPages > 5) {
                              pageNum = page - 2 + i
                              if (pageNum > totalPages) {
                                pageNum = totalPages - (4 - i)
                              }
                            }
                            return (
                              <Button
                                key={pageNum}
                                variant={pageNum === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setPage(pageNum)}
                              >
                                {pageNum}
                              </Button>
                            )
                          })}

                          {totalPages > 5 && page < totalPages - 2 && (
                            <>
                              <Button variant="outline" size="sm" disabled>
                                ...
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => setPage(totalPages)}>
                                {totalPages}
                              </Button>
                            </>
                          )}

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
                  </>
                )}
              </div>
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

