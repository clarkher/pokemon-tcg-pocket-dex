import connectToDatabase from "@/lib/db/mongodb"
import { User } from "@/lib/db/models/user.model"
import bcryptjs from "bcryptjs"

// 獲取所有用戶
export async function getUsers() {
  try {
    await connectToDatabase()
    const users = await User.find().select("-password")
    return { success: true, users }
  } catch (error) {
    console.error("Error fetching users:", error)
    return { success: false, message: "Server error" }
  }
}

// 獲取單個用戶
export async function getUser(id: string) {
  try {
    await connectToDatabase()
    const user = await User.findById(id).select("-password")
    if (!user) {
      return { success: false, message: "User not found" }
    }
    return { success: true, user }
  } catch (error) {
    console.error("Error fetching user:", error)
    return { success: false, message: "Server error" }
  }
}

// 創建用戶
export async function createUser(userData: any) {
  try {
    await connectToDatabase()

    // 檢查用戶是否已存在
    const existingUser = await User.findOne({
      $or: [{ email: userData.email }, { username: userData.username }],
    })

    if (existingUser) {
      return {
        success: false,
        message: "User with this email or username already exists",
      }
    }

    // 加密密碼
    const salt = await bcryptjs.genSalt(10)
    userData.password = await bcryptjs.hash(userData.password, salt)

    // 創建新用戶
    const newUser = new User(userData)
    await newUser.save()

    return {
      success: true,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    }
  } catch (error) {
    console.error("Error creating user:", error)
    return { success: false, message: "Server error" }
  }
}

// 更新用戶
export async function updateUser(id: string, userData: any) {
  try {
    await connectToDatabase()

    // 如果更新包含密碼，需要加密
    if (userData.password) {
      const salt = await bcryptjs.genSalt(10)
      userData.password = await bcryptjs.hash(userData.password, salt)
    }

    const user = await User.findByIdAndUpdate(id, userData, {
      new: true,
    }).select("-password")

    if (!user) {
      return { success: false, message: "User not found" }
    }

    return { success: true, user }
  } catch (error) {
    console.error("Error updating user:", error)
    return { success: false, message: "Server error" }
  }
}

// 刪除用戶
export async function deleteUser(id: string) {
  try {
    await connectToDatabase()
    const user = await User.findByIdAndDelete(id)
    if (!user) {
      return { success: false, message: "User not found" }
    }
    return { success: true, message: "User deleted successfully" }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { success: false, message: "Server error" }
  }
}

