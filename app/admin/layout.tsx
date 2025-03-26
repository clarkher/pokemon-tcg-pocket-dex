"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type React from "react"
import { Sidebar } from "@/components/admin/sidebar"
import { useAuth } from "@/lib/context/auth-context"
import { Loader2 } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [bypassAuth, setBypassAuth] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // 開發環境中允許繞過身份驗證
    const isDevelopment = process.env.NODE_ENV === "development"
    if (isDevelopment) {
      setBypassAuth(true)
    }

    // 如果用戶已加載且不是管理員，且不在開發環境，重定向到首頁
    if (!isLoading && isClient && !bypassAuth) {
      if (!isAuthenticated) {
        router.push("/login?redirect=/admin")
      } else if (!user?.isAdmin) {
        router.push("/")
      }
    }
  }, [isLoading, isAuthenticated, user, router, isClient, bypassAuth])

  // 顯示加載狀態
  if (isLoading && !bypassAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">正在加載管理後台...</span>
      </div>
    )
  }

  // 在開發環境中允許預覽，或者用戶是管理員
  if (bypassAuth || (isAuthenticated && user?.isAdmin)) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    )
  }

  // 如果不是開發環境且用戶不是管理員，顯示未授權消息
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">未授權訪問</h1>
        <p className="text-muted-foreground">您沒有權限訪問管理後台。</p>
        <button
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
          onClick={() => router.push("/")}
        >
          返回首頁
        </button>
      </div>
    </div>
  )
}

