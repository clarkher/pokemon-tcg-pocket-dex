import mongoose, { Schema, type Document } from "mongoose"
import bcryptjs from "bcryptjs"

export interface IUser extends Document {
  username: string
  email: string
  password: string
  avatar?: string
  bio?: string
  location?: string
  favoriteType?: string
  isAdmin: boolean
  googleId?: string
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
  status: "active" | "inactive" | "banned"
  followers: mongoose.Types.ObjectId[]
  following: mongoose.Types.ObjectId[]
  favoriteCards: mongoose.Types.ObjectId[]
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String },
    bio: { type: String },
    location: { type: String },
    favoriteType: { type: String },
    isAdmin: { type: Boolean, default: false },
    googleId: { type: String },
    lastLogin: { type: Date },
    status: {
      type: String,
      enum: ["active", "inactive", "banned"],
      default: "active",
    },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    favoriteCards: [{ type: Schema.Types.ObjectId, ref: "Card" }],
  },
  {
    timestamps: true,
  },
)

// 保存前加密密碼
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcryptjs.genSalt(10)
    this.password = await bcryptjs.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// 比較密碼方法
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcryptjs.compare(candidatePassword, this.password)
}

// 避免 Mongoose 模型重複定義錯誤
const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

export default User

