"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  color: "emerald" | "blue" | "amber" | "green"
  isLoading?: boolean
}

const colorClasses = {
  emerald: "from-emerald-500 to-emerald-600 text-emerald-600",
  blue: "from-blue-500 to-blue-600 text-blue-600",
  amber: "from-amber-500 to-amber-600 text-amber-600",
  green: "from-green-500 to-green-600 text-green-600",
}

export function StatsCard({ title, value, icon: Icon, color, isLoading }: StatsCardProps) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">{title}</p>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-3xl font-bold text-gray-900">{value}</p>
              )}
            </div>
            <div
              className={cn(
                "p-3 rounded-full bg-gradient-to-br",
                colorClasses[color].split(" ")[0] + " " + colorClasses[color].split(" ")[1],
              )}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
