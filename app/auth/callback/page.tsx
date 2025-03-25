"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const token = searchParams.get("token")

    if (token) {
      // 保存令牌到 localStorage
      localStorage.setItem("token", token)

      // 顯示成功消息
      toast({
        title: "登錄成功",
        description: "您已成功登錄",
        variant: "default",
      })

      // 重定向到首頁
      router.push("/")
    } else {
      // 顯示錯誤消息
      toast({
        title: "登錄失敗",
        description: "無法完成登錄，請稍後再試",
        variant: "destructive",
      })

      // 重定向到登錄頁面
      router.push("/login")
    }
  }, [router, searchParams, toast])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">處理登錄...</h1>
        <p>請稍候，我們正在完成您的登錄</p>
      </div>
    </div>
  )
}

