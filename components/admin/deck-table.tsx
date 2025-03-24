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
import { MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react'

// 牌組模擬數據
const decks = [
  {
    id: "1",
    name: "皮卡丘之力",
    creator: "小智",
    mainEnergy: ["雷"],
    isPublic: true,
    likes: 245,
    views: 1024,
    createdAt: "2023-05-15",
  },
  {
    id: "2",
    name: "水系策略",
    creator: "小霞",
    mainEnergy: ["水"],
    isPublic: true,
    likes: 189,
    views: 876,
    createdAt: "2023-06-22",
  },
  {
    id: "3",
    name: "岩石堅固牌組",
    creator: "小剛",
    mainEnergy: ["格鬥"],
    isPublic: true,
    likes: 156,
    views: 723,
    createdAt: "2023-07-10",
  },
  {
    id: "4",
    name: "噴火龍燃燒",
    creator: "小茂",
    mainEnergy: ["火"],
    isPublic: true,
    likes: 312,
    views: 1542,
    createdAt: "2023-08-05",
  },
  {
    id: "5",
    name: "超能控制",
    creator: "娜姿",
    mainEnergy: ["超能"],
    isPublic: false,
    likes: 98,
    views: 432,
    createdAt: "2023-09-18",
  },
]

export function DeckTable() {
  const [selectedDecks, setSelectedDecks] = useState<string[]>([])

  const toggleSelectAll = () => {
    if (selectedDecks.length === decks.length) {
      setSelectedDecks([])
    } else {
      setSelectedDecks(decks.map((deck) => deck.id))
    }
  }

  const toggleSelectDeck = (id: string) => {
    if (selectedDecks.includes(id)) {
      setSelectedDecks(selectedDecks.filter((deckId) => deckId !== id))
    } else {
      setSelectedDecks([...selectedDecks, id])
    }
  }

  const getEnergyColor = (energy: string) => {
    const colors: Record<string, string> = {
      雷: "yellow",
      火: "destructive",
      水: "blue",
      格鬥: "orange",
      超能: "purple",
      草: "green",
    }
    return colors[energy] || "default"
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
                checked={selectedDecks.length === decks.length}
                onChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead>名稱</TableHead>
            <TableHead>創建者</TableHead>
            <TableHead>能量類型</TableHead>
            <TableHead>狀態</TableHead>
            <TableHead>點讚數</TableHead>
            <TableHead>瀏覽數</TableHead>
            <TableHead>創建日期</TableHead>
            <TableHead className="w-[100px]">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {decks.map((deck) => (
            <TableRow key={deck.id}>
              <TableCell>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={selectedDecks.includes(deck.id)}
                  onChange={() => toggleSelectDeck(deck.id)}
                />
              </TableCell>
              <TableCell className="font-medium">{deck.name}</TableCell>
              <TableCell>{deck.creator}</TableCell>
              <TableCell>
                {deck.mainEnergy.map((energy, index) => (
                  <Badge key={index} variant={getEnergyColor(energy) as any} className="mr-1">
                    {energy}
                  </Badge>
                ))}
              </TableCell>
              <TableCell>
                <Badge variant={deck.isPublic ? "default" : "secondary"}>
                  {deck.isPublic ? "公開" : "私人"}
                </Badge>
              </TableCell>
              <TableCell>{deck.likes}</TableCell>
              <TableCell>{deck.views}</TableCell>
              <TableCell>{deck.createdAt}</TableCell>
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
                      <Link href={`/admin/decks/${deck.id}`} className="flex items-center">
                        <Eye className="mr-2 h-4 w-4" />
                        查看
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={`/admin/decks/${deck.id}/edit`} className="flex items-center">
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

