import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/db/mongodb"

export async function GET() {
  try {
    // 嘗試連接到數據庫
    const mongoose = await connectToDatabase()

    return NextResponse.json({
      success: true,
      message: "成功連接到 MongoDB 數據庫",
      version: mongoose.version,
    })
  } catch (error) {
    console.error("數據庫連接錯誤:", error)
    return NextResponse.json(
      {
        success: false,
        error: "無法連接到數據庫",
      },
      { status: 500 },
    )
  }
}

