import type { Country, City, Center, VisualizationMetrics } from "../types/ikusiTypes"
import { ikusiCountries, ikusiCities, ikusiCenters, metrics2024 } from "../data/ikusiData"

const simulateDelay = (min: number = 300, max: number = 1500) => {
  return new Promise((resolve) =>
    setTimeout(resolve, Math.floor(Math.random() * (max - min + 1)) + min)
  )
}

const simulateError = (probability: number = 0.05) => {
  if (Math.random() < probability) {
    throw new Error("Error de conexión al servidor. Por favor, intenta nuevamente.")
  }
}

export class IkusiService {
  static async getCountries(): Promise<Country[]> {
    await simulateDelay()
    simulateError()
    return ikusiCountries
  }

  static async getCitiesByCountry(countryId: string): Promise<City[]> {
    await simulateDelay()
    simulateError()
    return ikusiCities.filter((city) => city.countryId === countryId)
  }

  static async getCentersByCity(cityId: string): Promise<Center[]> {
    await simulateDelay()
    simulateError()
    return ikusiCenters.filter((center) => center.cityId === cityId)
  }

  static async getCentersByCountry(countryId: string): Promise<Center[]> {
    await simulateDelay()
    simulateError()
    const countryCities = ikusiCities
      .filter((city) => city.countryId === countryId)
      .map((city) => city.id)

    return ikusiCenters.filter((center) => countryCities.includes(center.cityId))
  }

  static async getMetrics(filters?: {
    countryId?: string
    cityId?: string
    centerId?: string
  }): Promise<VisualizationMetrics> {
    await simulateDelay()
    simulateError()

    // Si no hay filtros, devolver datos globales
    if (!filters || (!filters.countryId && !filters.cityId && !filters.centerId)) {
      return metrics2024
    }

    // Determinar qué centros incluir según los filtros
    let filteredCenters = ikusiCenters

    if (filters.centerId) {
      filteredCenters = ikusiCenters.filter((center) => center.id === filters.centerId)
    } else if (filters.cityId) {
      filteredCenters = ikusiCenters.filter((center) => center.cityId === filters.cityId)
    } else if (filters.countryId) {
      const countryCities = ikusiCities
        .filter((city) => city.countryId === filters.countryId)
        .map((city) => city.id)
      filteredCenters = ikusiCenters.filter((center) => countryCities.includes(center.cityId))
    }

    // Si no hay centros después del filtrado, devolver datos vacíos coherentes
    if (filteredCenters.length === 0) {
      return {
        salesByService: [],
        projectsByRegion: [],
        technologiesByCenter: [],
        annualGrowth: metrics2024.annualGrowth.map((g) => ({
          ...g,
          revenue: 0,
          projects: 0,
          employees: 0,
        })),
      }
    }

    // Calcular métricas basadas en los centros filtrados
    const totalRevenue = filteredCenters.reduce((sum, center) => sum + center.annualRevenue, 0)
    const totalProjects = filteredCenters.reduce((sum, center) => sum + center.activeProjects, 0)
    const totalEmployees = filteredCenters.reduce((sum, center) => sum + center.employees, 0)

    // Agrupar ventas por servicio
    const serviceRevenue: Record<string, number> = {}
    filteredCenters.forEach((center) => {
      center.services.forEach((service) => {
        const revenuePerService = center.annualRevenue / center.services.length
        serviceRevenue[service] = (serviceRevenue[service] || 0) + revenuePerService
      })
    })

    // Mapear servicios a nombres legibles
    const serviceNames: Record<string, string> = {
      transporte: "Sistemas de Transporte Ferroviario",
      aeropuertos: "Gestión de Aeropuertos",
      ciudades_inteligentes: "Ciudades Inteligentes",
      energía: "Sistemas de Energía",
      defensa: "Defensa y Seguridad",
    }

    const filteredSalesByService = Object.entries(serviceRevenue).map(([service, value]) => ({
      service: serviceNames[service] || service,
      value: Math.round(value),
      percentage: Math.round((value / totalRevenue) * 100),
    }))

    // Filtrar proyectos por región
    const country = filters.countryId
      ? ikusiCountries.find((c) => c.id === filters.countryId)
      : null
    const filteredProjectsByRegion = country
      ? [{ region: country.region, projects: totalProjects, revenue: totalRevenue }]
      : metrics2024.projectsByRegion
          .map((pr) => {
            const regionCenters = filteredCenters.filter((center) => {
              const city = ikusiCities.find((c) => c.id === center.cityId)
              const centerCountry = city
                ? ikusiCountries.find((co) => co.id === city.countryId)
                : null
              return centerCountry?.region === pr.region
            })
            const regionRevenue = regionCenters.reduce((sum, c) => sum + c.annualRevenue, 0)
            const regionProjects = regionCenters.reduce((sum, c) => sum + c.activeProjects, 0)
            return {
              region: pr.region,
              projects: regionProjects,
              revenue: regionRevenue,
            }
          })
          .filter((pr) => pr.projects > 0)

    // Filtrar tecnologías por centro
    const filteredTechnologiesByCenter = metrics2024.technologiesByCenter.filter((tech) =>
      filteredCenters.some((center) => center.name === tech.center)
    )

    // Calcular crecimiento anual (proporcional basado en datos actuales)
    const growthRatio = totalRevenue / metrics2024.annualGrowth[4].revenue
    const projectRatio = totalProjects / metrics2024.annualGrowth[4].projects

    const filteredAnnualGrowth = metrics2024.annualGrowth.map((growth) => ({
      ...growth,
      revenue: Math.round(growth.revenue * growthRatio),
      projects: Math.round(growth.projects * projectRatio),
      employees:
        growth.year === 2024
          ? totalEmployees
          : Math.round(totalEmployees * (growth.employees / 1120)),
    }))

    return {
      salesByService: filteredSalesByService,
      projectsByRegion: filteredProjectsByRegion,
      technologiesByCenter: filteredTechnologiesByCenter,
      annualGrowth: filteredAnnualGrowth,
    }
  }

  static async getGlobalSummary() {
    await simulateDelay()
    simulateError()

    const totalEmployees = ikusiCenters.reduce((sum, center) => sum + center.employees, 0)
    const totalRevenue = ikusiCenters.reduce((sum, center) => sum + center.annualRevenue, 0)
    const totalProjects = ikusiCenters.reduce((sum, center) => sum + center.activeProjects, 0)

    return {
      employees: totalEmployees,
      revenue: totalRevenue,
      projects: totalProjects,
      centers: ikusiCenters.length,
      countries: ikusiCountries.length,
    }
  }
}
