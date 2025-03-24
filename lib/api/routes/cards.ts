// 卡牌相關API路由

import { type NextRequest, NextResponse } from "next/server"

// 獲取卡牌列表
export async function getCards(req: NextRequest) {
  try {
    // 解析查詢參數
    const url = new URL(req.url)
    const page = Number.parseInt(url.searchParams.get("page") || "1")
    const limit = Number.parseInt(url.searchParams.get("limit") || "20")
    const attribute = url.searchParams.get("attribute")
    const rarity = url.searchParams.get("rarity")
    const series = url.searchParams.get("series")
    const expansion = url.searchParams.get("expansion")
    const search = url.searchParams.get("search")

    // 構建查詢條件
    // 實際應用中，這裡會根據查詢參數構建MongoDB查詢

    // 模擬卡牌數據
    const cards = [
      {
        _id: "1",
        name: "皮卡丘",
        nameEn: "Pikachu",
        attribute: "雷",
        rarity: "普通",
        series: "基本系列",
        expansion: "基本",
        type: "基本",
        cardNumber: "58/102",
        imageUrl: "/placeholder.svg?height=300&width=215",
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "admin",
      },
      {
        _id: "2",
        name: "噴火龍",
        nameEn: "Charizard",
        attribute: "火",
        rarity: "稀有閃卡",
        series: "基本系列",
        expansion: "基本",
        type: "第二階段",
        cardNumber: "4/102",
        imageUrl: "/placeholder.svg?height=300&width=215",
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "admin",
      },
    ]

    // 模擬總數
    const total = 1254

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

// 獲取單張卡牌詳情
export async function getCard(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // 查找卡牌
    // 實際應用中，這裡會從數據庫查詢卡牌

    // 模擬卡牌數據
    const card = {
      _id: id,
      name: "皮卡丘",
      nameEn: "Pikachu",
      attribute: "雷",
      rarity: "普通",
      series: "基本系列",
      expansion: "基本",
      hp: 60,
      type: "基本",
      cardNumber: "58/102",
      releaseDate: new Date("1999-01-09"),
      imageUrl: "/placeholder.svg?height=400&width=286",
      attacks: [
        {
          name: "電光一閃",
          cost: ["無色"],
          damage: "10",
          description: "無特殊效果。",
        },
        {
          name: "十萬伏特",
          cost: ["雷", "雷", "無色"],
          damage: "60",
          description: "擲硬幣一次，如果是反面，則對自己造成30點傷害。",
        },
      ],
      weaknesses: [
        {
          type: "格鬥",
          value: "×2",
        },
      ],
      retreatCost: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "admin",
    }

    if (!card) {
      return NextResponse.json({ error: "卡牌不存在" }, { status: 404 })
    }

    return NextResponse.json(card)
  } catch (error) {
    console.error("獲取卡牌詳情錯誤:", error)
    return NextResponse.json({ error: "獲取卡牌詳情過程中發生錯誤" }, { status: 500 })
  }
}

// 創建新卡牌
export async function createCard(req: NextRequest) {
  try {
    const cardData = await req.json()

    // 驗證數據
    if (!cardData.name || !cardData.attribute || !cardData.cardNumber) {
      return NextResponse.json({ error: "缺少必要的卡牌信息" }, { status: 400 })
    }

    // 創建新卡牌
    // 實際應用中，這裡會將卡牌保存到數據庫

    // 模擬創建結果
    const newCard = {
      _id: "card_" + Date.now(),
      ...cardData,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "user_123", // 應從JWT令牌中獲取
    }

    return NextResponse.json({
      message: "卡牌創建成功",
      card: newCard,
    })
  } catch (error) {
    console.error("創建卡牌錯誤:", error)
    return NextResponse.json({ error: "創建卡牌過程中發生錯誤" }, { status: 500 })
  }
}

// 更新卡牌
export async function updateCard(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const updateData = await req.json()

    // 查找並更新卡牌
    // 實際應用中，這裡會更新數據庫中的卡牌

    // 模擬更新結果
    const updatedCard = {
      _id: id,
      ...updateData,
      updatedAt: new Date(),
    }

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
export async function deleteCard(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // 刪除卡牌
    // 實際應用中，這裡會從數據庫刪除卡牌

    return NextResponse.json({
      message: "卡牌刪除成功",
    })
  } catch (error) {
    console.error("刪除卡牌錯誤:", error)
    return NextResponse.json({ error: "刪除卡牌過程中發生錯誤" }, { status: 500 })
  }
}

