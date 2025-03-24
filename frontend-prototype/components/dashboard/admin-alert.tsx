"use client"

import type React from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { MessageSquare } from "lucide-react"

interface AdminAlertProps {
  title?: string
  message: string
  icon?: React.ReactNode
  variant?: "default" | "info" | "warning" | "error" | "success"
  onDismiss?: () => void
}

export function AdminAlert({
  title = "Message de l'administration",
  message,
  icon = <MessageSquare className="h-4 w-4" />,
  variant = "default",
  onDismiss,
}: AdminAlertProps) {
  // Définir les styles en fonction de la variante
  const styles = {
    default: {
      border: "border-[#6c63ff]",
      bg: "bg-[#f0eeff]",
      iconColor: "text-[#6c63ff]",
      titleColor: "text-[#6c63ff]",
    },
    info: {
      border: "border-blue-200",
      bg: "bg-blue-50",
      iconColor: "text-blue-500",
      titleColor: "text-blue-700",
    },
    warning: {
      border: "border-amber-200",
      bg: "bg-amber-50",
      iconColor: "text-amber-500",
      titleColor: "text-amber-700",
    },
    error: {
      border: "border-red-200",
      bg: "bg-red-50",
      iconColor: "text-red-500",
      titleColor: "text-red-700",
    },
    success: {
      border: "border-green-200",
      bg: "bg-green-50",
      iconColor: "text-green-500",
      titleColor: "text-green-700",
    },
  }

  const currentStyle = styles[variant]

  return (
    <Alert className={`mb-8 ${currentStyle.border} ${currentStyle.bg}`}>
      <div className={currentStyle.iconColor}>{icon}</div>
      <AlertTitle className={currentStyle.titleColor}>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20"
          aria-label="Fermer"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </Alert>
  )
}

