import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EventTable } from "@/components/admin/event-table"

export default function EventsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">活動管理</h1>
        <Link href="/admin/events/new">
          <Button>新增活動</Button>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Input
          placeholder="搜尋活動..."
          className="max-w-sm"
        />
        <Button variant="outline">搜尋</Button>
      </div>
      <EventTable />
    </div>
  )
}

