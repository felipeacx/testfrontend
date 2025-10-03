import React, { useState, useEffect, useCallback } from "react"
import {
  FaBuilding,
  FaGlobe,
  FaCity,
  FaIndustry,
  FaUsers,
  FaDollarSign,
  FaProjectDiagram,
} from "react-icons/fa"
import { IkusiService } from "../services/ikusiService"
import { ErrorMessage } from "./ErrorMessage"
import type { Country, City, Center, VisualizationLevel } from "../types/ikusiTypes"

interface DataCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color: string
  description?: string
  onClick?: () => void
  loading?: boolean
}

const DataCard: React.FC<DataCardProps> = ({
  title,
  value,
  icon,
  color,
  description,
  onClick,
  loading,
}) => (
  <div
    className={`bg-white rounded-lg shadow-sm border-l-4 p-6 transition-all hover:shadow-md ${
      onClick ? "cursor-pointer hover:scale-105" : ""
    } ${color}`}
    onClick={onClick}
  >
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <div className="text-2xl text-gray-600">{icon}</div>
      </div>
      <div className="ml-4 flex-1">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{loading ? "..." : value}</p>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
      </div>
    </div>
  </div>
)

interface DataVisualizerProps {
  level: VisualizationLevel
  selectedCountry?: string
  selectedCity?: string
  onNavigate: (level: VisualizationLevel, id?: string) => void
}

export const DataVisualizer: React.FC<DataVisualizerProps> = ({
  level,
  selectedCountry,
  selectedCity,
  onNavigate,
}) => {
  const [data, setData] = useState<(Country | City | Center)[]>([])
  const [summary, setSummary] = useState<{
    employees: number
    revenue: number
    projects: number
    centers: number
    countries: number
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")

  const loadData = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      switch (level) {
        case "global": {
          const globalSummary = await IkusiService.getGlobalSummary()
          setSummary(globalSummary)
          break
        }
        case "countries": {
          const countries = await IkusiService.getCountries()
          setData(countries)
          break
        }
        case "cities": {
          if (selectedCountry) {
            const cities = await IkusiService.getCitiesByCountry(selectedCountry)
            setData(cities)
          }
          break
        }
        case "centers": {
          if (selectedCity) {
            const centers = await IkusiService.getCentersByCity(selectedCity)
            setData(centers)
          }
          break
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al cargar los datos. Intenta nuevamente."
      setError(errorMessage)
      console.error("Error cargando datos:", error)
    } finally {
      setLoading(false)
    }
  }, [level, selectedCountry, selectedCity])

  useEffect(() => {
    loadData()
  }, [loadData])

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat("en-US").format(number)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage message={error} onClose={() => setError("")} />
        <button
          onClick={loadData}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (level === "global" && summary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <DataCard
          title="Empleados"
          value={formatNumber(summary.employees)}
          icon={<FaUsers />}
          color="border-secondary"
          description="Total en todos los centros"
          loading={loading}
        />
        <DataCard
          title="Ingresos Anuales"
          value={formatCurrency(summary.revenue)}
          icon={<FaDollarSign />}
          color="border-primary"
          description="Ingresos 2024"
          loading={loading}
        />
        <DataCard
          title="Proyectos Activos"
          value={formatNumber(summary.projects)}
          icon={<FaProjectDiagram />}
          color="border-purple-500"
          description="En desarrollo"
          loading={loading}
        />
        <DataCard
          title="Centros Operativos"
          value={formatNumber(summary.centers)}
          icon={<FaBuilding />}
          color="border-orange-500"
          description="Sedes y oficinas"
          onClick={() => onNavigate("countries")}
          loading={loading}
        />
        <DataCard
          title="Presencia Global"
          value={`${summary.countries} países`}
          icon={<FaGlobe />}
          color="border-primary"
          description="Alcance internacional"
          onClick={() => onNavigate("countries")}
          loading={loading}
        />
      </div>
    )
  }

  if (level === "countries") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {(data as Country[]).map((country) => (
          <DataCard
            key={country.id}
            title={country.name}
            value={country.code}
            icon={<FaGlobe />}
            color="border-primary"
            description={`Región: ${country.region}`}
            onClick={() => onNavigate("cities", country.id)}
            loading={loading}
          />
        ))}
      </div>
    )
  }

  if (level === "cities") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(data as City[]).map((city) => (
          <DataCard
            key={city.id}
            title={city.name}
            value={formatNumber(city.population)}
            icon={<FaCity />}
            color={city.isCapital ? "border-yellow-500" : "border-gray-500"}
            description={`${city.isCapital ? "Capital" : "Ciudad"} - Habitantes`}
            onClick={() => onNavigate("centers", city.id)}
            loading={loading}
          />
        ))}
      </div>
    )
  }

  if (level === "centers") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(data as Center[]).map((center) => (
          <div key={center.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <FaIndustry className="text-2xl text-blue-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{center.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {center.type.replace("_", " ")}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Empleados</p>
                <p className="text-xl font-semibold text-gray-900">{center.employees}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Proyectos</p>
                <p className="text-xl font-semibold text-gray-900">{center.activeProjects}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Ingresos Anuales</p>
              <p className="text-lg font-semibold text-green-600">
                {formatCurrency(center.annualRevenue)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Servicios</p>
              <div className="flex flex-wrap gap-2">
                {center.services.map((service, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize"
                  >
                    {service.replace("_", " ")}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="text-center py-8">
      <p className="text-gray-500">Cargando datos</p>
    </div>
  )
}
