import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft } from "lucide-react"

// 模擬卡牌詳細數據
const cardDetails = {
  id: "1",
  name: "皮卡丘",
  nameEn: "Pikachu",
  attribute: "雷",
  rarity: "普通",
  series: "基本系列",
  expansion: "基本",
  hp: 60,
  type: "基本",
  cardNumber: "58/102",
  releaseDate: "1999-01-09",
  imageUrl: "/placeholder.svg?height=400&width=286",
  attacks: [
    {
      name: "電光一閃",
      cost: ["無色"],
      damage: "10",
      description: "無特殊效果。",
    },
    {
      name: "十萬伏特",
      cost: ["雷", "雷", "無色"],
      damage: "60",
      description: "擲硬幣一次，如果是反面，則對自己造成30點傷害。",
    },
  ],
  weaknesses: [
    {
      type: "格鬥",
      value: "×2",
    },
  ],
  retreatCost: 1,
}

export default function CardDetailPage({ params }: { params: { id: string } }) {
  const getAttributeColor = (attribute: string) => {
    const colors: Record<string, string> = {
      雷: "yellow",
      火: "destructive",
      水: "blue",
      草: "green",
      超能: "purple",
      格鬥: "orange",
      惡: "default",
      鋼: "secondary",
      無色: "default",
    }
    return colors[attribute] || "default"
  }

  const getEnergyCost = (cost: string[]) => {
    return cost.map((energy, index) => (
      <Badge key={index} variant={getAttributeColor(energy) as any} className="mr-1">
        {energy}
      </Badge>
    ))
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xl font-bold">
              寶可夢集換式卡牌資料庫
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/cards" className="font-bold">
              卡牌
            </Link>
            <Link href="/decks">牌組</Link>
            <Link href="/events">活動</Link>
            <Link href="/about">關於</Link>
            <Link href="/admin">
              <Button variant="outline">管理後台</Button>
            </Link>
            <Link href="/login">
              <Button>登入</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          <div className="mb-6 flex items-center gap-2">
            <Link href="/cards">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">卡牌詳情</h1>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex justify-center">
              <div className="relative aspect-[2/3] w-full max-w-[350px] overflow-hidden rounded-lg">
                <Image
                  src={cardDetails.imageUrl || "/placeholder.svg"}
                  alt={cardDetails.name}
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{cardDetails.name}</h2>
                  <p className="text-muted-foreground">{cardDetails.nameEn}</p>
                </div>
                <Badge variant={getAttributeColor(cardDetails.attribute) as any} className="text-lg">
                  {cardDetails.attribute}
                </Badge>
              </div>

              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">HP</p>
                      <p className="font-medium">{cardDetails.hp}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">類型</p>
                      <p className="font-medium">{cardDetails.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">稀有度</p>
                      <p className="font-medium">{cardDetails.rarity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">系列</p>
                      <p className="font-medium">{cardDetails.series}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">擴充包</p>
                      <p className="font-medium">{cardDetails.expansion}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">卡牌編號</p>
                      <p className="font-medium">{cardDetails.cardNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">發行日期</p>
                      <p className="font-medium">{cardDetails.releaseDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">撤退消耗</p>
                      <p className="font-medium">{cardDetails.retreatCost} 能量</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">招式</h3>
                {cardDetails.attacks.map((attack, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{attack.name}</h4>
                        <div className="flex items-center">{getEnergyCost(attack.cost)}</div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-sm">{attack.description}</p>
                        <p className="font-bold">{attack.damage}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">弱點</h3>
                {cardDetails.weaknesses.map((weakness, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge variant={getAttributeColor(weakness.type) as any}>{weakness.type}</Badge>
                    <span>{weakness.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 寶可夢集換式卡牌資料庫。保留所有權利。
          </p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="text-sm text-muted-foreground">
              關於
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground">
              隱私政策
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground">
              使用條款
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

