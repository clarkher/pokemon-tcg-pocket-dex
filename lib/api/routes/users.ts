// 用戶相關API路由

import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"

// 獲取用戶列表（僅管理員可用）
export async function getUsers(req: NextRequest) {
  try {
    // 解析查詢參數
    const url = new URL(req.url)
    const page = Number.parseInt(url.searchParams.get("page") || "1")
    const limit = Number.parseInt(url.searchParams.get("limit") || "20")
    const search = url.searchParams.get("search")
    const status = url.searchParams.get("status")

    // 構建查詢條件
    // 實際應用中，這裡會根據查詢參數構建MongoDB查詢

    // 模擬用戶數據
    const users = [
      {
        _id: "user_123",
        username: "小智",
        email: "ash@pokemon.com",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "active",
        isAdmin: false,
        createdAt: new Date("2023-01-15"),
        decksCount: 12,
        followersCount: 156,
        followingCount: 89,
      },
      {
        _id: "user_456",
        username: "小霞",
        email: "misty@pokemon.com",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "active",
        isAdmin: false,
        createdAt: new Date("2023-02-22"),
        decksCount: 8,
        followersCount: 123,
        followingCount: 67,
      },
      {
        _id: "user_789",
        username: "小剛",
        email: "brock@pokemon.com",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "active",
        isAdmin: false,
        createdAt: new Date("2023-03-10"),
        decksCount: 5,
        followersCount: 98,
        followingCount: 45,
      },
    ]

    // 模擬總數
    const total = 573

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("獲取用戶錯誤:", error)
    return NextResponse.json({ error: "獲取用戶過程中發生錯誤" }, { status: 500 })
  }
}

// 獲取單個用戶詳情
export async function getUser(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // 查找用戶
    // 實際應用中，這裡會從數據庫查詢用戶

    // 模擬用戶數據
    const user = {
      _id: id,
      username: "小智",
      email: "ash@pokemon.com",
      avatar: "/placeholder.svg?height=128&width=128",
      bio: "熱愛寶可夢卡牌遊戲的訓練家，專注於雷系和火系牌組。希望能與更多訓練家交流學習！",
      location: "真新鎮",
      favoriteType: "雷",
      status: "active",
      isAdmin: false,
      createdAt: new Date("2023-01-15"),
      decksCount: 12,
      followersCount: 156,
      followingCount: 89,
    }

    if (!user) {
      return NextResponse.json({ error: "用戶不存在" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("獲取用戶詳情錯誤:", error)
    return NextResponse.json({ error: "獲取用戶詳情過程中發生錯誤" }, { status: 500 })
  }
}

// 更新用戶資料
export async function updateUser(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const updateData = await req.json()

    // 檢查是否有權限更新
    // 實際應用中，這裡會檢查JWT令牌中的用戶ID是否與要更新的用戶ID匹配，或者是否為管理員

    // 如果更新包含密碼，則需要加密
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10)
      updateData.password = await bcrypt.hash(updateData.password, salt)
    }

    // 查找並更新用戶
    // 實際應用中，這裡會更新數據庫中的用戶

    // 模擬更新結果
    const updatedUser = {
      _id: id,
      ...updateData,
      updatedAt: new Date(),
    }

    return NextResponse.json({
      message: "用戶資料更新成功",
      user: updatedUser,
    })
  } catch (error) {
    console.error("更新用戶錯誤:", error)
    return NextResponse.json({ error: "更新用戶過程中發生錯誤" }, { status: 500 })
  }
}

// 刪除用戶（僅管理員可用）
export async function deleteUser(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // 檢查是否有權限刪除
    // 實際應用中，這裡會檢查JWT令牌中的用戶是否為管理員

    // 刪除用戶
    // 實際應用中，這裡會從數據庫刪除用戶

    return NextResponse.json({
      message: "用戶刪除成功",
    })
  } catch (error) {
    console.error("刪除用戶錯誤:", error)
    return NextResponse.json({ error: "刪除用戶過程中發生錯誤" }, { status: 500 })
  }
}

// 關注/取消關注用戶
export async function followUser(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const targetUserId = params.id
    const { action } = await req.json() // 'follow' 或 'unfollow'
    const userId = "user_123" // 應從JWT令牌中獲取

    // 更新關注狀態
    // 實際應用中，這裡會更新數據庫中的用戶關注狀態

    return NextResponse.json({
      message: action === "follow" ? "關注成功" : "取消關注成功",
    })
  } catch (error) {
    console.error("關注用戶錯誤:", error)
    return NextResponse.json({ error: "關注用戶過程中發生錯誤" }, { status: 500 })
  }
}

// 獲取用戶的牌組
export async function getUserDecks(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id

    // 查找用戶的牌組
    // 實際應用中，這裡會從數據庫查詢用戶的牌組

    // 模擬牌組數據
    const decks = [
      {
        _id: "1",
        name: "皮卡丘之力",
        description: "以皮卡丘為核心的雷系牌組，搭配多種雷系寶可夢提供強大的攻擊力。",
        isPublic: true,
        mainEnergy: ["雷"],
        likes: 245,
        views: 1024,
        createdAt: new Date("2023-05-15"),
        updatedAt: new Date("2023-05-15"),
      },
      {
        _id: "4",
        name: "噴火龍燃燒",
        description: "以噴火龍為核心的火系牌組，擁有極高的爆發力和破壞力。",
        isPublic: true,
        mainEnergy: ["火"],
        likes: 312,
        views: 1542,
        createdAt: new Date("2023-08-05"),
        updatedAt: new Date("2023-08-05"),
      },
    ]

    return NextResponse.json(decks)
  } catch (error) {
    console.error("獲取用戶牌組錯誤:", error)
    return NextResponse.json({ error: "獲取用戶牌組過程中發生錯誤" }, { status: 500 })
  }
}

// 獲取用戶的收藏卡牌
export async function getUserFavoriteCards(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id

    // 查找用戶的收藏卡牌
    // 實際應用中，這裡會從數據庫查詢用戶的收藏卡牌

    // 模擬卡牌數據
    const cards = [
      {
        _id: "1",
        name: "皮卡丘",
        attribute: "雷",
        rarity: "普通",
        imageUrl: "/placeholder.svg?height=300&width=215",
      },
      {
        _id: "2",
        name: "噴火龍",
        attribute: "火",
        rarity: "稀有閃卡",
        imageUrl: "/placeholder.svg?height=300&width=215",
      },
    ]

    return NextResponse.json(cards)
  } catch (error) {
    console.error("獲取用戶收藏卡牌錯誤:", error)
    return NextResponse.json({ error: "獲取用戶收藏卡牌過程中發生錯誤" }, { status: 500 })
  }
}

