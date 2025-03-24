import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return new NextResponse("Missing email or password", { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        role: "ADMIN",
      },
    })

    return NextResponse.json(user)
  } catch (error: any) {
    console.error("ADMIN_CREATE", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

