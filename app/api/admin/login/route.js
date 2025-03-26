import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/db/mongodb"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(req) {
  try {
    const { email, password } = await req.json()

    // 驗證輸入
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

    // 動態導入 User 模型
    const { User } = require("@/lib/db/models")

    // 查找用戶
    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        { status: 401 },
      )
    }

    // 檢查是否為管理員
    if (!user.isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required",
        },
        { status: 403 },
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

    // 創建 JWT
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    )

    // 返回成功響應
    return NextResponse.json({
      success: true,
      message: "Login successful",
      token,
      user: {
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
        message: "Login failed",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

