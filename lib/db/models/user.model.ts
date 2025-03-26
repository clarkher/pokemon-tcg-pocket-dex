import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [20, "Username cannot be more than 20 characters long"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    avatar: {
      type: String,
      default: "/images/default-avatar.png",
    },
    bio: {
      type: String,
      maxlength: [200, "Bio cannot be more than 200 characters long"],
      default: "",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    favoriteCards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Card",
      },
    ],
    decks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Deck",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    googleId: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

// 密碼加密中間件
userSchema.pre("save", async function (next) {
  // 只有在密碼被修改時才重新加密
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// 檢查密碼是否匹配的方法
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password)
}

export default userSchema

