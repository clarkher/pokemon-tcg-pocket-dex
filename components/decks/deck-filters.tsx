"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

// 能量類型選項
const energyTypes = [
  { id: "grass", label: "草" },
  { id: "fire", label: "火" },
  { id: "water", label: "水" },
  { id: "electric", label: "雷" },
  { id: "psychic", label: "超能" },
  { id: "fighting", label: "格鬥" },
  { id: "dark", label: "惡" },
  { id: "steel", label: "鋼" },
  { id: "colorless", label: "無色" },
]

export function DeckFilters() {
  const [selectedEnergyTypes, setSelectedEnergyTypes] = useState<string[]>([])
  const [dateFilter, setDateFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")

  const handleEnergyTypeChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedEnergyTypes([...selectedEnergyTypes, id])
    } else {
      setSelectedEnergyTypes(selectedEnergyTypes.filter((item) => item !== id))
    }
  }

  const resetFilters = () => {
    setSelectedEnergyTypes([])
    setDateFilter("all")
    setSortBy("date")
    setSortOrder("desc")
  }

  const hasActiveFilters =
    selectedEnergyTypes.length > 0 || dateFilter !== "all" || sortBy !== "date" || sortOrder !== "desc"

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">篩選條件</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2">
            <X className="mr-1 h-4 w-4" />
            重置
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="dateFilter">更新日期</Label>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger id="dateFilter">
              <SelectValue placeholder="選擇時間範圍" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有時間</SelectItem>
              <SelectItem value="week">過去一周</SelectItem>
              <SelectItem value="month">過去一個月</SelectItem>
              <SelectItem value="year">過去一年</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sortBy">排序方式</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger id="sortBy">
              <SelectValue placeholder="選擇排序方式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">更新日期</SelectItem>
              <SelectItem value="likes">點讚數</SelectItem>
              <SelectItem value="views">瀏覽數</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sortOrder">排序順序</Label>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger id="sortOrder">
              <SelectValue placeholder="選擇排序順序" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">降序 (高到低)</SelectItem>
              <SelectItem value="asc">升序 (低到高)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Accordion type="multiple" defaultValue={["energyTypes"]} className="w-full">
        <AccordionItem value="energyTypes">
          <AccordionTrigger>能量類型</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {energyTypes.map((energyType) => (
                <div key={energyType.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`energy-${energyType.id}`}
                    checked={selectedEnergyTypes.includes(energyType.id)}
                    onCheckedChange={(checked) => handleEnergyTypeChange(energyType.id, checked as boolean)}
                  />
                  <Label htmlFor={`energy-${energyType.id}`}>{energyType.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="pt-4">
        <Button className="w-full">套用篩選</Button>
      </div>
    </div>
  )
}

