// 牌組相關API路由

import { type NextRequest, NextResponse } from "next/server"

// 獲取牌組列表
export async function getDecks(req: NextRequest) {
  try {
    // 解析查詢參數
    const url = new URL(req.url)
    const page = Number.parseInt(url.searchParams.get("page") || "1")
    const limit = Number.parseInt(url.searchParams.get("limit") || "20")
    const mainEnergy = url.searchParams.get("mainEnergy")
    const search = url.searchParams.get("search")
    const sortBy = url.searchParams.get("sortBy") || "createdAt"
    const sortOrder = url.searchParams.get("sortOrder") || "desc"
    const userId = url.searchParams.get("userId")

    // 構建查詢條件
    // 實際應用中，這裡會根據查詢參數構建MongoDB查詢

    // 模擬牌組數據
    const decks = [
      {
        _id: "1",
        name: "皮卡丘之力",
        description: "以皮卡丘為核心的雷系牌組，搭配多種雷系寶可夢提供強大的攻擊力。",
        isPublic: true,
        mainEnergy: ["雷"],
        likes: ["user_1", "user_2", "user_3"],
        views: 1024,
        createdAt: new Date("2023-05-15"),
        updatedAt: new Date("2023-05-15"),
        createdBy: "user_123",
        creatorName: "小智",
      },
      {
        _id: "2",
        name: "水系策略",
        description: "利用水系寶可夢的特性，控制場上節奏並逐步累積優勢的牌組。",
        isPublic: true,
        mainEnergy: ["水"],
        likes: ["user_1", "user_2"],
        views: 876,
        createdAt: new Date("2023-06-22"),
        updatedAt: new Date("2023-06-22"),
        createdBy: "user_456",
        creatorName: "小霞",
      },
    ]

    // 模擬總數
    const total = 324

    return NextResponse.json({
      decks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("獲取牌組錯誤:", error)
    return NextResponse.json({ error: "獲取牌組過程中發生錯誤" }, { status: 500 })
  }
}

// 獲取單個牌組詳情
export async function getDeck(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // 查找牌組
    // 實際應用中，這裡會從數據庫查詢牌組

    // 模擬牌組數據
    const deck = {
      _id: id,
      name: "皮卡丘之力",
      description: "以皮卡丘為核心的雷系牌組，搭配多種雷系寶可夢提供強大的攻擊力。",
      isPublic: true,
      mainEnergy: ["雷"],
      cards: [
        {
          cardId: "1",
          count: 4,
          card: {
            _id: "1",
            name: "皮卡丘",
            attribute: "雷",
            type: "基本",
            imageUrl: "/placeholder.svg?height=300&width=215",
          },
        },
        {
          cardId: "6",
          count: 3,
          card: {
            _id: "6",
            name: "雷丘",
            attribute: "雷",
            type: "第一階段",
            imageUrl: "/placeholder.svg?height=300&width=215",
          },
        },
      ],
      energy: [
        { type: "electric", count: 20 },
        { type: "colorless", count: 10 },
      ],
      likes: ["user_1", "user_2", "user_3"],
      views: 1024,
      createdAt: new Date("2023-05-15"),
      updatedAt: new Date("2023-05-15"),
      createdBy: "user_123",
      creator: {
        _id: "user_123",
        username: "小智",
        avatar: "/placeholder.svg?height=128&width=128",
      },
      tags: ["競技", "初學者友好"],
    }

    if (!deck) {
      return NextResponse.json({ error: "牌組不存在" }, { status: 404 })
    }

    // 增加瀏覽量
    // 實際應用中，這裡會更新數據庫中的牌組瀏覽量

    return NextResponse.json(deck)
  } catch (error) {
    console.error("獲取牌組詳情錯誤:", error)
    return NextResponse.json({ error: "獲取牌組詳情過程中發生錯誤" }, { status: 500 })
  }
}

// 創建新牌組
export async function createDeck(req: NextRequest) {
  try {
    const deckData = await req.json()

    // 驗證數據
    if (!deckData.name || !deckData.cards || deckData.cards.length === 0) {
      return NextResponse.json({ error: "缺少必要的牌組信息" }, { status: 400 })
    }

    // 檢查牌組卡牌數量
    const totalCards =
      deckData.cards.reduce((total: number, card: any) => total + card.count, 0) +
      (deckData.energy ? deckData.energy.reduce((total: number, energy: any) => total + energy.count, 0) : 0)

    if (totalCards !== 60) {
      return NextResponse.json({ error: "牌組必須包含60張卡牌" }, { status: 400 })
    }

    // 創建新牌組
    // 實際應用中，這裡會將牌組保存到數據庫

    // 模擬創建結果
    const newDeck = {
      _id: "deck_" + Date.now(),
      ...deckData,
      likes: [],
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "user_123", // 應從JWT令牌中獲取
    }

    return NextResponse.json({
      message: "牌組創建成功",
      deck: newDeck,
    })
  } catch (error) {
    console.error("創建牌組錯誤:", error)
    return NextResponse.json({ error: "創建牌組過程中發生錯誤" }, { status: 500 })
  }
}

// 更新牌組
export async function updateDeck(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const updateData = await req.json()

    // 查找並更新牌組
    // 實際應用中，這裡會更新數據庫中的牌組

    // 模擬更新結果
    const updatedDeck = {
      _id: id,
      ...updateData,
      updatedAt: new Date(),
    }

    return NextResponse.json({
      message: "牌組更新成功",
      deck: updatedDeck,
    })
  } catch (error) {
    console.error("更新牌組錯誤:", error)
    return NextResponse.json({ error: "更新牌組過程中發生錯誤" }, { status: 500 })
  }
}

// 刪除牌組
export async function deleteDeck(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // 刪除牌組
    // 實際應用中，這裡會從數據庫刪除牌組

    return NextResponse.json({
      message: "牌組刪除成功",
    })
  } catch (error) {
    console.error("刪除牌組錯誤:", error)
    return NextResponse.json({ error: "刪除牌組過程中發生錯誤" }, { status: 500 })
  }
}

// 點讚/取消點讚牌組
export async function likeDeck(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const { action } = await req.json() // 'like' 或 'unlike'
    const userId = "user_123" // 應從JWT令牌中獲取

    // 更新牌組點讚狀態
    // 實際應用中，這裡會更新數據庫中的牌組點讚狀態

    return NextResponse.json({
      message: action === "like" ? "牌組點讚成功" : "取消牌組點讚成功",
    })
  } catch (error) {
    console.error("牌組點讚錯誤:", error)
    return NextResponse.json({ error: "牌組點讚過程中發生錯誤" }, { status: 500 })
  }
}

