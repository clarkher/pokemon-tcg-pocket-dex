import type { NextRequest } from "next/server"
import { getUsers } from "@/lib/api/routes/users"
import { withAdmin } from "@/lib/auth"

export async function GET(req: NextRequest) {
  return withAdmin(() => getUsers(req))(req)
}

