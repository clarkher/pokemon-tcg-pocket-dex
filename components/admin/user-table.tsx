"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Pencil, Trash2, Lock, ShieldAlert, ShieldCheck } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface User {
  _id: string
  username: string
  email: string
  status: string
  isAdmin: boolean
  createdAt: string
  avatar?: string
}

interface UserTableProps {
  users: User[]
  onDelete: (userId: string) => void
  onUpdateStatus: (userId: string, newStatus: string) => void
}

export function UserTable({ users, onDelete, onUpdateStatus }: UserTableProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)

  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(users.map((user) => user._id))
    }
  }

  const toggleSelectUser = (id: string) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((userId) => userId !== id))
    } else {
      setSelectedUsers([...selectedUsers, id])
    }
  }

  const getRoleColor = (isAdmin: boolean) => {
    return isAdmin ? "destructive" : "default"
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: "green",
      inactive: "secondary",
      banned: "destructive",
    }
    return colors[status] || "secondary"
  }

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      active: "活躍",
      inactive: "非活躍",
      banned: "已禁用",
    }
    return texts[status] || status
  }

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (userToDelete) {
      onDelete(userToDelete)
      setUserToDelete(null)
    }
    setDeleteDialogOpen(false)
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={selectedUsers.length === users.length && users.length > 0}
                  onChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>用戶</TableHead>
              <TableHead>電子郵件</TableHead>
              <TableHead>角色</TableHead>
              <TableHead>狀態</TableHead>
              <TableHead>註冊日期</TableHead>
              <TableHead className="w-[100px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  沒有找到用戶
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => toggleSelectUser(user._id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg?height=32&width=32"} alt={user.username} />
                        <AvatarFallback>{user.username.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.username}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleColor(user.isAdmin) as any}>{user.isAdmin ? "管理員" : "用戶"}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(user.status) as any}>{getStatusText(user.status)}</Badge>
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">打開選單</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>操作</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Link href={`/admin/users/${user._id}`} className="flex items-center w-full">
                            <Pencil className="mr-2 h-4 w-4" />
                            編輯
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link href={`/admin/users/${user._id}/reset-password`} className="flex items-center w-full">
                            <Lock className="mr-2 h-4 w-4" />
                            重設密碼
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onUpdateStatus(user._id, "active")}
                          disabled={user.status === "active"}
                        >
                          <ShieldCheck className="mr-2 h-4 w-4 text-green-500" />
                          設為活躍
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onUpdateStatus(user._id, "banned")}
                          disabled={user.status === "banned"}
                        >
                          <ShieldAlert className="mr-2 h-4 w-4 text-destructive" />
                          禁用帳號
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteClick(user._id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          刪除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確定要刪除此用戶嗎？</AlertDialogTitle>
            <AlertDialogDescription>此操作無法撤銷。這將永久刪除該用戶帳號及其所有相關數據。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              刪除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

