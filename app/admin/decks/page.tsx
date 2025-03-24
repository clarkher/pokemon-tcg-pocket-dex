import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DeckTable } from "@/components/admin/deck-table"

export default function DecksPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">牌組管理</h1>
        <Link href="/admin/decks/new">
          <Button>新增牌組</Button>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Input
          placeholder="搜尋牌組..."
          className="max-w-sm"
        />
        <Button variant="outline">搜尋</Button>
      </div>
      <DeckTable />
    </div>
  )
}

