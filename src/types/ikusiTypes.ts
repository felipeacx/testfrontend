export interface Country {
  id: string
  name: string
  code: string
  region: string
}

export interface City {
  id: string
  name: string
  countryId: string
  population: number
  isCapital: boolean
}

export interface Center {
  id: string
  name: string
  cityId: string
  type: "sede" | "oficina" | "centro_de_desarrollo" | "fábrica"
  employees: number
  services: string[]
  annualRevenue: number
  activeProjects: number
}

export interface IkusiService {
  id: string
  name: string
  category: "transporte" | "energía" | "defensa" | "aeropuertos" | "ciudades_inteligentes"
  description: string
  technologies: string[]
}

export interface VisualizationMetrics {
  salesByService: { service: string; value: number; percentage: number }[]
  projectsByRegion: { region: string; projects: number; revenue: number }[]
  technologiesByCenter: { center: string; technologies: number; specialization: string }[]
  annualGrowth: { year: number; revenue: number; projects: number; employees: number }[]
}

export interface VisualizationFilters {
  services: string[]
  regions: string[]
  centerTypes: string[]
  startYear: number
  endYear: number
}

export type VisualizationLevel = "global" | "countries" | "cities" | "centers" | "services"

export interface VisualizationState {
  level: VisualizationLevel
  currentSelection: {
    country?: string
    city?: string
    center?: string
    service?: string
  }
  filters: VisualizationFilters
  navigationPath: Array<{
    level: VisualizationLevel
    id: string
    name: string
  }>
}
