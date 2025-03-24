import type { ReactNode } from "react"

interface DashboardSectionProps {
  title?: string
  description?: string
  children: ReactNode
  className?: string
}

export function DashboardSection({ title, description, children, className = "" }: DashboardSectionProps) {
  return (
    <div className={`mb-8 ${className}`}>
      {(title || description) && (
        <div className="mb-4">
          {title && <h2 className="text-xl font-bold text-gray-800 mb-1">{title}</h2>}
          {description && <p className="text-gray-600">{description}</p>}
        </div>
      )}
      {children}
    </div>
  )
}

