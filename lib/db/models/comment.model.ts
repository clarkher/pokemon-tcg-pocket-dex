import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IComment extends Document {
  content: string
  targetType: "card" | "deck" | "event" | "post"
  targetId: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
  createdBy: mongoose.Types.ObjectId
  likes: mongoose.Types.ObjectId[]
  replies?: mongoose.Types.ObjectId[]
}

const CommentSchema: Schema = new Schema(
  {
    content: { type: String, required: true },
    targetType: {
      type: String,
      enum: ["card", "deck", "event", "post"],
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "targetType",
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    replies: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  },
)

// 創建索引以提高搜索性能
CommentSchema.index({ targetType: 1, targetId: 1 })
CommentSchema.index({ createdBy: 1 })

const Comment: Model<IComment> = mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema)

export default Comment

