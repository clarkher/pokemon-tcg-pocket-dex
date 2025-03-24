import type { NextRequest } from "next/server"
import { register } from "@/lib/api/routes/auth"

export async function POST(req: NextRequest) {
  return register(req)
}

