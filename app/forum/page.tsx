import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PokemonLogo } from "@/components/pokemon-logo"
import { MessageSquare, ThumbsUp, Eye, PlusCircle } from "lucide-react"

// 模擬論壇帖子數據
const posts = [
  {
    _id: "1",
    title: "新手求助：如何構建一個平衡的牌組？",
    content:
      "大家好，我是新手訓練家，剛開始玩寶可夢卡牌遊戲。想請教一下如何構建一個平衡的牌組？應該注意哪些要點？謝謝！",
    category: "新手問答",
    tags: ["新手", "牌組構築"],
    createdAt: "2023-09-15",
    createdBy: {
      _id: "user_101",
      username: "新手訓練家",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    likes: 24,
    views: 156,
    commentsCount: 12,
    isPinned: false,
    isLocked: false,
  },
  {
    _id: "2",
    title: "[官方公告] 2023年第四季度規則更新",
    content: "親愛的訓練家們，寶可夢卡牌遊戲將於2023年10月1日更新遊戲規則，主要變更包括...",
    category: "官方公告",
    tags: ["規則更新", "官方"],
    createdAt: "2023-09-20",
    createdBy: {
      _id: "admin",
      username: "管理員",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    likes: 89,
    views: 542,
    commentsCount: 35,
    isPinned: true,
    isLocked: false,
  },
  {
    _id: "3",
    title: "分享我的水系牌組構築心得",
    content:
      "經過幾個月的測試和調整，我的水系牌組終於在上週的比賽中獲得了冠軍！在這裡分享一下我的構築心得和比賽經驗...",
    category: "牌組分享",
    tags: ["水系", "比賽", "心得"],
    createdAt: "2023-09-25",
    createdBy: {
      _id: "user_456",
      username: "小霞",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    likes: 156,
    views: 723,
    commentsCount: 48,
    isPinned: false,
    isLocked: false,
  },
  {
    _id: "4",
    title: "真新鎮錦標賽參賽心得與照片分享",
    content: "上週末參加了真新鎮錦標賽，雖然只拿到了第四名，但是收穫頗豐！在這裡分享一下比賽的照片和心得...",
    category: "活動分享",
    tags: ["比賽", "真新鎮", "照片"],
    createdAt: "2023-09-28",
    createdBy: {
      _id: "user_123",
      username: "小智",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    likes: 78,
    views: 412,
    commentsCount: 23,
    isPinned: false,
    isLocked: false,
  },
  {
    _id: "5",
    title: "討論：目前遊戲環境中最強的屬性是什麼？",
    content: "隨著新擴充包的發布，遊戲環境發生了很大變化。大家覺得目前環境中最強的屬性是什麼？為什麼？",
    category: "遊戲討論",
    tags: ["環境分析", "屬性討論"],
    createdAt: "2023-09-30",
    createdBy: {
      _id: "user_789",
      username: "小剛",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    likes: 112,
    views: 589,
    commentsCount: 67,
    isPinned: false,
    isLocked: false,
  },
]

// 模擬論壇分類
const categories = [
  { id: "all", name: "全部", count: 256 },
  { id: "official", name: "官方公告", count: 12 },
  { id: "beginner", name: "新手問答", count: 45 },
  { id: "deck", name: "牌組分享", count: 78 },
  { id: "event", name: "活動分享", count: 34 },
  { id: "discussion", name: "遊戲討論", count: 87 },
]

// 模擬熱門標籤
const popularTags = [
  { id: "beginner", name: "新手", count: 56 },
  { id: "deck-building", name: "牌組構築", count: 89 },
  { id: "tournament", name: "比賽", count: 67 },
  { id: "water", name: "水系", count: 45 },
  { id: "electric", name: "雷系", count: 43 },
  { id: "fire", name: "火系", count: 41 },
  { id: "rule", name: "規則", count: 32 },
  { id: "strategy", name: "策略", count: 76 },
]

export default function ForumPage() {
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
            <Link href="/events">活動</Link>
            <Link href="/forum" className="font-bold">
              論壇
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
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">論壇</h1>
            <Link href="/forum/new">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                發布新帖子
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="relative">
                      <Input placeholder="搜尋帖子..." className="pr-10" />
                      <Button variant="ghost" size="icon" className="absolute right-0 top-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <circle cx="11" cy="11" r="8" />
                          <path d="m21 21-4.3-4.3" />
                        </svg>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h2 className="mb-4 text-lg font-semibold">分類</h2>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/forum/category/${category.id}`}
                          className="flex items-center justify-between rounded-md px-3 py-2 transition-colors hover:bg-muted"
                        >
                          <span>{category.name}</span>
                          <Badge variant="secondary">{category.count}</Badge>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h2 className="mb-4 text-lg font-semibold">熱門標籤</h2>
                    <div className="flex flex-wrap gap-2">
                      {popularTags.map((tag) => (
                        <Link key={tag.id} href={`/forum/tag/${tag.id}`}>
                          <Badge variant="outline" className="cursor-pointer">
                            {tag.name} ({tag.count})
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="space-y-4">
                {posts.map((post) => (
                  <Link key={post._id} href={`/forum/${post._id}`}>
                    <Card className={`transition-colors hover:bg-muted/50 ${post.isPinned ? "border-primary" : ""}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={post.createdBy.avatar} alt={post.createdBy.username} />
                            <AvatarFallback>{post.createdBy.username.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">
                                {post.isPinned && (
                                  <Badge variant="default" className="mr-2">
                                    置頂
                                  </Badge>
                                )}
                                {post.title}
                              </h3>
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{post.createdBy.username}</span>
                              <span>•</span>
                              <span>{post.createdAt}</span>
                              <span>•</span>
                              <Badge variant="outline">{post.category}</Badge>
                            </div>
                            <p className="mt-2 line-clamp-2 text-sm">{post.content}</p>
                            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <ThumbsUp className="h-4 w-4" />
                                <span>{post.likes}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>{post.commentsCount}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                <span>{post.views}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              <div className="mt-6 flex justify-center">
                <Button variant="outline" className="mx-1">
                  1
                </Button>
                <Button variant="outline" className="mx-1">
                  2
                </Button>
                <Button variant="outline" className="mx-1">
                  3
                </Button>
                <Button variant="outline" className="mx-1">
                  ...
                </Button>
                <Button variant="outline" className="mx-1">
                  10
                </Button>
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

