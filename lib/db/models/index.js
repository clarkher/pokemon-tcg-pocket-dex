const mongoose = require("mongoose")
const bcryptjs = require("bcryptjs")

// User Schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
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
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

// 密碼加密中間件
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcryptjs.genSalt(10)
    this.password = await bcryptjs.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// 檢查密碼是否匹配的方法
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password)
}

// Card Schema
const cardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    set: { type: String },
    number: { type: String },
    rarity: { type: String },
    type: { type: String },
  },
  { timestamps: true },
)

// Deck Schema
const deckSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    cards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Card" }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
)

// Event Schema
const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date },
    location: { type: String },
  },
  { timestamps: true },
)

// Comment Schema
const commentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
)

// Notification Schema
const notificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
)

// Post Schema
const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
)

// 創建模型（如果尚未創建）
const User = mongoose.models.User || mongoose.model("User", userSchema)
const Card = mongoose.models.Card || mongoose.model("Card", cardSchema)
const Deck = mongoose.models.Deck || mongoose.model("Deck", deckSchema)
const Event = mongoose.models.Event || mongoose.model("Event", eventSchema)
const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema)
const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema)
const Post = mongoose.models.Post || mongoose.model("Post", postSchema)

module.exports = {
  User,
  Card,
  Deck,
  Event,
  Comment,
  Notification,
  Post,
}

