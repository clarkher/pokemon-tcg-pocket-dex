import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/db/mongodb"

export async function GET() {
  try {
    // 連接數據庫
    await connectToDatabase()

    // 動態導入模型
    const models = require("@/lib/db/models")

    // 檢查模型是否存在
    const modelNames = Object.keys(models)

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      models: modelNames,
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

