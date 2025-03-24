import mongoose, { Schema, type Document, type Model } from "mongoose"

interface Attack {
  name: string
  cost: string[]
  damage: string
  description: string
}

interface Weakness {
  type: string
  value: string
}

export interface ICard extends Document {
  name: string
  nameEn: string
  attribute: string
  rarity: string
  series: string
  expansion: string
  hp?: number
  type: string
  cardNumber: string
  releaseDate: Date
  imageUrl?: string
  attacks?: Attack[]
  weaknesses?: Weakness[]
  retreatCost?: number
  createdAt: Date
  updatedAt: Date
  createdBy: mongoose.Types.ObjectId
}

const CardSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    nameEn: { type: String, required: true },
    attribute: { type: String, required: true },
    rarity: { type: String, required: true },
    series: { type: String, required: true },
    expansion: { type: String, required: true },
    hp: { type: Number },
    type: { type: String, required: true },
    cardNumber: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    imageUrl: { type: String },
    attacks: [
      {
        name: { type: String, required: true },
        cost: [{ type: String, required: true }],
        damage: { type: String, required: true },
        description: { type: String },
      },
    ],
    weaknesses: [
      {
        type: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    retreatCost: { type: Number },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  },
)

// 創建索引以提高搜索性能
CardSchema.index({ name: "text", nameEn: "text" })
CardSchema.index({ attribute: 1 })
CardSchema.index({ rarity: 1 })
CardSchema.index({ series: 1 })
CardSchema.index({ expansion: 1 })

const Card: Model<ICard> = mongoose.models.Card || mongoose.model<ICard>("Card", CardSchema)

export default Card

