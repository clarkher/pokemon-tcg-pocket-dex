import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/db/mongodb"
import { User } from "@/lib/db/models"
import { withAuth } from "@/lib/auth"

async function checkFavorite(req: NextRequest, userId: string, { params }: { params: { id: string } }) {
  try {
    // 連接到數據庫
    await connectToDatabase()

    const cardId = params.id

    // 查找用戶
    const user = await User.findById(userId)

    if (!user) {
      return NextResponse.json({ error: "用戶不存在" }, { status: 404 })
    }

    // 檢查卡牌是否在收藏中
    const isFavorite = user.favoriteCards && user.favoriteCards.some((id) => id.toString() === cardId)

    return NextResponse.json({ isFavorite: !!isFavorite })
  } catch (error) {
    console.error("檢查收藏狀態錯誤:", error)
    return NextResponse.json({ error: "檢查收藏狀態過程中發生錯誤" }, { status: 500 })
  }
}

export const GET = withAuth(checkFavorite)

