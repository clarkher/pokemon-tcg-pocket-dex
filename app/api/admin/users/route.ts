import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/db/mongodb"
import { User } from "@/lib/db/models"
import { withAdmin } from "@/lib/auth"

async function getUsers(req: NextRequest) {
  try {
    // 連接到數據庫
    await connectToDatabase()

    // 解析查詢參數
    const url = new URL(req.url)
    const page = Number.parseInt(url.searchParams.get("page") || "1")
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")
    const search = url.searchParams.get("search") || ""
    const status = url.searchParams.get("status")

    // 構建查詢條件
    const query: any = {}

    if (search) {
      query.$or = [{ username: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }]
    }

    if (status) {
      query.status = status
    }

    // 計算跳過的文檔數
    const skip = (page - 1) * limit

    // 查詢用戶
    const users = await User.find(query)
      .select("-password") // 排除密碼字段
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    // 計算總數
    const total = await User.countDocuments(query)

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("獲取用戶錯誤:", error)
    return NextResponse.json({ error: "獲取用戶過程中發生錯誤" }, { status: 500 })
  }
}

export const GET = withAdmin(getUsers)

