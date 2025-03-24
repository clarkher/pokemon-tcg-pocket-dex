import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/db/mongodb"
import { User, Card, Deck, Event, Post } from "@/lib/db/models"
import { withAdmin } from "@/lib/auth"

async function getDashboardData(req: NextRequest) {
  try {
    // 連接到數據庫
    await connectToDatabase()

    // 獲取各種統計數據
    const usersCount = await User.countDocuments()
    const cardsCount = await Card.countDocuments()
    const decksCount = await Deck.countDocuments()
    const eventsCount = await Event.countDocuments()
    const postsCount = await Post.countDocuments()

    // 獲取活躍用戶數（過去30天有登入的用戶）
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const activeUsersCount = await User.countDocuments({
      lastLogin: { $gte: thirtyDaysAgo },
    })

    // 獲取進行中的活動數
    const activeEventsCount = await Event.countDocuments({
      status: "active",
    })

    // 獲取最近註冊的用戶
    const recentUsers = await User.find().select("username avatar createdAt").sort({ createdAt: -1 }).limit(5)

    // 獲取最近創建的牌組
    const recentDecks = await Deck.find()
      .select("name mainEnergy createdAt")
      .populate("createdBy", "username")
      .sort({ createdAt: -1 })
      .limit(5)

    // 獲取最近創建的卡牌
    const recentCards = await Card.find().select("name attribute rarity createdAt").sort({ createdAt: -1 }).limit(5)

    // 獲取月度統計數據（過去6個月）
    const monthlyStats = []
    const now = new Date()

    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)

      const monthName = month.toLocaleString("zh-TW", { month: "long" })

      const newUsers = await User.countDocuments({
        createdAt: { $gte: month, $lt: nextMonth },
      })

      const newCards = await Card.countDocuments({
        createdAt: { $gte: month, $lt: nextMonth },
      })

      const newDecks = await Deck.countDocuments({
        createdAt: { $gte: month, $lt: nextMonth },
      })

      monthlyStats.push({
        name: monthName,
        users: newUsers,
        cards: newCards,
        decks: newDecks,
      })
    }

    return NextResponse.json({
      counts: {
        users: usersCount,
        activeUsers: activeUsersCount,
        cards: cardsCount,
        decks: decksCount,
        events: eventsCount,
        activeEvents: activeEventsCount,
        posts: postsCount,
      },
      recent: {
        users: recentUsers,
        decks: recentDecks,
        cards: recentCards,
      },
      monthlyStats,
    })
  } catch (error) {
    console.error("獲取儀表板數據錯誤:", error)
    return NextResponse.json({ error: "獲取儀表板數據過程中發生錯誤" }, { status: 500 })
  }
}

export const GET = withAdmin(getDashboardData)

