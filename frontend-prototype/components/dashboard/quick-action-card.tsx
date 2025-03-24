import type { ReactNode } from "react"
import Link from "next/link"

interface QuickActionCardProps {
  title: string
  description: string
  icon: ReactNode
  href: string
  gradient: string
  iconBgClass: string
}

export function QuickActionCard({ title, description, icon, href, gradient, iconBgClass }: QuickActionCardProps) {
  return (
    <Link href={href} className="group">
      <div className="relative h-full overflow-hidden rounded-2xl shadow-lg transition-all duration-500 group-hover:shadow-xl">
        <div className={`absolute inset-0 ${gradient} opacity-90 z-0`}></div>
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=400')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
        <div className="relative z-10 p-6 h-full flex flex-col">
          <div className={`w-14 h-14 rounded-2xl ${iconBgClass} flex items-center justify-center mb-auto`}>{icon}</div>
          <h2 className="text-xl font-bold text-white mt-auto mb-1">{title}</h2>
          <p className="text-white/80 text-sm mb-4">{description}</p>
          <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full w-0 group-hover:w-full transition-all duration-700"></div>
          </div>
        </div>
      </div>
    </Link>
  )
}

