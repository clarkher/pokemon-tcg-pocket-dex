import type { NextRequest } from "next/server"
import { registerEvent } from "@/lib/api/routes/events"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  return registerEvent(req, { params })
}

