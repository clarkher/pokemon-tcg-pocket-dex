import type { NextRequest } from "next/server"
import { login } from "@/lib/api/routes/auth"

export async function POST(req: NextRequest) {
  return login(req)
}

