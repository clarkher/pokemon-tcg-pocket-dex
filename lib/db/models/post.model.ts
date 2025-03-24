import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IPost extends Document {
  title: string
  content: string
  category: string
  tags?: string[]
  createdAt: Date
  updatedAt: Date
  createdBy: mongoose.Types.ObjectId
  likes: mongoose.Types.ObjectId[]
  views: number
  isPinned: boolean
  isLocked: boolean
}

const PostSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    views: { type: Number, default: 0 },
    isPinned: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
)

// 創建索引以提高搜索性能
PostSchema.index({ title: "text", content: "text" })
PostSchema.index({ category: 1 })
PostSchema.index({ tags: 1 })
PostSchema.index({ createdBy: 1 })
PostSchema.index({ isPinned: 1 })

const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema)

export default Post

