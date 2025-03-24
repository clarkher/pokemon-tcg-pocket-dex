import type { NextRequest } from "next/server"
import { getUserDecks } from "@/lib/api/routes/users"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return getUserDecks(req, { params })
}

