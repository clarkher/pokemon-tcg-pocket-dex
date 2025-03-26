import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/db/mongodb"
import bcryptjs from "bcryptjs"

export async function GET() {
  try {
    // 連接數據庫
    await connectToDatabase()

    // 動態導入 User 模型
    const { User } = require("@/lib/db/models")

    // 檢查是否已存在管理員
    const adminExists = await User.findOne({ isAdmin: true })

    if (adminExists) {
      return NextResponse.json({
        success: true,
        message: "Admin account already exists",
        admin: {
          id: adminExists._id,
          email: adminExists.email,
          username: adminExists.username,
        },
      })
    }

    // 創建管理員密碼
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash("admin123", salt)

    // 創建管理員帳戶
    const admin = new User({
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
      isAdmin: true,
    })

    await admin.save()

    // 返回成功響應
    return NextResponse.json({
      success: true,
      message: "Admin account created successfully",
      admin: {
        id: admin._id,
        email: admin.email,
        username: admin.username,
      },
    })
  } catch (error) {
    console.error("Init admin error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create admin account",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

