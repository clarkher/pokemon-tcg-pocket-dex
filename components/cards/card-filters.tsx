"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { X } from "lucide-react"

// 屬性選項
const attributes = [
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

// 稀有度選項
const rarities = [
  { id: "common", label: "普通" },
  { id: "uncommon", label: "非普通" },
  { id: "rare", label: "稀有" },
  { id: "rareHolo", label: "稀有閃卡" },
  { id: "ultraRare", label: "超稀有" },
  { id: "secretRare", label: "秘密稀有" },
]

// 系列選項
const seriesOptions = [
  { id: "base", label: "基本系列" },
  { id: "jungle", label: "幻遊島" },
  { id: "fossil", label: "化石" },
  { id: "teamRocket", label: "火箭隊" },
  { id: "gymHeroes", label: "道館英雄" },
  { id: "gymChallenge", label: "道館挑戰" },
]

// 擴充包選項
const expansions = [
  { id: "base", label: "基本" },
  { id: "arceus", label: "阿爾宙斯" },
  { id: "charizard", label: "噴火龍" },
  { id: "dialga", label: "帝牙盧卡" },
  { id: "palkia", label: "帕路奇亞" },
  { id: "giratina", label: "騎拉帝納" },
]

export function CardFilters({ filters, onFilterChange }) {
  const [selectedAttributes, setSelectedAttributes] = useState(filters.attribute || [])
  const [selectedRarities, setSelectedRarities] = useState(filters.rarity || [])
  const [selectedSeries, setSelectedSeries] = useState(filters.series || [])
  const [selectedExpansions, setSelectedExpansions] = useState(filters.expansion || [])

  // 當選擇變更時更新父組件
  useEffect(() => {
    const newFilters = {
      attribute: selectedAttributes,
      rarity: selectedRarities,
      series: selectedSeries,
      expansion: selectedExpansions,
    }
    onFilterChange(newFilters)
  }, [selectedAttributes, selectedRarities, selectedSeries, selectedExpansions])

  const handleAttributeChange = (id, checked) => {
    if (checked) {
      setSelectedAttributes([...selectedAttributes, id])
    } else {
      setSelectedAttributes(selectedAttributes.filter((item) => item !== id))
    }
  }

  const handleRarityChange = (id, checked) => {
    if (checked) {
      setSelectedRarities([...selectedRarities, id])
    } else {
      setSelectedRarities(selectedRarities.filter((item) => item !== id))
    }
  }

  const handleSeriesChange = (id, checked) => {
    if (checked) {
      setSelectedSeries([...selectedSeries, id])
    } else {
      setSelectedSeries(selectedSeries.filter((item) => item !== id))
    }
  }

  const handleExpansionChange = (id, checked) => {
    if (checked) {
      setSelectedExpansions([...selectedExpansions, id])
    } else {
      setSelectedExpansions(selectedExpansions.filter((item) => item !== id))
    }
  }

  const resetFilters = () => {
    setSelectedAttributes([])
    setSelectedRarities([])
    setSelectedSeries([])
    setSelectedExpansions([])
  }

  const hasActiveFilters =
    selectedAttributes.length > 0 ||
    selectedRarities.length > 0 ||
    selectedSeries.length > 0 ||
    selectedExpansions.length > 0

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

      <Accordion type="multiple" defaultValue={["attributes", "rarities", "series", "expansions"]} className="w-full">
        <AccordionItem value="attributes">
          <AccordionTrigger>屬性</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {attributes.map((attribute) => (
                <div key={attribute.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`attribute-${attribute.id}`}
                    checked={selectedAttributes.includes(attribute.id)}
                    onCheckedChange={(checked) => handleAttributeChange(attribute.id, checked)}
                  />
                  <Label htmlFor={`attribute-${attribute.id}`}>{attribute.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="rarities">
          <AccordionTrigger>稀有度</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {rarities.map((rarity) => (
                <div key={rarity.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`rarity-${rarity.id}`}
                    checked={selectedRarities.includes(rarity.id)}
                    onCheckedChange={(checked) => handleRarityChange(rarity.id, checked)}
                  />
                  <Label htmlFor={`rarity-${rarity.id}`}>{rarity.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="series">
          <AccordionTrigger>系列</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {seriesOptions.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`series-${item.id}`}
                    checked={selectedSeries.includes(item.id)}
                    onCheckedChange={(checked) => handleSeriesChange(item.id, checked)}
                  />
                  <Label htmlFor={`series-${item.id}`}>{item.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="expansions">
          <AccordionTrigger>擴充包</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {expansions.map((expansion) => (
                <div key={expansion.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`expansion-${expansion.id}`}
                    checked={selectedExpansions.includes(expansion.id)}
                    onCheckedChange={(checked) => handleExpansionChange(expansion.id, checked)}
                  />
                  <Label htmlFor={`expansion-${expansion.id}`}>{expansion.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

