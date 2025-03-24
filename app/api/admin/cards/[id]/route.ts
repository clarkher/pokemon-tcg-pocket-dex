import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/db/mongodb"
import { Card } from "@/lib/db/models"
import { withAdmin } from "@/lib/auth"

// 獲取單個卡牌詳情
async function getCard(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 連接到數據庫
    await connectToDatabase()

    const id = params.id

    // 查找卡牌
    const card = await Card.findById(id).populate("createdBy", "username")

    if (!card) {
      return NextResponse.json({ error: "卡牌不存在" }, { status: 404 })
    }

    return NextResponse.json(card)
  } catch (error) {
    console.error("獲取卡牌詳情錯誤:", error)
    return NextResponse.json({ error: "獲取卡牌詳情過程中發生錯誤" }, { status: 500 })
  }
}

// 更新卡牌
async function updateCard(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 連接到數據庫
    await connectToDatabase()

    const id = params.id
    const updateData = await req.json()

    // 查找卡牌
    const card = await Card.findById(id)

    if (!card) {
      return NextResponse.json({ error: "卡牌不存在" }, { status: 404 })
    }

    // 更新卡牌
    const updatedCard = await Card.findByIdAndUpdate(id, { $set: updateData }, { new: true })

    return NextResponse.json({
      message: "卡牌更新成功",
      card: updatedCard,
    })
  } catch (error) {
    console.error("更新卡牌錯誤:", error)
    return NextResponse.json({ error: "更新卡牌過程中發生錯誤" }, { status: 500 })
  }
}

// 刪除卡牌
async function deleteCard(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 連接到數據庫
    await connectToDatabase()

    const id = params.id

    // 查找卡牌
    const card = await Card.findById(id)

    if (!card) {
      return NextResponse.json({ error: "卡牌不存在" }, { status: 404 })
    }

    // 刪除卡牌
    await Card.findByIdAndDelete(id)

    return NextResponse.json({
      message: "卡牌刪除成功",
    })
  } catch (error) {
    console.error("刪除卡牌錯誤:", error)
    return NextResponse.json({ error: "刪除卡牌過程中發生錯誤" }, { status: 500 })
  }
}

export const GET = withAdmin((req, { params }) => getCard(req, { params }))
export const PUT = withAdmin((req, { params }) => updateCard(req, { params }))
export const DELETE = withAdmin((req, { params }) => deleteCard(req, { params }))

