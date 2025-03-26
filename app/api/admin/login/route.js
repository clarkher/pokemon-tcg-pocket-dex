import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/db/mongodb"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(req) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 },
      )
    }

    // 連接數據庫
    await connectToDatabase()

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

    // 查找用戶
    const user = await User.findOne({ email })

    if (!user || !user.isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials or not an admin",
        },
        { status: 401 },
      )
    }

    // 驗證密碼
    const isMatch = await bcryptjs.compare(password, user.password)
    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        { status: 401 },
      )
    }

    // 更新最後登錄時間
    user.lastLogin = new Date()
    await user.save()

    // 生成 JWT
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" },
    )

    return NextResponse.json({
      success: true,
      token,
      admin: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    })
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

