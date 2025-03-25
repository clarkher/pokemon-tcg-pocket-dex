import { googleAuth } from "@/lib/api/routes/auth"

export async function GET(req: Request) {
  return googleAuth(req)
}

