import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IEvent extends Document {
  title: string
  type: string
  startDate: Date
  endDate: Date
  status: "upcoming" | "active" | "completed"
  location: string
  organizer: string
  description: string
  imageUrl?: string
  rules?: string[]
  prizes?: string[]
  participants?: mongoose.Types.ObjectId[]
  registrationDeadline?: Date
  registrationFee?: string
  contactPerson?: string
  contactEmail?: string
  createdAt: Date
  updatedAt: Date
  createdBy: mongoose.Types.ObjectId
}

const EventSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    type: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["upcoming", "active", "completed"],
      required: true,
    },
    location: { type: String, required: true },
    organizer: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
    rules: [{ type: String }],
    prizes: [{ type: String }],
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    registrationDeadline: { type: Date },
    registrationFee: { type: String },
    contactPerson: { type: String },
    contactEmail: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  },
)

// 創建索引以提高搜索性能
EventSchema.index({ title: "text", description: "text" })
EventSchema.index({ type: 1 })
EventSchema.index({ status: 1 })
EventSchema.index({ startDate: 1 })
EventSchema.index({ endDate: 1 })

const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema)

export default Event

