import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/db/mongodb"

export async function GET() {
  try {
    // 連接數據庫
    await connectToDatabase()

    // 動態導入模型
    const { User } = require("@/lib/db/models")

    // 計算用戶數量
    const userCount = await User.countDocuments()

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      userCount,
    })
  } catch (error) {
    console.error("Database test error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

