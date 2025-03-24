import type { NextRequest } from "next/server"
import { getCards, createCard } from "@/lib/api/routes/cards"

export async function GET(req: NextRequest) {
  return getCards(req)
}

export async function POST(req: NextRequest) {
  return createCard(req)
}

