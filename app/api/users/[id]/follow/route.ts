import type { NextRequest } from "next/server"
import { followUser } from "@/lib/api/routes/users"
import { withAuth } from "@/lib/auth"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  return withAuth((req, userId) => followUser(req, { params }))(req)
}

