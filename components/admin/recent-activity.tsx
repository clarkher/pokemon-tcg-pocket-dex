import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const activities = [
  {
    user: {
      name: "小智",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "小智",
    },
    action: "創建了新牌組",
    target: "皮卡丘之力",
    time: "2小時前",
  },
  {
    user: {
      name: "小霞",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "小霞",
    },
    action: "評論了",
    target: "水系策略",
    time: "4小時前",
  },
  {
    user: {
      name: "小剛",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "小剛",
    },
    action: "點讚了",
    target: "岩石堅固牌組",
    time: "5小時前",
  },
  {
    user: {
      name: "小茂",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "小茂",
    },
    action: "添加了新卡牌",
    target: "噴火龍EX",
    time: "1天前",
  },
  {
    user: {
      name: "大木博士",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "大木",
    },
    action: "創建了新活動",
    target: "真新鎮錦標賽",
    time: "2天前",
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-8">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
            <AvatarFallback>{activity.user.initials}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {activity.user.name} <span className="text-muted-foreground">{activity.action}</span>{" "}
              <span className="font-medium">{activity.target}</span>
            </p>
            <p className="text-sm text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

