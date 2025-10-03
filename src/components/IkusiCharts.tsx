import React, { useEffect, useState, useCallback } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Bar, Line, Doughnut } from "react-chartjs-2"
import { IkusiService } from "../services/ikusiService"
import { ErrorMessage } from "./ErrorMessage"
import type { VisualizationMetrics } from "../types/ikusiTypes"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

interface IkusiChartsProps {
  filters?: {
    countryId?: string
    cityId?: string
    centerId?: string
  }
}

export const IkusiCharts: React.FC<IkusiChartsProps> = ({ filters }) => {
  const [metrics, setMetrics] = useState<VisualizationMetrics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")

  const loadMetrics = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const data = await IkusiService.getMetrics(filters)
      setMetrics(data)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al cargar las métricas. Intenta nuevamente."
      setError(errorMessage)
      console.error("Error cargando métricas:", error)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    loadMetrics()
  }, [loadMetrics])

  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage message={error} onClose={() => setError("")} />
        <button
          onClick={loadMetrics}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay datos de métricas disponibles</p>
      </div>
    )
  }

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  }

  const salesByServiceData = {
    labels: metrics.salesByService.map((item) => item.service),
    datasets: [
      {
        label: "Ingresos ($)",
        data: metrics.salesByService.map((item) => item.value),
        backgroundColor: ["#00b88d", "#2563eb", "#f59e0b", "#ef4444", "#8b5cf6"],
        borderColor: ["#008a6a", "#1d4ed8", "#d97706", "#dc2626", "#7c3aed"],
        borderWidth: 1,
      },
    ],
  }

  const growthData = {
    labels: metrics.annualGrowth.map((item) => item.year.toString()),
    datasets: [
      {
        label: "Ingresos (M$)",
        data: metrics.annualGrowth.map((item) => item.revenue / 1000000),
        borderColor: "#00b88d",
        backgroundColor: "rgba(0, 184, 141, 0.1)",
        tension: 0.4,
        yAxisID: "y",
      },
      {
        label: "Proyectos",
        data: metrics.annualGrowth.map((item) => item.projects),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        tension: 0.4,
        yAxisID: "y1",
      },
    ],
  }

  const growthOptions = {
    ...commonOptions,
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "Ingresos (M$)",
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        title: {
          display: true,
          text: "Proyectos",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  }

  const regionData = {
    labels: metrics.projectsByRegion.map((item) => item.region),
    datasets: [
      {
        label: "Proyectos",
        data: metrics.projectsByRegion.map((item) => item.projects),
        backgroundColor: "#00b88d",
        borderColor: "#008a6a",
        borderWidth: 1,
      },
    ],
  }

  const technologiesData = {
    labels: metrics.technologiesByCenter.map((item) => item.center),
    datasets: [
      {
        label: "Tecnologías",
        data: metrics.technologiesByCenter.map((item) => item.technologies),
        backgroundColor: ["#00b88d", "#2563eb", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"].slice(
          0,
          metrics.technologiesByCenter.length
        ),
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingresos por Servicio</h3>
          <div className="h-64">
            <Bar data={salesByServiceData} options={commonOptions} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Proyectos por Región</h3>
          <div className="h-64">
            <Bar data={regionData} options={commonOptions} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolución Anual</h3>
        <div className="h-80">
          <Line data={growthData} options={growthOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Servicios</h3>
          <div className="h-64">
            <Doughnut data={salesByServiceData} options={commonOptions} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tecnologías por Centro</h3>
          <div className="h-64">
            <Doughnut data={technologiesData} options={commonOptions} />
          </div>
        </div>
      </div>
    </div>
  )
}
