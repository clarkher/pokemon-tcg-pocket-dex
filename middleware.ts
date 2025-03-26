import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

// 這個函數可以標記為異步
export async function middleware(request: NextRequest) {
  // 獲取請求路徑
  const path = request.nextUrl.pathname

  // 定義公開路徑
  const isPublicPath =
    path === "/login" ||
    path === "/register" ||
    path.startsWith("/api/auth") ||
    path === "/" ||
    path.startsWith("/cards") ||
    path.startsWith("/decks") ||
    path.startsWith("/events") ||
    path.startsWith("/search") ||
    path.startsWith("/forum") ||
    path.startsWith("/_next") ||
    path.startsWith("/favicon.ico") ||
    path.includes(".")

  // 定義管理員路徑
  const isAdminPath = path.startsWith("/admin") && path !== "/admin/login"

  // 獲取令牌
  const token = request.cookies.get("token")?.value || ""

  // 如果是公開路徑，直接放行
  if (isPublicPath) {
    return NextResponse.next()
  }

  // 如果沒有令牌，重定向到登錄頁面
  if (!token) {
    if (isAdminPath) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    // 驗證令牌
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret")
    const { payload } = await jwtVerify(token, secret)

    // 如果是管理員路徑，檢查是否為管理員
    if (isAdminPath && !payload.isAdmin) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    // 令牌有效，放行
    return NextResponse.next()
  } catch (error) {
    // 令牌無效，清除 cookie 並重定向到登錄頁面
    const response = NextResponse.redirect(new URL(isAdminPath ? "/admin/login" : "/login", request.url))
    response.cookies.delete("token")
    return response
  }
}

// 配置中間件匹配的路徑
export const config = {
  matcher: ["/((?!api/test-db|api/init-admin|_next/static|_next/image|favicon.ico).*)"],
}

