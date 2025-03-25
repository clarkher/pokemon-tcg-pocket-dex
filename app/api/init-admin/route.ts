import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/db/mongodb"
import { User } from "@/lib/db/models"
import bcryptjs from "bcryptjs"

export async function GET() {
  try {
    console.log("Initializing admin account...")

    // 連接數據庫
    await connectToDatabase()
    console.log("Database connected")

    // 檢查是否已存在管理員
    const existingAdmin = await User.findOne({ isAdmin: true })
    if (existingAdmin) {
      console.log("Admin already exists")
      return NextResponse.json({ message: "Admin already exists" })
    }

    // 創建管理員帳戶
    const hashedPassword = await bcryptjs.hash("admin123", 10)
    const admin = new User({
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
      isAdmin: true,
    })

    await admin.save()
    console.log("Admin created successfully")

    return NextResponse.json({ message: "Admin created successfully" })
  } catch (error) {
    console.error("Error creating admin:", error)
    return NextResponse.json({ message: "Failed to create admin account", error: String(error) }, { status: 500 })
  }
}

