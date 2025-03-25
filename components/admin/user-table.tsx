"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import { MoreHorizontal, Pencil, Trash2, Lock } from 'lucide-react'

// 用戶模擬數據
const users = [
  {
    id: "1",
    name: "小智",
    email: "ash@pokemon.com",
    role: "用戶",
    status: "活躍",
    decks: 12,
    createdAt: "2023-01-15",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "小智",
  },
  {
    id: "2",
    name: "小霞",
    email: "misty@pokemon.com",
    role: "用戶",
    status: "活躍",
    decks: 8,
    createdAt: "2023-02-22",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "小霞",
  },
  {
    id: "3",
    name: "小剛",
    email: "brock@pokemon.com",
    role: "用戶",
    status: "活躍",
    decks: 5,
    createdAt: "2023-03-10",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "小剛",
  },
  {
    id: "4",
    name: "小茂",
    email: "gary@pokemon.com",
    role: "用戶",
    status: "非活躍",
    decks: 15,
    createdAt: "2023-04-05",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "小茂",
  },
  {
    id: "5",
    name: "大木博士",
    email: "prof.oak@pokemon.com",
    role: "管理員",
    status: "活躍",
    decks: 3,
    createdAt: "2023-05-18",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "大木",
  },
]

export function UserTable() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(users.map((user) => user.id))
    }
  }

  const toggleSelectUser = (id: string) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((userId) => userId !== id))
    } else {
      setSelectedUsers([...selectedUsers, id])
    }
  }

  const getRoleColor = (role: string) => {
    return role === "管理員" ? "destructive" : "default"
  }

  const getStatusColor = (status: string) => {
    return status === "活躍" ? "green" : "secondary"
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
                checked={selectedUsers.length === users.length}
                onChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead>用戶</TableHead>
            <TableHead>電子郵件</TableHead>
            <TableHead>角色</TableHead>
            <TableHead>狀態</TableHead>
            <TableHead>牌組數</TableHead>
            <TableHead>註冊日期</TableHead>
            <TableHead className="w-[100px]">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => toggleSelectUser(user.id)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.initials}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user.name}</span>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant={getRoleColor(user.role) as any}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusColor(user.status) as any}>
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>{user.decks}</TableCell>
              <TableCell>{user.createdAt}</TableCell>
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
                      <Link href={`/admin/users/${user.id}`} className="flex items-center">
                        <Pencil className="mr-2 h-4 w-4" />
                        編輯
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={`/admin/users/${user.id}/reset-password`} className="flex items-center">
                        <Lock className="mr-2 h-4 w-4" />
                        重設密碼
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      刪除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

