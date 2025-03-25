import { NextResponse, type NextRequest } from "next/server"
import { verifyAuth } from "@/lib/api/routes/auth"

export async function middleware(request: NextRequest) {
  // 開發環境下跳過身份驗證
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next()
  }

  const path = request.nextUrl.pathname

  // 定義需要保護的路徑
  const protectedRoutes = ["/api/users/me", "/api/decks/create", "/api/cards/favorite"]

  // 定義管理員路徑
  const adminRoutes = ["/api/admin", "/admin"]

  // 檢查是否是受保護的 API 路由
  const isProtectedApiRoute = protectedRoutes.some((route) => path.startsWith(route))

  // 檢查是否是管理員路由
  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route))

  // 如果不是受保護的路由或管理員路由，則繼續
  if (!isProtectedApiRoute && !isAdminRoute) {
    return NextResponse.next()
  }

  // 驗證令牌
  const token = request.headers.get("authorization")?.split(" ")[1] || ""

  try {
    const decodedToken = await verifyAuth(token)

    // 檢查管理員權限
    if (isAdminRoute && !decodedToken.isAdmin) {
      return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 })
    }

    // 將用戶信息添加到請求頭中
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-user-id", decodedToken.userId)
    requestHeaders.set("x-user-email", decodedToken.email)
    requestHeaders.set("x-user-role", decodedToken.isAdmin ? "admin" : "user")

    // 繼續處理請求
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    // 身份驗證失敗
    return NextResponse.json({ success: false, message: "Authentication failed" }, { status: 401 })
  }
}

// 配置中間件應用的路徑
export const config = {
  matcher: [
    "/api/users/me/:path*",
    "/api/decks/create/:path*",
    "/api/cards/favorite/:path*",
    "/api/admin/:path*",
    "/admin/:path*",
  ],
}

