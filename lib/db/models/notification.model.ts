import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface INotification extends Document {
  type: "like" | "comment" | "follow" | "mention" | "system"
  message: string
  isRead: boolean
  targetType?: "card" | "deck" | "event" | "post" | "user"
  targetId?: mongoose.Types.ObjectId
  createdAt: Date
  userId: mongoose.Types.ObjectId
  triggeredBy?: mongoose.Types.ObjectId
}

const NotificationSchema: Schema = new Schema(
  {
    type: {
      type: String,
      enum: ["like", "comment", "follow", "mention", "system"],
      required: true,
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    targetType: {
      type: String,
      enum: ["card", "deck", "event", "post", "user"],
    },
    targetId: {
      type: Schema.Types.ObjectId,
      refPath: "targetType",
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    triggeredBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  },
)

// 創建索引以提高搜索性能
NotificationSchema.index({ userId: 1 })
NotificationSchema.index({ isRead: 1 })
NotificationSchema.index({ createdAt: -1 })

const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema)

export default Notification

