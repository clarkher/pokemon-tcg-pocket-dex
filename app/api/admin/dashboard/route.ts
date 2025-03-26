import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/db/mongodb"
import { User, Card, Deck, Event, Post } from "@/lib/db/models"

export async function GET(request: NextRequest) {
  try {
    console.log("Admin dashboard API called")

    // 連接數據庫
    await connectToDatabase()
    console.log("Database connected")

    // 獲取用戶總數
    const totalUsers = await User.countDocuments()
    console.log("Total users:", totalUsers)

    // 獲取卡牌總數
    const totalCards = await Card.countDocuments()
    console.log("Total cards:", totalCards)

    // 獲取牌組總數
    const totalDecks = await Deck.countDocuments()
    console.log("Total decks:", totalDecks)

    // 獲取活動總數
    const totalEvents = await Event.countDocuments()
    console.log("Total events:", totalEvents)

    // 獲取帖子總數
    const totalPosts = await Post.countDocuments()
    console.log("Total posts:", totalPosts)

    // 獲取最近註冊的用戶
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select("username email avatar createdAt")
    console.log("Recent users fetched")

    // 獲取最近創建的活動
    const recentEvents = await Event.find().sort({ createdAt: -1 }).limit(5).populate("organizer", "username avatar")
    console.log("Recent events fetched")

    // 獲取最近創建的牌組
    const recentDecks = await Deck.find().sort({ createdAt: -1 }).limit(5).populate("author", "username avatar")
    console.log("Recent decks fetched")

    // 獲取最近創建的卡牌
    const recentCards = await Card.find().sort({ createdAt: -1 }).limit(5)
    console.log("Recent cards fetched")

    // 返回數據
    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalCards,
          totalDecks,
          totalEvents,
          totalPosts,
        },
        recentUsers,
        recentEvents,
        recentDecks,
        recentCards,
      },
    })
  } catch (error) {
    console.error("Admin dashboard error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

