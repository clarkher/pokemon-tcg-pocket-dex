"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // 登入表單狀態
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  // 註冊表單狀態
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  // 處理登入表單變更
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
  }

  // 處理註冊表單變更
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setRegisterData((prev) => ({ ...prev, [name]: value }))
  }

  // 處理登入提交
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      // 保存令牌和用戶信息
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      toast({
        title: "登入成功",
        description: "歡迎回來！",
      })

      // 重定向到主頁
      router.push("/")
    } catch (error) {
      toast({
        title: "登入失敗",
        description: error instanceof Error ? error.message : "發生未知錯誤",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 處理註冊提交
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // 檢查密碼是否匹配
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "註冊失敗",
        description: "密碼不匹配",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: registerData.username,
          email: registerData.email,
          password: registerData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      // 保存令牌和用戶信息
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      toast({
        title: "註冊成功",
        description: "歡迎加入！",
      })

      // 重定向到主頁
      router.push("/")
    } catch (error) {
      toast({
        title: "註冊失敗",
        description: error instanceof Error ? error.message : "發生未知錯誤",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">寶可夢 TCG 口袋圖鑑</CardTitle>
          <CardDescription>登入或註冊以開始使用</CardDescription>
        </CardHeader>
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">登入</TabsTrigger>
            <TabsTrigger value="register">註冊</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleLoginSubmit}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">電子郵件</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={loginData.email}
                    onChange={handleLoginChange}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">密碼</Label>
                    <Link href="#" className="text-xs text-primary hover:underline">
                      忘記密碼？
                    </Link>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={loginData.password}
                    onChange={handleLoginChange}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      登入中...
                    </>
                  ) : (
                    "登入"
                  )}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          <TabsContent value="register">
            <form onSubmit={handleRegisterSubmit}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="username">用戶名</Label>
                  <Input
                    id="username"
                    name="username"
                    placeholder="pokemonmaster"
                    required
                    value={registerData.username}
                    onChange={handleRegisterChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">電子郵件</Label>
                  <Input
                    id="register-email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={registerData.email}
                    onChange={handleRegisterChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">密碼</Label>
                  <Input
                    id="register-password"
                    name="password"
                    type="password"
                    required
                    value={registerData.password}
                    onChange={handleRegisterChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">確認密碼</Label>
                  <Input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    required
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      註冊中...
                    </>
                  ) : (
                    "註冊"
                  )}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}

