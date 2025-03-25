"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "一月",
    cards: 12,
    decks: 8,
    users: 25,
  },
  {
    name: "二月",
    cards: 18,
    decks: 12,
    users: 30,
  },
  {
    name: "三月",
    cards: 24,
    decks: 18,
    users: 42,
  },
  {
    name: "四月",
    cards: 32,
    decks: 24,
    users: 58,
  },
  {
    name: "五月",
    cards: 40,
    decks: 30,
    users: 70,
  },
  {
    name: "六月",
    cards: 48,
    decks: 36,
    users: 85,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Bar dataKey="cards" name="卡牌" fill="#adfa1d" radius={[4, 4, 0, 0]} />
        <Bar dataKey="decks" name="牌組" fill="#f97316" radius={[4, 4, 0, 0]} />
        <Bar dataKey="users" name="用戶" fill="#06b6d4" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

