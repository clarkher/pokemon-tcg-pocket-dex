import { loginUser } from "@/lib/api/routes/auth"

export async function POST(req: Request) {
  return loginUser(req)
}

