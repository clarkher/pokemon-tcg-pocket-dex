import type { NextRequest } from "next/server"
import { getDeck, updateDeck, deleteDeck } from "@/lib/api/routes/decks"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return getDeck(req, { params })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return updateDeck(req, { params })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return deleteDeck(req, { params })
}

