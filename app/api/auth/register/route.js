import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/db/mongodb"
import jwt from "jsonwebtoken"

export async function POST(req) {
  try {
    const { username, email, password } = await req.json()

    // 驗證輸入
    if (!username || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Username, email and password are required",
        },
        { status: 400 },
      )
    }

    // 連接數據庫
    await connectToDatabase()

    // 動態導入 User 模型
    const { User } = require("@/lib/db/models")

    // 檢查用戶是否已存在
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User with this email or username already exists",
        },
        { status: 400 },
      )
    }

    // 創建新用戶
    const newUser = new User({
      username,
      email,
      password,
    })

    await newUser.save()

    // 創建 JWT
    const token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
        username: newUser.username,
        isAdmin: newUser.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    )

    // 返回成功響應
    return NextResponse.json({
      success: true,
      message: "Registration successful",
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
        message: "Registration failed",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

