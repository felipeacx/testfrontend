import React from "react"
import { FaExclamationTriangle, FaTimes } from "react-icons/fa"

interface ErrorMessageProps {
  message: string
  onClose?: () => void
  type?: "error" | "warning" | "info"
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose, type = "error" }) => {
  const styles = {
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      icon: "text-red-500",
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-800",
      icon: "text-yellow-500",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      icon: "text-blue-500",
    },
  }

  const style = styles[type]

  return (
    <div
      className={`${style.bg} border ${style.border} rounded-lg p-4 flex items-start space-x-3 animate-fade-in`}
    >
      <FaExclamationTriangle className={`${style.icon} flex-shrink-0 mt-0.5`} />
      <div className="flex-1">
        <p className={`text-sm ${style.text} font-medium`}>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`${style.text} hover:opacity-70 transition-opacity flex-shrink-0`}
          aria-label="Cerrar"
        >
          <FaTimes className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
