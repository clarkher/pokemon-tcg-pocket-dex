import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/api/routes/auth"

// 需要保護的管理後台路徑
const PROTECTED_ADMIN_PATHS = ["/admin", "/api/admin"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 檢查是否是管理後台路徑
  const isAdminPath = PROTECTED_ADMIN_PATHS.some((path) => pathname.startsWith(path))

  // 在開發環境中允許訪問管理後台
  const isDevelopment = process.env.NODE_ENV === "development"
  if (isDevelopment && isAdminPath) {
    return NextResponse.next()
  }

  if (isAdminPath) {
    // 從 Cookie 或 Authorization 頭獲取令牌
    const token = request.cookies.get("token")?.value || request.headers.get("Authorization")?.replace("Bearer ", "")

    if (!token) {
      // 如果沒有令牌，重定向到登入頁面
      return NextResponse.redirect(new URL("/login?redirect=" + pathname, request.url))
    }

    // 驗證令牌
    const { valid, data } = verifyToken(token)

    if (!valid || !data || !(data as any).isAdmin) {
      // 如果令牌無效或用戶不是管理員，重定向到登入頁面
      return NextResponse.redirect(new URL("/login?redirect=" + pathname, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}

