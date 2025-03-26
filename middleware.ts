import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/api/routes/auth"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isDevelopment = process.env.NODE_ENV === "development"

  // 允許公共路徑
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/init") ||
    pathname.startsWith("/api/test-db") ||
    pathname === "/api/admin/create-admin" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/"
  ) {
    return NextResponse.next()
  }

  // 處理管理員路由
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    // 在開發環境中跳過認證
    if (isDevelopment) {
      console.log("Development mode: Skipping admin authentication")
      return NextResponse.next()
    }

    const token = request.cookies.get("admin-token")?.value

    if (!token) {
      // 如果是 API 路由，返回 JSON 錯誤
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
      }
      // 否則重定向到登錄頁面
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    try {
      const { valid, data } = await verifyToken(token)

      if (!valid || !data?.isAdmin) {
        // 如果是 API 路由，返回 JSON 錯誤
        if (pathname.startsWith("/api/")) {
          return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }
        // 否則重定向到登錄頁面
        return NextResponse.redirect(new URL("/admin/login", request.url))
      }

      return NextResponse.next()
    } catch (error) {
      console.error("Admin auth error:", error)
      // 如果是 API 路由，返回 JSON 錯誤
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
      }
      // 否則重定向到登錄頁面
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  // 處理需要認證的用戶路由
  if (
    pathname.startsWith("/api/users/me") ||
    pathname === "/profile" ||
    pathname.startsWith("/decks/new") ||
    pathname.includes("/edit")
  ) {
    // 在開發環境中跳過認證
    if (isDevelopment) {
      console.log("Development mode: Skipping user authentication")
      return NextResponse.next()
    }

    const token = request.cookies.get("token")?.value

    if (!token) {
      // 如果是 API 路由，返回 JSON 錯誤
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
      }
      // 否則重定向到登錄頁面
      return NextResponse.redirect(new URL("/login", request.url))
    }

    try {
      const { valid } = await verifyToken(token)

      if (!valid) {
        // 如果是 API 路由，返回 JSON 錯誤
        if (pathname.startsWith("/api/")) {
          return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }
        // 否則重定向到登錄頁面
        return NextResponse.redirect(new URL("/login", request.url))
      }

      return NextResponse.next()
    } catch (error) {
      console.error("Auth error:", error)
      // 如果是 API 路由，返回 JSON 錯誤
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
      }
      // 否則重定向到登錄頁面
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}

