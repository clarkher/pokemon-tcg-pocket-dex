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
import { UserTable } from "@/components/admin/user-table"

interface User {
  _id: string
  username: string
  email: string
  status: string
  isAdmin: boolean
  createdAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { token } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [page, statusFilter])

  const fetchUsers = async () => {
    if (!token) return

    try {
      setLoading(true)

      let url = `/api/admin/users?page=${page}&limit=10`

      if (statusFilter !== "all") {
        url += `&status=${statusFilter}`
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("獲取用戶失敗")
      }

      const data = await response.json()
      setUsers(data.users)
      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      console.error("獲取用戶錯誤:", error)
      toast({
        title: "錯誤",
        description: "獲取用戶列表失敗",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchUsers()
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    setPage(1) // 重置頁碼
  }

  const handleDeleteUser = async (userId: string) => {
    if (!token) return

    if (!confirm("確定要刪除此用戶嗎？此操作無法撤銷。")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("刪除用戶失敗")
      }

      toast({
        title: "成功",
        description: "用戶已成功刪除",
      })

      // 重新獲取用戶列表
      fetchUsers()
    } catch (error) {
      console.error("刪除用戶錯誤:", error)
      toast({
        title: "錯誤",
        description: "刪除用戶失敗",
        variant: "destructive",
      })
    }
  }

  const handleUpdateUserStatus = async (userId: string, newStatus: string) => {
    if (!token) return

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("更新用戶狀態失敗")
      }

      toast({
        title: "成功",
        description: "用戶狀態已更新",
      })

      // 更新本地用戶列表
      setUsers(users.map((user) => (user._id === userId ? { ...user, status: newStatus } : user)))
    } catch (error) {
      console.error("更新用戶狀態錯誤:", error)
      toast({
        title: "錯誤",
        description: "更新用戶狀態失敗",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">用戶管理</h1>
        <Link href="/admin/users/new">
          <Button>新增用戶</Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="搜尋用戶名或郵箱..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button type="submit" variant="outline">
            搜尋
          </Button>
        </form>

        <div className="flex items-center gap-2">
          <span className="text-sm">狀態:</span>
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="選擇狀態" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="active">活躍</SelectItem>
              <SelectItem value="inactive">非活躍</SelectItem>
              <SelectItem value="banned">已禁用</SelectItem>
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
        <UserTable users={users} onDelete={handleDeleteUser} onUpdateStatus={handleUpdateUserStatus} />
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

