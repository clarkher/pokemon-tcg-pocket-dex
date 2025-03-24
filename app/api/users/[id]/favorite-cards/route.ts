import type { NextRequest } from "next/server"
import { getUserFavoriteCards } from "@/lib/api/routes/users"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return getUserFavoriteCards(req, { params })
}

