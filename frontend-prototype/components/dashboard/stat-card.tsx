"use client"

import type { ReactNode } from "react"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: ReactNode
  iconBgColor: string
  iconColor: string
  trend?: {
    value: string
    isPositive?: boolean
  }
  onClick?: () => void
}

export function StatCard({ title, value, subtitle, icon, iconBgColor, iconColor, trend, onClick }: StatCardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className={`w-10 h-10 rounded-full ${iconBgColor} flex items-center justify-center`}>
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-800">{value}</div>
      {subtitle && <div className="text-sm text-gray-500 mt-1">{subtitle}</div>}
      {trend && (
        <div className="flex items-center gap-1 mt-1 text-sm">
          {trend.isPositive ? (
            <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          ) : (
            <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          )}
          <span className={trend.isPositive ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
            {trend.value}
          </span>
        </div>
      )}
    </div>
  )
}

