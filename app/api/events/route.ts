import type { NextRequest } from "next/server"
import { getEvents, createEvent } from "@/lib/api/routes/events"

export async function GET(req: NextRequest) {
  return getEvents(req)
}

export async function POST(req: NextRequest) {
  return createEvent(req)
}

