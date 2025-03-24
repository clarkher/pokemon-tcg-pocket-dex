import type { NextRequest } from "next/server"
import { getEvent, updateEvent, deleteEvent } from "@/lib/api/routes/events"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return getEvent(req, { params })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return updateEvent(req, { params })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return deleteEvent(req, { params })
}

