import React from "react"
import { FaHome, FaSignOutAlt, FaChartBar, FaTable } from "react-icons/fa"
import { useAuth } from "../hooks/useAuth"
import type { VisualizationLevel } from "../types/ikusiTypes"

interface HeaderProps {
  level: VisualizationLevel
  activeView: "data" | "charts"
  onNavigate: (level: VisualizationLevel) => void
  onViewChange: (view: "data" | "charts") => void
}

export const Header: React.FC<HeaderProps> = ({ level, activeView, onNavigate, onViewChange }) => {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-gray-900">IKUSI</h1>
            </div>

            <nav className="hidden md:flex space-x-1">
              <button
                onClick={() => onNavigate("global")}
                className={`cursor-pointer px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  level === "global"
                    ? "bg-teal-100 text-primary"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FaHome className="inline mr-2" />
                Inicio
              </button>
              <button
                onClick={() => onNavigate("countries")}
                className={`cursor-pointer px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  level === "countries"
                    ? "bg-teal-100 text-primary"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Países
              </button>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onViewChange("data")}
                className={`cursor-pointer flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  activeView === "data" ? "bg-white text-primary shadow-sm" : "text-gray-600"
                }`}
              >
                <FaTable className="mr-1" />
                Datos
              </button>
              <button
                onClick={() => onViewChange("charts")}
                className={`cursor-pointer flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  activeView === "charts" ? "bg-white text-primary shadow-sm" : "text-gray-600"
                }`}
              >
                <FaChartBar className="mr-1" />
                Gráficos
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-sm">
                <p className="font-medium text-gray-900">{user?.name}</p>
                <p className="text-gray-500 text-xs">{user?.role}</p>
              </div>
              <button
                onClick={logout}
                className="cursor-pointer flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <FaSignOutAlt className="mr-2" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
