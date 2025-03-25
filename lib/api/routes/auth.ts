import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs"
import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/db/mongodb"
import { User } from "@/lib/db/models"

// 驗證 JWT 令牌
export async function verifyToken(token: string) {
  if (!token) {
    return { valid: false, data: null, error: "No token provided" }
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret") as {
      userId: string
      email: string
      username: string
      isAdmin: boolean
    }
    return { valid: true, data: decoded, error: null }
  } catch (error) {
    return { valid: false, data: null, error: "Invalid token" }
  }
}

// 登錄處理函數
export async function loginUser(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // 連接數據庫
    await connectToDatabase()

    // 查找用戶
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }

    // 驗證密碼
    const isMatch = await bcryptjs.compare(password, user.password)
    if (!isMatch) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
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

    // 返回成功響應
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isAdmin: user.isAdmin,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

// 註冊處理函數
export async function registerUser(req: NextRequest) {
  try {
    const { username, email, password } = await req.json()

    // 連接數據庫
    await connectToDatabase()

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

    // 返回成功響應
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
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

export async function googleLogin(req: NextRequest) {
  try {
    const { token, profile } = await req.json()

    // 連接數據庫
    await connectToDatabase()

    // 檢查用戶是否已存在
    let user = await User.findOne({ email: profile.email })

    if (!user) {
      // 創建新用戶
      user = new User({
        username: profile.name,
        email: profile.email,
        avatar: profile.picture,
        googleId: profile.id,
        password: Math.random().toString(36).slice(-8), // 隨機密碼
      })
      await user.save()
    }

    // 生成 JWT
    const jwtToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" },
    )

    // 返回成功響應
    return NextResponse.json({
      success: true,
      token: jwtToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isAdmin: user.isAdmin,
      },
    })
  } catch (error) {
    console.error("Google Login error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

