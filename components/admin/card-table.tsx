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
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react"
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

interface Card {
  _id: string
  name: string
  nameEn: string
  attribute: string
  rarity: string
  series: string
  expansion: string
  cardNumber: string
  releaseDate: string
  createdBy: {
    _id: string
    username: string
  }
}

interface CardTableProps {
  cards: Card[]
  onDelete: (cardId: string) => void
}

export function CardTable({ cards, onDelete }: CardTableProps) {
  const [selectedCards, setSelectedCards] = useState<string[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [cardToDelete, setCardToDelete] = useState<string | null>(null)

  const toggleSelectAll = () => {
    if (selectedCards.length === cards.length) {
      setSelectedCards([])
    } else {
      setSelectedCards(cards.map((card) => card._id))
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
      格鬥: "orange",
      惡: "default",
      鋼: "secondary",
      無色: "default",
    }
    return colors[attribute] || "default"
  }

  const handleDeleteClick = (cardId: string) => {
    setCardToDelete(cardId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (cardToDelete) {
      onDelete(cardToDelete)
      setCardToDelete(null)
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
                  checked={selectedCards.length === cards.length && cards.length > 0}
                  onChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>名稱</TableHead>
              <TableHead>屬性</TableHead>
              <TableHead>稀有度</TableHead>
              <TableHead>系列</TableHead>
              <TableHead>卡牌編號</TableHead>
              <TableHead>發行日期</TableHead>
              <TableHead>創建者</TableHead>
              <TableHead className="w-[100px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cards.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  沒有找到卡牌
                </TableCell>
              </TableRow>
            ) : (
              cards.map((card) => (
                <TableRow key={card._id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      checked={selectedCards.includes(card._id)}
                      onChange={() => toggleSelectCard(card._id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{card.name}</TableCell>
                  <TableCell>
                    <Badge variant={getAttributeColor(card.attribute) as any}>{card.attribute}</Badge>
                  </TableCell>
                  <TableCell>{card.rarity}</TableCell>
                  <TableCell>{card.series}</TableCell>
                  <TableCell>{card.cardNumber}</TableCell>
                  <TableCell>{new Date(card.releaseDate).toLocaleDateString()}</TableCell>
                  <TableCell>{card.createdBy?.username || "系統"}</TableCell>
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
                          <Link href={`/cards/${card._id}`} className="flex items-center w-full">
                            <Eye className="mr-2 h-4 w-4" />
                            查看
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link href={`/admin/cards/${card._id}`} className="flex items-center w-full">
                            <Pencil className="mr-2 h-4 w-4" />
                            編輯
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteClick(card._id)}>
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
            <AlertDialogTitle>確定要刪除此卡牌嗎？</AlertDialogTitle>
            <AlertDialogDescription>此操作無法撤銷。這將永久刪除該卡牌及其所有相關數據。</AlertDialogDescription>
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

