import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserTable } from "@/components/admin/user-table"

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">用戶管理</h1>
        <Link href="/admin/users/new">
          <Button>新增用戶</Button>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Input
          placeholder="搜尋用戶..."
          className="max-w-sm"
        />
        <Button variant="outline">搜尋</Button>
      </div>
      <UserTable />
    </div>
  )
}

