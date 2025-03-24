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
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'

// 活動模擬數據
const events = [
  {
    id: "1",
    title: "真新鎮錦標賽",
    type: "特級護照",
    startDate: "2023-10-15",
    endDate: "2023-10-20",
    status: "進行中",
    organizer: "寶可夢聯盟",
  },
  {
    id: "2",
    title: "華藍市挑戰賽",
    type: "任務",
    startDate: "2023-11-05",
    endDate: "2023-11-10",
    status: "即將開始",
    organizer: "小霞道館",
  },
  {
    id: "3",
    title: "尼比市岩石系展示",
    type: "得卡挑戰",
    startDate: "2023-09-20",
    endDate: "2023-09-25",
    status: "已結束",
    organizer: "小剛道館",
  },
  {
    id: "4",
    title: "常磐森林探險",
    type: "單人對戰",
    startDate: "2023-12-01",
    endDate: "2023-12-15",
    status: "即將開始",
    organizer: "寶可夢巡護員",
  },
  {
    id: "5",
    title: "石英高原錦標賽",
    type: "特級護照",
    startDate: "2024-01-10",
    endDate: "2024-01-20",
    status: "即將開始",
    organizer: "四天王",
  },
]

export function EventTable() {
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])

  const toggleSelectAll = () => {
    if (selectedEvents.length === events.length) {
      setSelectedEvents([])
    } else {
      setSelectedEvents(events.map((event) => event.id))
    }
  }

  const toggleSelectEvent = (id: string) => {
    if (selectedEvents.includes(id)) {
      setSelectedEvents(selectedEvents.filter((eventId) => eventId !== id))
    } else {
      setSelectedEvents([...selectedEvents, id])
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      進行中: "green",
      即將開始: "blue",
      已結束: "secondary",
    }
    return colors[status] || "default"
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      特級護照: "purple",
      任務: "yellow",
      得卡挑戰: "orange",
      單人對戰: "destructive",
    }
    return colors[type] || "default"
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
                checked={selectedEvents.length === events.length}
                onChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead>標題</TableHead>
            <TableHead>類型</TableHead>
            <TableHead>開始日期</TableHead>
            <TableHead>結束日期</TableHead>
            <TableHead>狀態</TableHead>
            <TableHead>主辦方</TableHead>
            <TableHead className="w-[100px]">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={selectedEvents.includes(event.id)}
                  onChange={() => toggleSelectEvent(event.id)}
                />
              </TableCell>
              <TableCell className="font-medium">{event.title}</TableCell>
              <TableCell>
                <Badge variant={getTypeColor(event.type) as any}>
                  {event.type}
                </Badge>
              </TableCell>
              <TableCell>{event.startDate}</TableCell>
              <TableCell>{event.endDate}</TableCell>
              <TableCell>
                <Badge variant={getStatusColor(event.status) as any}>
                  {event.status}
                </Badge>
              </TableCell>
              <TableCell>{event.organizer}</TableCell>
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
                      <Link href={`/admin/events/${event.id}`} className="flex items-center">
                        <Pencil className="mr-2 h-4 w-4" />
                        編輯
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

