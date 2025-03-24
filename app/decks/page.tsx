import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DeckGrid } from "@/components/decks/deck-grid"
import { DeckFilters } from "@/components/decks/deck-filters"

export default function DecksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xl font-bold">
              寶可夢集換式卡牌資料庫
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
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">牌組資料庫</h1>
              <div className="flex items-center gap-2">
                <Link href="/decks/new">
                  <Button>創建牌組</Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Input placeholder="搜尋牌組..." className="max-w-sm" />
              <Button variant="outline">搜尋</Button>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <div className="md:col-span-1">
                <DeckFilters />
              </div>
              <div className="md:col-span-3">
                <DeckGrid />
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

