"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PokemonLogo } from "@/components/pokemon-logo"
import { ChromeIcon as Google } from "lucide-react"
import { useAuth } from "@/lib/context/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const { login, register } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLoginCheckboxChange = (checked: boolean) => {
    setLoginData((prev) => ({ ...prev, rememberMe: checked }))
  }

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setRegisterData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegisterCheckboxChange = (checked: boolean) => {
    setRegisterData((prev) => ({ ...prev, agreeTerms: checked }))
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!loginData.email || !loginData.password) {
      toast({
        title: "錯誤",
        description: "請填寫所有必填欄位",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await login(loginData.email, loginData.password)
      toast({
        title: "登入成功",
        description: "歡迎回來！",
      })
      router.push("/")
    } catch (error: any) {
      toast({
        title: "登入失敗",
        description: error.message || "請檢查您的電子郵件和密碼",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!registerData.username || !registerData.email || !registerData.password || !registerData.confirmPassword) {
      toast({
        title: "錯誤",
        description: "請填寫所有必填欄位",
        variant: "destructive",
      })
      return
    }

    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "錯誤",
        description: "密碼和確認密碼不匹配",
        variant: "destructive",
      })
      return
    }

    if (!registerData.agreeTerms) {
      toast({
        title: "錯誤",
        description: "請同意使用條款和隱私政策",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await register(registerData.username, registerData.email, registerData.password)
      toast({
        title: "註冊成功",
        description: "歡迎加入！",
      })
      router.push("/")
    } catch (error: any) {
      toast({
        title: "註冊失敗",
        description: error.message || "註冊過程中發生錯誤",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    // 這裡將實現 Google 登入
    toast({
      title: "功能開發中",
      description: "Google 登入功能即將推出",
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <PokemonLogo className="h-8 w-8" />
              <span className="text-xl font-bold">寶可夢集換式卡牌資料庫</span>
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/cards">卡牌</Link>
            <Link href="/decks">牌組</Link>
            <Link href="/events">活動</Link>
            <Link href="/about">關於</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="container flex h-full items-center justify-center py-12">
          <div className="w-full max-w-md">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">登入</TabsTrigger>
                <TabsTrigger value="register">註冊</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle>登入帳號</CardTitle>
                    <CardDescription>輸入您的電子郵件和密碼登入您的帳號。</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">電子郵件</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="name@example.com"
                          value={loginData.email}
                          onChange={handleLoginChange}
                          required
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">密碼</Label>
                          <Link
                            href="/forgot-password"
                            className="text-xs text-primary underline-offset-4 hover:underline"
                          >
                            忘記密碼?
                          </Link>
                        </div>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="••••••••"
                          value={loginData.password}
                          onChange={handleLoginChange}
                          required
                          disabled={isLoading}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="rememberMe"
                          checked={loginData.rememberMe}
                          onCheckedChange={handleLoginCheckboxChange}
                          disabled={isLoading}
                        />
                        <Label htmlFor="rememberMe" className="text-sm">
                          記住我
                        </Label>
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "登入中..." : "登入"}
                      </Button>
                    </form>
                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">或使用</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isLoading}>
                      <Google className="mr-2 h-4 w-4" />
                      使用 Google 帳號登入
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="register">
                <Card>
                  <CardHeader>
                    <CardTitle>創建帳號</CardTitle>
                    <CardDescription>填寫以下資訊創建您的帳號。</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleRegisterSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">用戶名</Label>
                        <Input
                          id="username"
                          name="username"
                          placeholder="您的用戶名"
                          value={registerData.username}
                          onChange={handleRegisterChange}
                          required
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="registerEmail">電子郵件</Label>
                        <Input
                          id="registerEmail"
                          name="email"
                          type="email"
                          placeholder="name@example.com"
                          value={registerData.email}
                          onChange={handleRegisterChange}
                          required
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="registerPassword">密碼</Label>
                        <Input
                          id="registerPassword"
                          name="password"
                          type="password"
                          placeholder="••••••••"
                          value={registerData.password}
                          onChange={handleRegisterChange}
                          required
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">確認密碼</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          value={registerData.confirmPassword}
                          onChange={handleRegisterChange}
                          required
                          disabled={isLoading}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="agreeTerms"
                          checked={registerData.agreeTerms}
                          onCheckedChange={handleRegisterCheckboxChange}
                          required
                          disabled={isLoading}
                        />
                        <Label htmlFor="agreeTerms" className="text-sm">
                          我同意
                          <Link href="/terms" className="ml-1 text-primary underline-offset-4 hover:underline">
                            使用條款
                          </Link>
                          和
                          <Link href="/privacy" className="ml-1 text-primary underline-offset-4 hover:underline">
                            隱私政策
                          </Link>
                        </Label>
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "註冊中..." : "註冊"}
                      </Button>
                    </form>
                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">或使用</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isLoading}>
                      <Google className="mr-2 h-4 w-4" />
                      使用 Google 帳號註冊
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 寶可夢集換式卡牌資料庫。保留所有權利。
          </p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="text-sm text-muted-foreground">
              關於
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground">
              隱私政策
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground">
              使用條款
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

