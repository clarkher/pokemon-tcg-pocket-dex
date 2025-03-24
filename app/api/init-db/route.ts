import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/db/mongodb"
import { User, Card } from "@/lib/db/models"

export async function GET() {
  try {
    // 連接到數據庫
    await connectToDatabase()

    // 檢查是否已有管理員用戶
    const adminExists = await User.findOne({ isAdmin: true })

    let adminUser

    if (!adminExists) {
      // 創建管理員用戶
      adminUser = new User({
        username: "admin",
        email: "admin@example.com",
        password: "admin123", // 在實際應用中應使用更強的密碼
        isAdmin: true,
        status: "active",
      })

      await adminUser.save()
    }

    // 檢查是否已有示例卡牌
    const cardsCount = await Card.countDocuments()

    if (cardsCount === 0) {
      // 添加一些示例卡牌
      const sampleCards = [
        {
          name: "皮卡丘",
          nameEn: "Pikachu",
          attribute: "雷",
          rarity: "普通",
          series: "基本系列",
          expansion: "基本",
          type: "基本",
          cardNumber: "58/102",
          releaseDate: new Date("1999-01-09"),
          imageUrl: "/placeholder.svg?height=300&width=215",
          createdBy: adminExists ? adminExists._id : adminUser?._id,
        },
        {
          name: "噴火龍",
          nameEn: "Charizard",
          attribute: "火",
          rarity: "稀有閃卡",
          series: "基本系列",
          expansion: "基本",
          type: "第二階段",
          cardNumber: "4/102",
          releaseDate: new Date("1999-01-09"),
          imageUrl: "/placeholder.svg?height=300&width=215",
          createdBy: adminExists ? adminExists._id : adminUser?._id,
        },
      ]

      await Card.insertMany(sampleCards)
    }

    return NextResponse.json({
      success: true,
      message: "數據庫初始化成功",
    })
  } catch (error) {
    console.error("數據庫初始化錯誤:", error)
    return NextResponse.json(
      {
        success: false,
        error: "數據庫初始化失敗",
      },
      { status: 500 },
    )
  }
}

