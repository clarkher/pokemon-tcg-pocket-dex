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
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

// 卡牌模擬數據
const cards = [
  {
    id: "1",
    name: "皮卡丘",
    nameEn: "Pikachu",
    attribute: "雷",
    rarity: "普通",
    series: "基本系列",
    expansion: "基本",
    cardNumber: "58/102",
    releaseDate: "1999-01-09",
  },
  {
    id: "2",
    name: "噴火龍",
    nameEn: "Charizard",
    attribute: "火",
    rarity: "稀有閃卡",
    series: "基本系列",
    expansion: "基本",
    cardNumber: "4/102",
    releaseDate: "1999-01-09",
  },
  {
    id: "3",
    name: "水箭龜",
    nameEn: "Blastoise",
    attribute: "水",
    rarity: "稀有閃卡",
    series: "基本系列",
    expansion: "基本",
    cardNumber: "2/102",
    releaseDate: "1999-01-09",
  },
  {
    id: "4",
    name: "妙蛙花",
    nameEn: "Venusaur",
    attribute: "草",
    rarity: "稀有閃卡",
    series: "基本系列",
    expansion: "基本",
    cardNumber: "15/102",
    releaseDate: "1999-01-09",
  },
  {
    id: "5",
    name: "超夢",
    nameEn: "Mewtwo",
    attribute: "超能",
    rarity: "稀有閃卡",
    series: "基本系列",
    expansion: "基本",
    cardNumber: "10/102",
    releaseDate: "1999-01-09",
  },
]

export function CardTable() {
  const [selectedCards, setSelectedCards] = useState<string[]>([])

  const toggleSelectAll = () => {
    if (selectedCards.length === cards.length) {
      setSelectedCards([])
    } else {
      setSelectedCards(cards.map((card) => card.id))
    }
  }

  const toggleSelectCard = (id: string) => {
    if (selectedCards.includes(id)) {
      setSelectedCards(selectedCards.filter((cardId) => cardId !== id))
    } else {
      setSelectedCards([...selectedCards, id])
    }
  }

  const getAttributeColor = (attribute: string) => {
    const colors: Record<string, string> = {
      雷: "yellow",
      火: "destructive",
      水: "blue",
      草: "green",
      超能: "purple",
    }
    return colors[attribute] || "default"
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
                checked={selectedCards.length === cards.length}
                onChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead>名稱</TableHead>
            <TableHead>屬性</TableHead>
            <TableHead>稀有度</TableHead>
            <TableHead>系列</TableHead>
            <TableHead>卡牌編號</TableHead>
            <TableHead>發行日期</TableHead>
            <TableHead className="w-[100px]">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cards.map((card) => (
            <TableRow key={card.id}>
              <TableCell>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={selectedCards.includes(card.id)}
                  onChange={() => toggleSelectCard(card.id)}
                />
              </TableCell>
              <TableCell className="font-medium">{card.name}</TableCell>
              <TableCell>
                <Badge variant={getAttributeColor(card.attribute) as any}>{card.attribute}</Badge>
              </TableCell>
              <TableCell>{card.rarity}</TableCell>
              <TableCell>{card.series}</TableCell>
              <TableCell>{card.cardNumber}</TableCell>
              <TableCell>{card.releaseDate}</TableCell>
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
                      <Link href={`/admin/cards/${card.id}`} className="flex items-center">
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

