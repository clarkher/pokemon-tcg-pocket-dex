import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/db/mongodb"
import { Card } from "@/lib/db/models"
import { withAdmin } from "@/lib/auth"

async function getCards(req: NextRequest) {
  try {
    // 連接到數據庫
    await connectToDatabase()

    // 解析查詢參數
    const url = new URL(req.url)
    const page = Number.parseInt(url.searchParams.get("page") || "1")
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")
    const search = url.searchParams.get("search") || ""
    const attribute = url.searchParams.get("attribute")
    const rarity = url.searchParams.get("rarity")
    const series = url.searchParams.get("series")

    // 構建查詢條件
    const query: any = {}

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { nameEn: { $regex: search, $options: "i" } },
        { cardNumber: { $regex: search, $options: "i" } },
      ]
    }

    if (attribute) {
      query.attribute = attribute
    }

    if (rarity) {
      query.rarity = rarity
    }

    if (series) {
      query.series = series
    }

    // 計算跳過的文檔數
    const skip = (page - 1) * limit

    // 查詢卡牌
    const cards = await Card.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "username")

    // 計算總數
    const total = await Card.countDocuments(query)

    return NextResponse.json({
      cards,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("獲取卡牌錯誤:", error)
    return NextResponse.json({ error: "獲取卡牌過程中發生錯誤" }, { status: 500 })
  }
}

async function createCard(req: NextRequest) {
  try {
    // 連接到數據庫
    await connectToDatabase()

    // 獲取卡牌數據
    const cardData = await req.json()

    // 驗證必要字段
    if (!cardData.name || !cardData.nameEn || !cardData.attribute || !cardData.cardNumber) {
      return NextResponse.json({ error: "缺少必要的卡牌信息" }, { status: 400 })
    }

    // 創建新卡牌
    const newCard = new Card(cardData)
    await newCard.save()

    return NextResponse.json({
      message: "卡牌創建成功",
      card: newCard,
    })
  } catch (error) {
    console.error("創建卡牌錯誤:", error)
    return NextResponse.json({ error: "創建卡牌過程中發生錯誤" }, { status: 500 })
  }
}

export const GET = withAdmin(getCards)
export const POST = withAdmin(createCard)

