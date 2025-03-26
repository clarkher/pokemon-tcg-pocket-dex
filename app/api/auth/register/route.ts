import { type NextRequest, NextResponse } from "next/server"
import { register } from "@/lib/api/routes/auth"

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json()

    if (!username || !email || !password) {
      return NextResponse.json({ error: "Username, email, and password are required" }, { status: 400 })
    }

    const result = await register(username, email, password)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 400 },
    )
  }
}

