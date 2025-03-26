import mongoose from "mongoose"

// 用戶模型
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "/images/default-avatar.png",
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
  decks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deck",
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// 卡片模型
const CardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  setName: {
    type: String,
    required: true,
    trim: true,
  },
  setCode: {
    type: String,
    required: true,
    trim: true,
  },
  number: {
    type: String,
    required: true,
    trim: true,
  },
  rarity: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    small: String,
    large: String,
  },
  types: [String],
  supertype: String,
  subtypes: [String],
  hp: String,
  rules: [String],
  attacks: [
    {
      name: String,
      cost: [String],
      convertedEnergyCost: Number,
      damage: String,
      text: String,
    },
  ],
  weaknesses: [
    {
      type: String,
      value: String,
    },
  ],
  resistances: [
    {
      type: String,
      value: String,
    },
  ],
  retreatCost: [String],
  convertedRetreatCost: Number,
  artist: String,
  flavorText: String,
  nationalPokedexNumbers: [Number],
  legalities: {
    standard: String,
    expanded: String,
    unlimited: String,
  },
  tcgplayerUrl: String,
  cardmarketUrl: String,
  priceData: {
    tcgplayer: {
      low: Number,
      mid: Number,
      high: Number,
      market: Number,
      directLow: Number,
    },
    cardmarket: {
      low: Number,
      trend: Number,
      avg1: Number,
      avg7: Number,
      avg30: Number,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// 牌組模型
const DeckSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  format: {
    type: String,
    enum: ["standard", "expanded", "unlimited", "other"],
    default: "standard",
  },
  cards: [
    {
      card: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Card",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  tags: [String],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// 評論模型
const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  deck: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Deck",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// 活動模型
const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  format: {
    type: String,
    enum: ["standard", "expanded", "unlimited", "other"],
    default: "standard",
  },
  maxParticipants: {
    type: Number,
    default: 0,
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["upcoming", "ongoing", "completed", "cancelled"],
    default: "upcoming",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// 通知模型
const NotificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  type: {
    type: String,
    enum: ["like", "comment", "follow", "event", "system"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  relatedItem: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "itemModel",
  },
  itemModel: {
    type: String,
    enum: ["Deck", "Comment", "User", "Event"],
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// 論壇帖子模型
const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
    enum: ["general", "strategy", "deck-building", "tournaments", "collecting", "other"],
    default: "general",
  },
  tags: [String],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  views: {
    type: Number,
    default: 0,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// 確保模型只被定義一次
const User = mongoose.models.User || mongoose.model("User", UserSchema)
const Card = mongoose.models.Card || mongoose.model("Card", CardSchema)
const Deck = mongoose.models.Deck || mongoose.model("Deck", DeckSchema)
const Comment = mongoose.models.Comment || mongoose.model("Comment", CommentSchema)
const Event = mongoose.models.Event || mongoose.model("Event", EventSchema)
const Notification = mongoose.models.Notification || mongoose.model("Notification", NotificationSchema)
const Post = mongoose.models.Post || mongoose.model("Post", PostSchema)

module.exports = {
  User,
  Card,
  Deck,
  Comment,
  Event,
  Notification,
  Post,
}

