"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PokemonLogo } from "@/components/pokemon-logo"
import { LayoutDashboard, CreditCard, Users, Calendar, Settings, LogOut, FolderKanban } from "lucide-react"

const sidebarItems = [
  {
    title: "儀表板",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "卡牌管理",
    href: "/admin/cards",
    icon: CreditCard,
  },
  {
    title: "牌組管理",
    href: "/admin/decks",
    icon: FolderKanban,
  },
  {
    title: "活動管理",
    href: "/admin/events",
    icon: Calendar,
  },
  {
    title: "用戶管理",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "系統設置",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-muted/40">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <PokemonLogo className="h-6 w-6" />
          <span>管理後台</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon
            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  pathname === item.href && "bg-muted text-primary",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Button variant="outline" className="w-full justify-start gap-2">
          <LogOut className="h-4 w-4" />
          登出
        </Button>
      </div>
    </div>
  )
}

