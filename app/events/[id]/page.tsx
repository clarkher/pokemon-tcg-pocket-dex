import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PokemonLogo } from "@/components/pokemon-logo"
import { ChevronLeft, Calendar, MapPin, User, Clock, Award } from "lucide-react"

// 模擬活動詳細數據
const eventDetails = {
  id: "1",
  title: "真新鎮錦標賽",
  type: "特級護照",
  startDate: "2023-10-15",
  endDate: "2023-10-20",
  status: "進行中",
  location: "真新鎮寶可夢中心",
  organizer: "寶可夢聯盟",
  description:
    "一年一度的真新鎮錦標賽，歡迎所有訓練家參加。優勝者將獲得限定卡牌和獎品。本次比賽將採用最新的規則集，參賽者需要準備符合規定的60張卡牌牌組。比賽分為初級組、中級組和高級組，根據參賽者的經驗和技術水平進行分組。",
  imageUrl: "/placeholder.svg?height=400&width=800",
  rules: [
    "參賽者需攜帶有效的訓練家ID",
    "牌組必須包含60張卡牌",
    "禁止使用超夢EX和夢幻EX卡牌",
    "每位參賽者最多可攜帶2個牌組",
    "比賽採用瑞士輪賽制，最終決賽採用單淘汰賽制",
  ],
  prizes: [
    "冠軍：限定版噴火龍EX卡牌一張，寶可夢聯盟獎盃一座",
    "亞軍：限定版皮卡丘V卡牌一張，寶可夢聯盟獎牌一枚",
    "季軍：寶可夢卡牌補充包10包",
    "參與獎：寶可夢聯盟徽章一枚",
  ],
  participants: 128,
  registrationDeadline: "2023-10-14",
  registrationFee: "免費",
  contactPerson: "大木博士",
  contactEmail: "prof.oak@pokemon-league.com",
}

// 模擬相關活動數據
const relatedEvents = [
  {
    id: "2",
    title: "華藍市水系挑戰",
    type: "任務",
    startDate: "2023-11-05",
    endDate: "2023-11-10",
    status: "即將開始",
    location: "華藍道館",
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "3",
    title: "尼比市岩石系展示會",
    type: "得卡挑戰",
    startDate: "2023-09-20",
    endDate: "2023-09-25",
    status: "已結束",
    location: "尼比道館",
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
]

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      進行中: "green",
      即將開始: "blue",
      已結束: "secondary",
    }
    return colors[status] || "default"
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      特級護照: "purple",
      任務: "yellow",
      得卡挑戰: "orange",
      單人對戰: "destructive",
      錦標賽: "blue",
    }
    return colors[type] || "default"
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <PokemonLogo className="h-8 w-8" />
              <span className="text-xl font-bold">寶可夢集換式卡牌資料庫</span>
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/cards">卡牌</Link>
            <Link href="/decks">牌組</Link>
            <Link href="/events" className="font-bold">
              活動
            </Link>
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
            <Link href="/events">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">活動詳情</h1>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="relative mb-6 aspect-[2/1] w-full overflow-hidden rounded-lg">
                <Image
                  src={eventDetails.imageUrl || "/placeholder.svg"}
                  alt={eventDetails.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={getStatusColor(eventDetails.status) as any}>{eventDetails.status}</Badge>
                    <Badge variant={getTypeColor(eventDetails.type) as any}>{eventDetails.type}</Badge>
                  </div>
                  <h1 className="mt-2 text-2xl font-bold text-white md:text-3xl">{eventDetails.title}</h1>
                </div>
              </div>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>活動詳情</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">日期</p>
                        <p>
                          {eventDetails.startDate} 至 {eventDetails.endDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">地點</p>
                        <p>{eventDetails.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">主辦方</p>
                        <p>{eventDetails.organizer}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">報名截止</p>
                        <p>{eventDetails.registrationDeadline}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">活動描述</h3>
                    <p>{eventDetails.description}</p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>比賽規則</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {eventDetails.rules.map((rule, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                            {index + 1}
                          </span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>獎品設置</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {eventDetails.prizes.map((prize, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Award className="h-5 w-5 text-yellow" />
                          <span>{prize}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>活動資訊</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">參與人數</span>
                    <span className="font-medium">{eventDetails.participants} 人</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">報名費用</span>
                    <span className="font-medium">{eventDetails.registrationFee}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">聯絡人</span>
                    <span className="font-medium">{eventDetails.contactPerson}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">聯絡郵箱</span>
                    <span className="font-medium">{eventDetails.contactEmail}</span>
                  </div>

                  <Button className="mt-4 w-full">報名參加</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>相關活動</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedEvents.map((event) => (
                    <Link key={event.id} href={`/events/${event.id}`}>
                      <div className="flex gap-4 rounded-lg p-2 transition-colors hover:bg-muted">
                        <div className="relative h-16 w-16 overflow-hidden rounded">
                          <Image
                            src={event.imageUrl || "/placeholder.svg"}
                            alt={event.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <h3 className="font-medium">{event.title}</h3>
                          <div className="flex items-center justify-between">
                            <Badge variant={getTypeColor(event.type) as any} className="text-xs">
                              {event.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{event.startDate}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
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

