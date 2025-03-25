import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/db/mongodb"
import { User } from "@/lib/db/models/user.model"
import bcryptjs from "bcryptjs"

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    // 檢查是否已存在管理員
    const adminExists = await User.findOne({ isAdmin: true })
    if (adminExists) {
      return NextResponse.json({
        success: false,
        message: "Admin already exists",
      })
    }

    // 創建默認管理員
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash("admin123", salt)

    const admin = new User({
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
      isAdmin: true,
    })

    await admin.save()

    return NextResponse.json({
      success: true,
      message: "Admin created successfully",
      admin: {
        username: admin.username,
        email: admin.email,
      },
    })
  } catch (error) {
    console.error("Error creating admin:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

