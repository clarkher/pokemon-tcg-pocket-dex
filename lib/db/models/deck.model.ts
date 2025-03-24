import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IDeck extends Document {
  name: string
  description?: string
  isPublic: boolean
  mainEnergy: string[]
  cards: {
    cardId: mongoose.Types.ObjectId
    count: number
  }[]
  energy: {
    type: string
    count: number
  }[]
  likes: mongoose.Types.ObjectId[]
  views: number
  createdAt: Date
  updatedAt: Date
  createdBy: mongoose.Types.ObjectId
  tags?: string[]
}

const DeckSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    isPublic: { type: Boolean, default: true },
    mainEnergy: [{ type: String, required: true }],
    cards: [
      {
        cardId: { type: Schema.Types.ObjectId, ref: "Card", required: true },
        count: { type: Number, required: true, min: 1, max: 4 },
      },
    ],
    energy: [
      {
        type: { type: String, required: true },
        count: { type: Number, required: true, min: 1 },
      },
    ],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    views: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tags: [{ type: String }],
  },
  {
    timestamps: true,
  },
)

// 創建索引以提高搜索性能
DeckSchema.index({ name: "text", description: "text" })
DeckSchema.index({ mainEnergy: 1 })
DeckSchema.index({ createdBy: 1 })
DeckSchema.index({ isPublic: 1 })
DeckSchema.index({ tags: 1 })

const Deck: Model<IDeck> = mongoose.models.Deck || mongoose.model<IDeck>("Deck", DeckSchema)

export default Deck

