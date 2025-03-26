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
    const { User } = require("@/lib/db/models")

    // 查找管理員用戶
    const admin = await User.findOne({ email, isAdmin: true })
    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials or not an admin",
        },
        { status: 401 },
      )
    }

    // 驗證密碼
    const isMatch = await bcryptjs.compare(password, admin.password)
    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        { status: 401 },
      )
    }

    // 生成 JWT
    const token = jwt.sign(
      {
        userId: admin._id,
        email: admin.email,
        username: admin.username,
        isAdmin: admin.isAdmin,
      },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" },
    )

    // 更新最後登錄時間
    admin.lastLogin = new Date()
    await admin.save()

    return NextResponse.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        isAdmin: admin.isAdmin,
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

