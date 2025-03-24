"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  username: string
  email: string
  isAdmin: boolean
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  googleLogin: (token: string, profile: any) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 從本地存儲中檢查用戶和令牌
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "登入失敗")
      }

      setToken(data.token)
      setUser(data.user)

      // 保存到本地存儲
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
    } catch (error) {
      console.error("登入錯誤:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "註冊失敗")
      }

      setToken(data.token)
      setUser(data.user)

      // 保存到本地存儲
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
    } catch (error) {
      console.error("註冊錯誤:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const googleLogin = async (googleToken: string, profile: any) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: googleToken, profile }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Google 登入失敗")
      }

      setToken(data.token)
      setUser(data.user)

      // 保存到本地存儲
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
    } catch (error) {
      console.error("Google 登入錯誤:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        googleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth 必須在 AuthProvider 內使用")
  }
  return context
}

