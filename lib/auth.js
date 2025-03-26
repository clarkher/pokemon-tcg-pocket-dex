import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import connectToDatabase from "./db/mongodb"

// 驗證 JWT 令牌
export async function verifyToken(token) {
  try {
    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return decoded
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}

// 用戶認證中間件
export function withAuth(handler) {
  return async (req, context) => {
    try {
      // 從請求頭或 cookie 中獲取令牌
      const authHeader = req.headers.get("Authorization")
      const token = authHeader ? authHeader.split(" ")[1] : null

      if (!token) {
        return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
      }

      // 驗證令牌
      const decoded = await verifyToken(token)
      if (!decoded) {
        return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 })
      }

      // 將用戶信息添加到請求中
      req.user = decoded

      // 調用原始處理程序
      return handler(req, context)
    } catch (error) {
      console.error("Authentication error:", error)
      return NextResponse.json({ success: false, message: "Authentication error" }, { status: 500 })
    }
  }
}

// 管理員認證中間件
export function withAdmin(handler) {
  return async (req, context) => {
    try {
      // 從請求頭或 cookie 中獲取令牌
      const authHeader = req.headers.get("Authorization")
      const token = authHeader ? authHeader.split(" ")[1] : null

      if (!token) {
        return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
      }

      // 驗證令牌
      const decoded = await verifyToken(token)
      if (!decoded) {
        return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 })
      }

      // 檢查是否為管理員
      if (!decoded.isAdmin) {
        return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 })
      }

      // 將用戶信息添加到請求中
      req.user = decoded

      // 調用原始處理程序
      return handler(req, context)
    } catch (error) {
      console.error("Admin authentication error:", error)
      return NextResponse.json({ success: false, message: "Authentication error" }, { status: 500 })
    }
  }
}

// 獲取當前用戶
export async function getCurrentUser(req) {
  try {
    // 從請求頭或 cookie 中獲取令牌
    const authHeader = req.headers.get("Authorization")
    const token = authHeader ? authHeader.split(" ")[1] : null

    if (!token) {
      return null
    }

    // 驗證令牌
    const decoded = await verifyToken(token)
    if (!decoded) {
      return null
    }

    // 連接數據庫
    await connectToDatabase()

    // 動態導入 User 模型
    const { User } = require("./db/models")

    // 查找用戶
    const user = await User.findById(decoded.userId).select("-password")

    return user
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}

