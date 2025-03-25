import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CardTable } from "@/components/admin/card-table"

export default function CardsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">卡牌管理</h1>
        <Link href="/admin/cards/new">
          <Button>新增卡牌</Button>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Input placeholder="搜尋卡牌..." className="max-w-sm" />
        <Button variant="outline">搜尋</Button>
      </div>
      <CardTable />
    </div>
  )
}

