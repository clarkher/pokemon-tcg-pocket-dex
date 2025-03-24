import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/db/mongodb"
import { User } from "@/lib/db/models"
import { withAdmin } from "@/lib/auth"
import bcrypt from "bcrypt"

// 獲取單個用戶詳情
async function getUser(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 連接到數據庫
    await connectToDatabase()

    const id = params.id

    // 查找用戶
    const user = await User.findById(id).select("-password")

    if (!user) {
      return NextResponse.json({ error: "用戶不存在" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("獲取用戶詳情錯誤:", error)
    return NextResponse.json({ error: "獲取用戶詳情過程中發生錯誤" }, { status: 500 })
  }
}

// 更新用戶
async function updateUser(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 連接到數據庫
    await connectToDatabase()

    const id = params.id
    const updateData = await req.json()

    // 查找用戶
    const user = await User.findById(id)

    if (!user) {
      return NextResponse.json({ error: "用戶不存在" }, { status: 404 })
    }

    // 如果更新包含密碼，則需要加密
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10)
      updateData.password = await bcrypt.hash(updateData.password, salt)
    }

    // 更新用戶
    const updatedUser = await User.findByIdAndUpdate(id, { $set: updateData }, { new: true }).select("-password")

    return NextResponse.json({
      message: "用戶更新成功",
      user: updatedUser,
    })
  } catch (error) {
    console.error("更新用戶錯誤:", error)
    return NextResponse.json({ error: "更新用戶過程中發生錯誤" }, { status: 500 })
  }
}

// 部分更新用戶（例如狀態）
async function patchUser(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 連接到數據庫
    await connectToDatabase()

    const id = params.id
    const updateData = await req.json()

    // 查找用戶
    const user = await User.findById(id)

    if (!user) {
      return NextResponse.json({ error: "用戶不存在" }, { status: 404 })
    }

    // 更新用戶
    const updatedUser = await User.findByIdAndUpdate(id, { $set: updateData }, { new: true }).select("-password")

    return NextResponse.json({
      message: "用戶更新成功",
      user: updatedUser,
    })
  } catch (error) {
    console.error("更新用戶錯誤:", error)
    return NextResponse.json({ error: "更新用戶過程中發生錯誤" }, { status: 500 })
  }
}

// 刪除用戶
async function deleteUser(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 連接到數據庫
    await connectToDatabase()

    const id = params.id

    // 查找用戶
    const user = await User.findById(id)

    if (!user) {
      return NextResponse.json({ error: "用戶不存在" }, { status: 404 })
    }

    // 刪除用戶
    await User.findByIdAndDelete(id)

    return NextResponse.json({
      message: "用戶刪除成功",
    })
  } catch (error) {
    console.error("刪除用戶錯誤:", error)
    return NextResponse.json({ error: "刪除用戶過程中發生錯誤" }, { status: 500 })
  }
}

export const GET = withAdmin((req, { params }) => getUser(req, { params }))
export const PUT = withAdmin((req, { params }) => updateUser(req, { params }))
export const PATCH = withAdmin((req, { params }) => patchUser(req, { params }))
export const DELETE = withAdmin((req, { params }) => deleteUser(req, { params }))

