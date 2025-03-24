import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/db/mongodb"
import { User } from "@/lib/db/models"
import { withAuth } from "@/lib/auth"

async function handleFavorite(req: NextRequest, userId: string, { params }: { params: { id: string } }) {
  try {
    // 連接到數據庫
    await connectToDatabase()

    const cardId = params.id
    const { action } = await req.json()

    if (action !== "favorite" && action !== "unfavorite") {
      return NextResponse.json({ error: "無效的操作" }, { status: 400 })
    }

    // 查找用戶
    const user = await User.findById(userId)

    if (!user) {
      return NextResponse.json({ error: "用戶不存在" }, { status: 404 })
    }

    // 如果用戶沒有 favoriteCards 字段，則創建一個
    if (!user.favoriteCards) {
      user.favoriteCards = []
    }

    if (action === "favorite") {
      // 檢查卡牌是否已經在收藏中
      if (!user.favoriteCards.includes(cardId)) {
        user.favoriteCards.push(cardId)
      }
    } else {
      // 從收藏中移除卡牌
      user.favoriteCards = user.favoriteCards.filter((id) => id.toString() !== cardId)
    }

    await user.save()

    return NextResponse.json({
      success: true,
      message: action === "favorite" ? "卡牌已加入收藏" : "卡牌已從收藏中移除",
    })
  } catch (error) {
    console.error("收藏操作錯誤:", error)
    return NextResponse.json({ error: "收藏操作過程中發生錯誤" }, { status: 500 })
  }
}

export const POST = withAuth(handleFavorite)

