import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import connectToDatabase from "./db/mongodb"

// 驗證 JWT 令牌
export async function verifyJWT(token: string) {
  try {
    if (!token) {
      throw new Error("No token provided")
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string
      email: string
      username: string
      isAdmin: boolean
    }

    return decoded
  } catch (error) {
    throw new Error("Invalid token")
  }
}

// 獲取當前用戶
export async function getCurrentUser(req: NextRequest) {
  try {
    // 從請求頭中獲取令牌
    const authHeader = req.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null
    }

    const token = authHeader.split(" ")[1]
    const decoded = await verifyJWT(token)

    // 連接數據庫
    await connectToDatabase()

    // 動態導入模型
    const { User } = require("./db/models")

    // 查找用戶
    const user = await User.findById(decoded.userId).select("-password")
    if (!user) {
      return null
    }

    return user
  } catch (error) {
    return null
  }
}

// 檢查是否為管理員
export async function isAdmin(req: NextRequest) {
  const user = await getCurrentUser(req)
  return user && user.isAdmin
}

// 中間件：需要登錄
export async function requireAuth(req: NextRequest) {
  const user = await getCurrentUser(req)

  if (!user) {
    return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
  }

  return user
}

// 中間件：需要管理員權限
export async function requireAdmin(req: NextRequest) {
  const user = await getCurrentUser(req)

  if (!user) {
    return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
  }

  if (!user.isAdmin) {
    return NextResponse.json({ success: false, message: "Admin privileges required" }, { status: 403 })
  }

  return user
}

