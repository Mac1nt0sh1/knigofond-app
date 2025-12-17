"use client"

import { useEffect, useState } from "react"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"

interface AlertProps {
  message: string
  type: "success" | "error" | "warning" | "info"
  onClose: () => void
  autoClose?: boolean
}

const alertStyles = {
  success: "bg-green-50 border-green-500 text-green-800 dark:bg-green-900/50 dark:text-green-200",
  error: "bg-red-50 border-red-500 text-red-800 dark:bg-red-900/50 dark:text-red-200",
  warning: "bg-yellow-50 border-yellow-500 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200",
  info: "bg-blue-50 border-blue-500 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200"
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info
}

const iconColors = {
  success: "text-green-500",
  error: "text-red-500",
  warning: "text-yellow-500",
  info: "text-blue-500"
}

export function Alert({ message, type, onClose, autoClose = true }: AlertProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [progress, setProgress] = useState(100)
  const Icon = icons[type]

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => {
      setIsVisible(true)
    })

    if (autoClose) {
      const duration = 4000
      const interval = 50
      const decrement = (interval / duration) * 100

      const progressTimer = setInterval(() => {
        setProgress(prev => Math.max(0, prev - decrement))
      }, interval)

      const closeTimer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 400)
      }, duration)

      return () => {
        clearTimeout(closeTimer)
        clearInterval(progressTimer)
      }
    }
  }, [autoClose, onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 400)
  }

  return (
    <div
      className={`fixed top-5 right-5 z-50 min-w-[300px] max-w-[400px] overflow-hidden rounded-xl shadow-lg border-l-4 transition-all duration-500 ease-out ${
        alertStyles[type]
      } ${isVisible 
        ? "opacity-100 translate-x-0" 
        : "opacity-0 translate-x-4"
      }`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 ${iconColors[type]}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 pt-0.5">
            <span className="font-medium">{message}</span>
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-all duration-300"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      
      {/* Progress bar */}
      {autoClose && (
        <div className="h-1 bg-black/5 dark:bg-white/10">
          <div
            className={`h-full transition-all duration-100 ease-linear ${
              type === "success" ? "bg-green-500" :
              type === "error" ? "bg-red-500" :
              type === "warning" ? "bg-yellow-500" : "bg-blue-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}


