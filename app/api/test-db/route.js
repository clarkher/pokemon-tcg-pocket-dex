import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/db/mongodb"

export async function GET() {
  try {
    // 連接數據庫
    await connectToDatabase()

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
    })
  } catch (error) {
    console.error("Database connection error:", error)
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

