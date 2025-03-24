"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function EventFilters() {
  const statusFilters = [
    { id: "all", label: "全部活動", active: true },
    { id: "active", label: "進行中", active: false },
    { id: "upcoming", label: "即將開始", active: false },
    { id: "completed", label: "已結束", active: false },
  ]

  const typeFilters = [
    { id: "special-passport", label: "特級護照", active: false },
    { id: "mission", label: "任務", active: false },
    { id: "card-challenge", label: "得卡挑戰", active: false },
    { id: "solo-battle", label: "單人對戰", active: false },
    { id: "tournament", label: "錦標賽", active: false },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((filter) => (
          <Button key={filter.id} variant={filter.active ? "default" : "outline"} className="rounded-full">
            {filter.label}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {typeFilters.map((filter) => (
          <Badge
            key={filter.id}
            variant={filter.active ? "default" : "outline"}
            className="cursor-pointer px-3 py-1 text-sm"
          >
            {filter.label}
          </Badge>
        ))}
      </div>
    </div>
  )
}

