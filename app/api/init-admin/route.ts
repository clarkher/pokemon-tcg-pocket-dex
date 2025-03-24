import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/db/mongodb"
import { User } from "@/lib/db/models"
import bcrypt from "bcrypt"

export async function GET() {
  try {
    // 連接到數據庫
    await connectToDatabase()

    // 檢查是否已有管理員用戶
    const adminExists = await User.findOne({ isAdmin: true })

    if (adminExists) {
      return NextResponse.json({
        success: true,
        message: "管理員用戶已存在",
        admin: {
          username: adminExists.username,
          email: adminExists.email,
        },
      })
    }

    // 創建管理員密碼
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash("admin123", salt)

    // 創建管理員用戶
    const adminUser = new User({
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
      isAdmin: true,
      status: "active",
      followers: [],
      following: [],
    })

    await adminUser.save()

    return NextResponse.json({
      success: true,
      message: "管理員用戶創建成功",
      admin: {
        username: adminUser.username,
        email: adminUser.email,
        password: "admin123", // 僅用於開發環境
      },
    })
  } catch (error) {
    console.error("創建管理員用戶錯誤:", error)
    return NextResponse.json(
      {
        success: false,
        error: "創建管理員用戶失敗",
      },
      { status: 500 },
    )
  }
}

