import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/db/mongodb"
import jwt from "jsonwebtoken"

export async function POST(req) {
  try {
    const { username, email, password } = await req.json()

    if (!username || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Username, email, and password are required",
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

    // 檢查用戶是否已存在
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          {
            success: false,
            message: "Email already in use",
          },
          { status: 400 },
        )
      }
      if (existingUser.username === username) {
        return NextResponse.json(
          {
            success: false,
            message: "Username already taken",
          },
          { status: 400 },
        )
      }
    }

    // 創建新用戶
    const newUser = new User({
      username,
      email,
      password, // 密碼會在 User 模型的 pre-save 鉤子中自動加密
    })

    await newUser.save()

    // 生成 JWT
    const token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
        username: newUser.username,
        isAdmin: newUser.isAdmin,
      },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" },
    )

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
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

