import type { NextRequest } from "next/server"
import { googleLogin } from "@/lib/api/routes/auth"

export async function POST(req: NextRequest) {
  return googleLogin(req)
}

