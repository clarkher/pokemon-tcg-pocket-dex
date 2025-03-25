import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/api/routes/auth"

// 定義需要保護的路由
const protectedRoutes = ["/api/users/me", "/api/cards/favorite", "/api/decks/create", "/api/decks/edit"]

// 定義需要管理員權限的路由
const adminRoutes = ["/api/admin", "/admin"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 檢查是否為開發環境
  const isDevelopment = process.env.NODE_ENV === "development"

  // 在開發環境中，如果訪問管理員路由，允許訪問
  if (isDevelopment && pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  // 檢查是否為受保護的路由
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))

  if (!isProtectedRoute && !isAdminRoute) {
    return NextResponse.next()
  }

  // 獲取授權頭
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }

  const token = authHeader.split(" ")[1]
  try {
    const { valid, data, error } = await verifyToken(token)

    if (!valid || !data) {
      return NextResponse.json({ success: false, message: error || "Invalid token" }, { status: 401 })
    }

    // 檢查管理員路由的權限
    if (isAdminRoute && !data.isAdmin) {
      return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 })
    }

    return NextResponse.next()
  } catch (error) {
    return NextResponse.json({ success: false, message: "Authentication failed" }, { status: 401 })
  }
}

// 配置中間件匹配的路由
export const config = {
  matcher: ["/api/users/:path*", "/api/cards/:path*", "/api/decks/:path*", "/api/admin/:path*", "/admin/:path*"],
}

