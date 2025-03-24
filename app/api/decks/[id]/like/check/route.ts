import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/db/mongodb"
import { Deck } from "@/lib/db/models"
import { withAuth } from "@/lib/auth"

async function checkLike(req: NextRequest, userId: string, { params }: { params: { id: string } }) {
  try {
    // 連接到數據庫
    await connectToDatabase()

    const deckId = params.id

    // 查找牌組
    const deck = await Deck.findById(deckId)

    if (!deck) {
      return NextResponse.json({ error: "牌組不存在" }, { status: 404 })
    }

    // 檢查用戶是否已點讚
    const isLiked = deck.likes.includes(userId)

    return NextResponse.json({ isLiked })
  } catch (error) {
    console.error("檢查點讚狀態錯誤:", error)
    return NextResponse.json({ error: "檢查點讚狀態過程中發生錯誤" }, { status: 500 })
  }
}

export const GET = withAuth(checkLike)

