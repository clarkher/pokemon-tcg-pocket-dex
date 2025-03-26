import mongoose from "mongoose"
import userSchema from "./user.model"
import cardSchema from "./card.model"
import deckSchema from "./deck.model"
import eventSchema from "./event.model"
import commentSchema from "./comment.model"
import notificationSchema from "./notification.model"
import postSchema from "./post.model"

// 使用 mongoose.models 檢查模型是否已經存在，如果不存在則創建新模型
export const User = mongoose.models.User || mongoose.model("User", userSchema)
export const Card = mongoose.models.Card || mongoose.model("Card", cardSchema)
export const Deck = mongoose.models.Deck || mongoose.model("Deck", deckSchema)
export const Event = mongoose.models.Event || mongoose.model("Event", eventSchema)
export const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema)
export const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema)
export const Post = mongoose.models.Post || mongoose.model("Post", postSchema)

// 導出所有模型
export default {
  User,
  Card,
  Deck,
  Event,
  Comment,
  Notification,
  Post,
}

