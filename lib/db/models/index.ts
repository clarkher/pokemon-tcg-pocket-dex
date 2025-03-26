import mongoose from "mongoose"
import userSchema from "./user.model"

// 使用 mongoose.models 檢查模型是否已經存在，如果不存在則創建新模型
export const User = mongoose.models.User || mongoose.model("User", userSchema)

// 臨時模型定義，直到我們有完整的模型文件
const CardSchema = new mongoose.Schema(
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

const DeckSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    cards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Card" }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
)

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date },
    location: { type: String },
  },
  { timestamps: true },
)

const CommentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
)

const NotificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
)

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
)

// 導出所有模型
export const Card = mongoose.models.Card || mongoose.model("Card", CardSchema)
export const Deck = mongoose.models.Deck || mongoose.model("Deck", DeckSchema)
export const Event = mongoose.models.Event || mongoose.model("Event", EventSchema)
export const Comment = mongoose.models.Comment || mongoose.model("Comment", CommentSchema)
export const Notification = mongoose.models.Notification || mongoose.model("Notification", NotificationSchema)
export const Post = mongoose.models.Post || mongoose.model("Post", PostSchema)

