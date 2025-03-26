import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/db/mongodb"
import bcryptjs from "bcryptjs"

export async function GET() {
  try {
    console.log("Initializing admin account...")

    // 連接數據庫
    await connectToDatabase()
    console.log("Database connected")

    // 動態導入模型
    const models = require("@/lib/db/models")
    const User = models.User

    if (!User) {
      console.error("User model not found")
      return NextResponse.json(
        {
          success: false,
          message: "User model not found",
        },
        { status: 500 },
      )
    }

    // 檢查是否已存在管理員
    const existingAdmin = await User.findOne({ isAdmin: true })
    if (existingAdmin) {
      console.log("Admin already exists")
      return NextResponse.json({
        success: true,
        message: "Admin already exists",
        admin: {
          username: existingAdmin.username,
          email: existingAdmin.email,
          id: existingAdmin._id,
        },
      })
    }

    // 創建管理員帳戶
    const hashedPassword = await bcryptjs.hash("admin123", 10)
    const admin = new User({
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
      isAdmin: true,
    })

    await admin.save()
    console.log("Admin created successfully")

    return NextResponse.json({
      success: true,
      message: "Admin created successfully",
      admin: {
        username: admin.username,
        email: admin.email,
        id: admin._id,
      },
    })
  } catch (error) {
    console.error("Error creating admin:", error)
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

