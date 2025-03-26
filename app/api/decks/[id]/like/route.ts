import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/db/mongodb"
import { Deck, Notification } from "@/lib/db/models"
import { withAuth } from "@/lib/auth"

async function handleLike(req: NextRequest, userId: string, { params }: { params: { id: string } }) {
  try {
    // 連接到數據庫
    await connectToDatabase()

    const deckId = params.id
    const { action } = await req.json()

    if (action !== "like" && action !== "unlike") {
      return NextResponse.json({ error: "無效的操作" }, { status: 400 })
    }

    // 查找牌組
    const deck = await Deck.findById(deckId)

    if (!deck) {
      return NextResponse.json({ error: "牌組不存在" }, { status: 404 })
    }

    if (action === "like") {
      // 檢查用戶是否已點讚
      if (!deck.likes.includes(userId)) {
        deck.likes.push(userId)

        // 如果不是自己的牌組，創建通知
        if (deck.createdBy.toString() !== userId) {
          const notification = new Notification({
            type: "like",
            message: "有人點讚了您的牌組",
            targetType: "deck",
            targetId: deckId,
            userId: deck.createdBy,
            triggeredBy: userId,
          })

          await notification.save()
        }
      }
    } else {
      // 取消點讚
      deck.likes = deck.likes.filter((id) => id.toString() !== userId)
    }

    await deck.save()

    return NextResponse.json({
      success: true,
      message: action === "like" ? "牌組點讚成功" : "取消牌組點讚成功",
      likesCount: deck.likes.length,
    })
  } catch (error) {
    console.error("點讚操作錯誤:", error)
    return NextResponse.json({ error: "點讚操作過程中發生錯誤" }, { status: 500 })
  }
}

export const POST = withAuth(handleLike)

