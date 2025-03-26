import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/db/mongodb"
import { User, Card } from "@/lib/db/models"
import { withAuth } from "@/lib/auth"

async function getFavoriteCards(req: NextRequest, userId: string) {
  try {
    // 連接到數據庫
    await connectToDatabase()

    // 查找用戶
    const user = await User.findById(userId)

    if (!user) {
      return NextResponse.json({ error: "用戶不存在" }, { status: 404 })
    }

    // 如果用戶沒有收藏卡牌
    if (!user.favoriteCards || user.favoriteCards.length === 0) {
      return NextResponse.json({ cards: [] })
    }

    // 獲取收藏的卡牌
    const cards = await Card.find({ _id: { $in: user.favoriteCards } })

    return NextResponse.json({ cards })
  } catch (error) {
    console.error("獲取收藏卡牌錯誤:", error)
    return NextResponse.json({ error: "獲取收藏卡牌過程中發生錯誤" }, { status: 500 })
  }
}

export const GET = withAuth(getFavoriteCards)

