import type { NextRequest } from "next/server"
import { verifyToken } from "./api/routes/auth"
import connectToDatabase from "./db/mongodb"
import { User } from "./db/models"

// 中間件：驗證用戶是否已登入
export function withAuth(handler: (req: NextRequest, userId: string) => Promise<Response>) {
  return async (req: NextRequest) => {
    // 從請求頭中獲取令牌
    const authHeader = req.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "未授權" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    const token = authHeader.split(" ")[1]
    const { valid, data, error } = verifyToken(token)

    if (!valid || !data) {
      return new Response(JSON.stringify({ error: error || "無效的令牌" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    // 將用戶ID傳遞給處理程序
    return handler(req, (data as any).id)
  }
}

// 中間件：驗證用戶是否為管理員
export function withAdmin(handler: (req: NextRequest) => Promise<Response>) {
  return async (req: NextRequest) => {
    // 從請求頭中獲取令牌
    const authHeader = req.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "未授權" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    const token = authHeader.split(" ")[1]
    const { valid, data, error } = verifyToken(token)

    if (!valid || !data) {
      return new Response(JSON.stringify({ error: error || "無效的令牌" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    // 檢查用戶是否為管理員
    if (!(data as any).isAdmin) {
      // 連接到數據庫並再次檢查用戶權限
      try {
        await connectToDatabase()
        const user = await User.findById((data as any).id)

        if (!user || !user.isAdmin) {
          return new Response(JSON.stringify({ error: "需要管理員權限" }), {
            status: 403,
            headers: { "Content-Type": "application/json" },
          })
        }
      } catch (error) {
        return new Response(JSON.stringify({ error: "驗證管理員權限時發生錯誤" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        })
      }
    }

    return handler(req)
  }
}

