import type { NextRequest } from "next/server"
import { getUser, updateUser, deleteUser } from "@/lib/api/routes/users"
import { withAuth, withAdmin } from "@/lib/auth"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return getUser(req, { params })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return withAuth((req, userId) => {
    // 檢查是否為本人或管理員
    // 實際應用中，這裡會檢查userId是否與params.id匹配，或者用戶是否為管理員
    return updateUser(req, { params })
  })(req)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return withAdmin(() => deleteUser(req, { params }))(req)
}

