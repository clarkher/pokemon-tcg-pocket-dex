import { type NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import connectToDatabase from "@/lib/db/mongodb"
import User from "@/lib/db/models/user.model"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    await connectToDatabase()

    // 查找管理員用戶
    const admin = await User.findOne({ username, isAdmin: true })
    if (!admin) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }

    // 驗證密碼
    const isMatch = await bcryptjs.compare(password, admin.password)
    if (!isMatch) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }

    // 生成 JWT 令牌
    const token = jwt.sign(
      {
        userId: admin._id,
        username: admin.username,
        email: admin.email,
        isAdmin: true,
      },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "1d" },
    )

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
      },
    })
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

