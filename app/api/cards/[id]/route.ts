import type { NextRequest } from "next/server"
import { getCard, updateCard, deleteCard } from "@/lib/api/routes/cards"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return getCard(req, { params })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return updateCard(req, { params })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return deleteCard(req, { params })
}

