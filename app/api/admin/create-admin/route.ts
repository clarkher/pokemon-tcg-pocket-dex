import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/db/mongodb"
import { User } from "@/lib/db/models"
import bcrypt from "bcryptjs"

export async function POST() {
  try {
    await connectToDatabase()

    // 檢查是否已存在管理員
    const existingAdmin = await User.findOne({ isAdmin: true })
    if (existingAdmin) {
      return NextResponse.json({ success: false, message: "Admin already exists" }, { status: 400 })
    }

    // 創建管理員帳戶
    const hashedPassword = await bcrypt.hash("admin123", 10)
    const admin = new User({
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
      isAdmin: true,
    })

    await admin.save()

    return NextResponse.json({
      success: true,
      message: "Admin account created successfully",
    })
  } catch (error) {
    console.error("Error creating admin:", error)
    return NextResponse.json({ success: false, message: "Failed to create admin account" }, { status: 500 })
  }
}

