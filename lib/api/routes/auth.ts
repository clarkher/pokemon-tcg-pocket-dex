import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/db/mongodb"
import { User } from "@/lib/db/models"

// 從環境變量獲取 JWT 密鑰
const JWT_SECRET = process.env.JWT_SECRET || ""

if (!JWT_SECRET) {
  throw new Error("請定義 JWT_SECRET 環境變量")
}

// 註冊新用戶
export async function register(req: NextRequest) {
  try {
    const { username, email, password } = await req.json()

    // 連接到數據庫
    await connectToDatabase()

    // 檢查用戶是否已存在
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      return NextResponse.json(
        {
          error: existingUser.email === email ? "該電子郵件已被註冊" : "該用戶名已被使用",
        },
        { status: 400 },
      )
    }

    // 創建新用戶
    const newUser = new User({
      username,
      email,
      password, // 密碼會在 pre-save 鉤子中自動加密
      isAdmin: false,
      status: "active",
      followers: [],
      following: [],
    })

    await newUser.save()

    // 生成 JWT 令牌
    const token = jwt.sign(
      {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    )

    return NextResponse.json({
      message: "註冊成功",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      },
    })
  } catch (error) {
    console.error("註冊錯誤:", error)
    return NextResponse.json({ error: "註冊過程中發生錯誤" }, { status: 500 })
  }
}

// 用戶登入
export async function login(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // 連接到數據庫
    await connectToDatabase()

    // 查找用戶
    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json({ error: "用戶不存在" }, { status: 404 })
    }

    // 驗證密碼
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return NextResponse.json({ error: "密碼錯誤" }, { status: 400 })
    }

    // 檢查用戶狀態
    if (user.status !== "active") {
      return NextResponse.json({ error: "帳號已被禁用，請聯繫管理員" }, { status: 403 })
    }

    // 生成 JWT 令牌
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    )

    // 更新最後登入時間
    user.lastLogin = new Date()
    await user.save()

    return NextResponse.json({
      message: "登入成功",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    })
  } catch (error) {
    console.error("登入錯誤:", error)
    return NextResponse.json({ error: "登入過程中發生錯誤" }, { status: 500 })
  }
}

// Google OAuth 登入
export async function googleLogin(req: NextRequest) {
  try {
    const { token: googleToken, profile } = await req.json()

    // 連接到數據庫
    await connectToDatabase()

    // 從 profile 中獲取用戶信息
    const { email, name, id: googleId } = profile

    // 查找或創建用戶
    let user = await User.findOne({ email })

    if (!user) {
      // 創建新用戶
      user = new User({
        username: name,
        email,
        password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10), // 生成隨機密碼
        googleId,
        isAdmin: false,
        status: "active",
        followers: [],
        following: [],
      })
      await user.save()
    } else {
      // 更新 Google ID（如果之前沒有）
      if (!user.googleId) {
        user.googleId = googleId
        await user.save()
      }
    }

    // 檢查用戶狀態
    if (user.status !== "active") {
      return NextResponse.json({ error: "帳號已被禁用，請聯繫管理員" }, { status: 403 })
    }

    // 生成 JWT 令牌
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    )

    // 更新最後登入時間
    user.lastLogin = new Date()
    await user.save()

    return NextResponse.json({
      message: "Google 登入成功",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    })
  } catch (error) {
    console.error("Google 登入錯誤:", error)
    return NextResponse.json({ error: "Google 登入過程中發生錯誤" }, { status: 500 })
  }
}

// 驗證令牌
export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return { valid: true, data: decoded }
  } catch (error) {
    return { valid: false, error: "無效的令牌" }
  }
}

