import type { NextRequest } from "next/server"
import { getDecks, createDeck } from "@/lib/api/routes/decks"

export async function GET(req: NextRequest) {
  return getDecks(req)
}

export async function POST(req: NextRequest) {
  return createDeck(req)
}

