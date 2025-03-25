import type { NextRequest } from "next/server"
import { likeDeck } from "@/lib/api/routes/decks"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  return likeDeck(req, { params })
}

