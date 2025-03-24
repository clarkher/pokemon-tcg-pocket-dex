import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/db/mongodb"
import { Comment, Deck, User, Notification } from "@/lib/db/models"
import { withAuth } from "@/lib/auth"

// 獲取牌組評論
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 連接到數據庫
    await connectToDatabase()

    const deckId = params.id

    // 查找牌組
    const deck = await Deck.findById(deckId)

    if (!deck) {
      return NextResponse.json({ error: "牌組不存在" }, { status: 404 })
    }

    // 獲取評論
    const comments = await Comment.find({
      targetType: "deck",
      targetId: deckId,
    })
      .sort({ createdAt: -1 })
      .populate("createdBy", "username avatar")

    // 格式化評論
    const formattedComments = comments.map((comment) => ({
      _id: comment._id,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      likes: comment.likes,
      user: comment.createdBy,
    }))

    return NextResponse.json({ comments: formattedComments })
  } catch (error) {
    console.error("獲取評論錯誤:", error)
    return NextResponse.json({ error: "獲取評論過程中發生錯誤" }, { status: 500 })
  }
}

// 添加評論
async function addComment(req: NextRequest, userId: string, { params }: { params: { id: string } }) {
  try {
    // 連接到數據庫
    await connectToDatabase()

    const deckId = params.id
    const { content } = await req.json()

    if (!content || content.trim() === "") {
      return NextResponse.json({ error: "評論內容不能為空" }, { status: 400 })
    }

    // 查找牌組
    const deck = await Deck.findById(deckId)

    if (!deck) {
      return NextResponse.json({ error: "牌組不存在" }, { status: 404 })
    }

    // 創建評論
    const comment = new Comment({
      content,
      targetType: "deck",
      targetId: deckId,
      createdBy: userId,
      likes: [],
    })

    await comment.save()

    // 獲取用戶信息
    const user = await User.findById(userId).select("username avatar")

    // 如果不是自己的牌組，創建通知
    if (deck.createdBy.toString() !== userId) {
      const notification = new Notification({
        type: "comment",
        message: "有人評論了您的牌組",
        targetType: "deck",
        targetId: deckId,
        userId: deck.createdBy,
        triggeredBy: userId,
      })

      await notification.save()
    }

    // 格式化評論
    const formattedComment = {
      _id: comment._id,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      likes: comment.likes,
      user,
    }

    return NextResponse.json({
      success: true,
      message: "評論發表成功",
      comment: formattedComment,
    })
  } catch (error) {
    console.error("添加評論錯誤:", error)
    return NextResponse.json({ error: "添加評論過程中發生錯誤" }, { status: 500 })
  }
}

export const POST = withAuth(addComment)

