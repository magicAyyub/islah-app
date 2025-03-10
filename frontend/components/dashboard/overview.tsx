"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Jan",
    total: 45,
  },
  {
    name: "Feb",
    total: 52,
  },
  {
    name: "Mar",
    total: 48,
  },
  {
    name: "Apr",
    total: 61,
  },
  {
    name: "May",
    total: 55,
  },
  {
    name: "Jun",
    total: 67,
  },
  {
    name: "Jul",
    total: 60,
  },
  {
    name: "Aug",
    total: 72,
  },
  {
    name: "Sep",
    total: 80,
  },
  {
    name: "Oct",
    total: 75,
  },
  {
    name: "Nov",
    total: 85,
  },
  {
    name: "Dec",
    total: 90,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}

