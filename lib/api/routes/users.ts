import bcrypt from "bcryptjs" // 使用 bcryptjs 而不是 bcrypt
import connectToDatabase from "@/lib/db/mongodb"
import { User } from "@/lib/db/models"

// 獲取所有用戶
export async function getUsers() {
  await connectToDatabase()

  const users = await User.find({}).select("-password").sort({ createdAt: -1 })

  return users
}

// 獲取單個用戶
export async function getUser(id: string) {
  await connectToDatabase()

  const user = await User.findById(id).select("-password")

  if (!user) {
    throw new Error("User not found")
  }

  return user
}

// 更新用戶
export async function updateUser(id: string, data: any) {
  await connectToDatabase()

  // 如果要更新密碼，先加密
  if (data.password) {
    const salt = await bcrypt.genSalt(10)
    data.password = await bcrypt.hash(data.password, salt)
  }

  const user = await User.findByIdAndUpdate(id, { $set: data }, { new: true }).select("-password")

  if (!user) {
    throw new Error("User not found")
  }

  return user
}

// 刪除用戶
export async function deleteUser(id: string) {
  await connectToDatabase()

  const user = await User.findByIdAndDelete(id)

  if (!user) {
    throw new Error("User not found")
  }

  return { message: "User deleted successfully" }
}

// 獲取用戶的收藏卡片
export async function getUserFavoriteCards(userId: string) {
  await connectToDatabase()

  const user = await User.findById(userId).populate("favoriteCards").select("favoriteCards")

  if (!user) {
    throw new Error("User not found")
  }

  return user.favoriteCards
}

// 獲取用戶的牌組
export async function getUserDecks(userId: string) {
  await connectToDatabase()

  const user = await User.findById(userId).populate("decks").select("decks")

  if (!user) {
    throw new Error("User not found")
  }

  return user.decks
}

// 關注用戶
export async function followUser(userId: string, targetUserId: string) {
  await connectToDatabase()

  // 確保不是自己關注自己
  if (userId === targetUserId) {
    throw new Error("You cannot follow yourself")
  }

  const user = await User.findById(userId)
  const targetUser = await User.findById(targetUserId)

  if (!user || !targetUser) {
    throw new Error("User not found")
  }

  // 檢查是否已經關注
  if (user.following.includes(targetUserId)) {
    // 取消關注
    await User.findByIdAndUpdate(userId, {
      $pull: { following: targetUserId },
    })

    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: userId },
    })

    return { following: false }
  } else {
    // 添加關注
    await User.findByIdAndUpdate(userId, {
      $addToSet: { following: targetUserId },
    })

    await User.findByIdAndUpdate(targetUserId, {
      $addToSet: { followers: userId },
    })

    return { following: true }
  }
}

