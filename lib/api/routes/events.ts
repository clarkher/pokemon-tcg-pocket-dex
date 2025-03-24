// 活動相關API路由

import { type NextRequest, NextResponse } from "next/server"

// 獲取活動列表
export async function getEvents(req: NextRequest) {
  try {
    // 解析查詢參數
    const url = new URL(req.url)
    const page = Number.parseInt(url.searchParams.get("page") || "1")
    const limit = Number.parseInt(url.searchParams.get("limit") || "20")
    const status = url.searchParams.get("status")
    const type = url.searchParams.get("type")
    const search = url.searchParams.get("search")

    // 構建查詢條件
    // 實際應用中，這裡會根據查詢參數構建MongoDB查詢

    // 模擬活動數據
    const events = [
      {
        _id: "1",
        title: "真新鎮錦標賽",
        type: "特級護照",
        startDate: new Date("2023-10-15"),
        endDate: new Date("2023-10-20"),
        status: "active",
        location: "真新鎮寶可夢中心",
        organizer: "寶可夢聯盟",
        description: "一年一度的真新鎮錦標賽，歡迎所有訓練家參加。優勝者將獲得限定卡牌和獎品。",
        imageUrl: "/placeholder.svg?height=400&width=800",
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "admin",
      },
      {
        _id: "2",
        title: "華藍市水系挑戰",
        type: "任務",
        startDate: new Date("2023-11-05"),
        endDate: new Date("2023-11-10"),
        status: "upcoming",
        location: "華藍道館",
        organizer: "小霞",
        description: "專為水系寶可夢愛好者設計的特別挑戰，完成任務可獲得稀有水系卡牌。",
        imageUrl: "/placeholder.svg?height=400&width=800",
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "admin",
      },
    ]

    // 模擬總數
    const total = 12

    return NextResponse.json({
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("獲取活動錯誤:", error)
    return NextResponse.json({ error: "獲取活動過程中發生錯誤" }, { status: 500 })
  }
}

// 獲取單個活動詳情
export async function getEvent(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // 查找活動
    // 實際應用中，這裡會從數據庫查詢活動

    // 模擬活動數據
    const event = {
      _id: id,
      title: "真新鎮錦標賽",
      type: "特級護照",
      startDate: new Date("2023-10-15"),
      endDate: new Date("2023-10-20"),
      status: "active",
      location: "真新鎮寶可夢中心",
      organizer: "寶可夢聯盟",
      description:
        "一年一度的真新鎮錦標賽，歡迎所有訓練家參加。優勝者將獲得限定卡牌和獎品。本次比賽將採用最新的規則集，參賽者需要準備符合規定的60張卡牌牌組。比賽分為初級組、中級組和高級組，根據參賽者的經驗和技術水平進行分組。",
      imageUrl: "/placeholder.svg?height=400&width=800",
      rules: [
        "參賽者需攜帶有效的訓練家ID",
        "牌組必須包含60張卡牌",
        "禁止使用超夢EX和夢幻EX卡牌",
        "每位參賽者最多可攜帶2個牌組",
        "比賽採用瑞士輪賽制，最終決賽採用單淘汰賽制",
      ],
      prizes: [
        "冠軍：限定版噴火龍EX卡牌一張，寶可夢聯盟獎盃一座",
        "亞軍：限定版皮卡丘V卡牌一張，寶可夢聯盟獎牌一枚",
        "季軍：寶可夢卡牌補充包10包",
        "參與獎：寶可夢聯盟徽章一枚",
      ],
      participants: ["user_1", "user_2", "user_3"],
      registrationDeadline: new Date("2023-10-14"),
      registrationFee: "免費",
      contactPerson: "大木博士",
      contactEmail: "prof.oak@pokemon-league.com",
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "admin",
    }

    if (!event) {
      return NextResponse.json({ error: "活動不存在" }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error("獲取活動詳情錯誤:", error)
    return NextResponse.json({ error: "獲取活動詳情過程中發生錯誤" }, { status: 500 })
  }
}

// 創建新活動
export async function createEvent(req: NextRequest) {
  try {
    const eventData = await req.json()

    // 驗證數據
    if (!eventData.title || !eventData.startDate || !eventData.endDate) {
      return NextResponse.json({ error: "缺少必要的活動信息" }, { status: 400 })
    }

    // 創建新活動
    // 實際應用中，這裡會將活動保存到數據庫

    // 模擬創建結果
    const newEvent = {
      _id: "event_" + Date.now(),
      ...eventData,
      participants: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "user_123", // 應從JWT令牌中獲取
    }

    return NextResponse.json({
      message: "活動創建成功",
      event: newEvent,
    })
  } catch (error) {
    console.error("創建活動錯誤:", error)
    return NextResponse.json({ error: "創建活動過程中發生錯誤" }, { status: 500 })
  }
}

// 更新活動
export async function updateEvent(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const updateData = await req.json()

    // 查找並更新活動
    // 實際應用中，這裡會更新數據庫中的活動

    // 模擬更新結果
    const updatedEvent = {
      _id: id,
      ...updateData,
      updatedAt: new Date(),
    }

    return NextResponse.json({
      message: "活動更新成功",
      event: updatedEvent,
    })
  } catch (error) {
    console.error("更新活動錯誤:", error)
    return NextResponse.json({ error: "更新活動過程中發生錯誤" }, { status: 500 })
  }
}

// 刪除活動
export async function deleteEvent(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // 刪除活動
    // 實際應用中，這裡會從數據庫刪除活動

    return NextResponse.json({
      message: "活動刪除成功",
    })
  } catch (error) {
    console.error("刪除活動錯誤:", error)
    return NextResponse.json({ error: "刪除活動過程中發生錯誤" }, { status: 500 })
  }
}

// 報名參加活動
export async function registerEvent(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const userId = "user_123" // 應從JWT令牌中獲取

    // 更新活動參與者
    // 實際應用中，這裡會更新數據庫中的活動參與者

    return NextResponse.json({
      message: "活動報名成功",
    })
  } catch (error) {
    console.error("活動報名錯誤:", error)
    return NextResponse.json({ error: "活動報名過程中發生錯誤" }, { status: 500 })
  }
}

