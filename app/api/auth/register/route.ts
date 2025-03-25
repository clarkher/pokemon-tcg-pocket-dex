import { registerUser } from "@/lib/api/routes/auth"

export async function POST(req: Request) {
  return registerUser(req)
}

