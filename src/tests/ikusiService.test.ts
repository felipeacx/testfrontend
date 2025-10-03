import { describe, it, expect, vi, beforeEach } from "vitest"
import { IkusiService } from "../services/ikusiService"

// Mock simulateDelay and simulateError to avoid actual delays and errors
vi.mock("../services/ikusiService", async () => {
  const actual = await vi.importActual("../services/ikusiService")
  return {
    ...actual,
    IkusiService: {
      getCountries: vi.fn(),
      getCitiesByCountry: vi.fn(),
      getCentersByCity: vi.fn(),
      getMetrics: vi.fn(),
      getGlobalSummary: vi.fn(),
    },
  }
})

describe("IkusiService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("getCountries", () => {
    it("should return list of countries", async () => {
      const mockCountries = [
        { id: "es", name: "Spain", code: "ES", region: "Europa" },
        { id: "mx", name: "Mexico", code: "MX", region: "América" },
      ]

      vi.mocked(IkusiService.getCountries).mockResolvedValue(mockCountries)

      const result = await IkusiService.getCountries()

      expect(result).toEqual(mockCountries)
      expect(result).toHaveLength(2)
    })
  })

  describe("getCitiesByCountry", () => {
    it("should return cities filtered by country", async () => {
      const mockCities = [
        { id: "mad", name: "Madrid", countryId: "es", population: 3223000, isCapital: true },
        { id: "bcn", name: "Barcelona", countryId: "es", population: 1620000, isCapital: false },
      ]

      vi.mocked(IkusiService.getCitiesByCountry).mockResolvedValue(mockCities)

      const result = await IkusiService.getCitiesByCountry("es")

      expect(result).toEqual(mockCities)
      expect(result.every((city) => city.countryId === "es")).toBe(true)
    })
  })

  describe("getCentersByCity", () => {
    it("should return centers filtered by city", async () => {
      const mockCenters = [
        {
          id: "ikusi-madrid",
          name: "Oficina Madrid",
          cityId: "mad",
          type: "oficina" as const,
          employees: 120,
          services: ["transporte", "aeropuertos"],
          annualRevenue: 28000000,
          activeProjects: 18,
        },
      ]

      vi.mocked(IkusiService.getCentersByCity).mockResolvedValue(mockCenters)

      const result = await IkusiService.getCentersByCity("mad")

      expect(result).toEqual(mockCenters)
      expect(result[0].cityId).toBe("mad")
    })
  })

  describe("getGlobalSummary", () => {
    it("should return global summary with totals", async () => {
      const mockSummary = {
        employees: 1220,
        revenue: 296500000,
        projects: 164,
        centers: 10,
        countries: 8,
      }

      vi.mocked(IkusiService.getGlobalSummary).mockResolvedValue(mockSummary)

      const result = await IkusiService.getGlobalSummary()

      expect(result).toEqual(mockSummary)
      expect(result.employees).toBeGreaterThan(0)
      expect(result.revenue).toBeGreaterThan(0)
    })
  })

  describe("getMetrics", () => {
    it("should return metrics without filters", async () => {
      const mockMetrics = {
        salesByService: [{ service: "Transporte", value: 89000000, percentage: 35 }],
        projectsByRegion: [{ region: "Europa", projects: 59, revenue: 153000000 }],
        technologiesByCenter: [{ center: "Sede Ikusi", technologies: 12, specialization: "R&D&I" }],
        annualGrowth: [{ year: 2024, revenue: 296500000, projects: 164, employees: 1220 }],
      }

      vi.mocked(IkusiService.getMetrics).mockResolvedValue(mockMetrics)

      const result = await IkusiService.getMetrics()

      expect(result).toEqual(mockMetrics)
      expect(result.salesByService).toBeDefined()
      expect(result.projectsByRegion).toBeDefined()
    })

    it("should return filtered metrics by country", async () => {
      const mockFilteredMetrics = {
        salesByService: [{ service: "Transporte", value: 50000000, percentage: 50 }],
        projectsByRegion: [{ region: "Europa", projects: 45, revenue: 125000000 }],
        technologiesByCenter: [{ center: "Sede Ikusi", technologies: 12, specialization: "R&D&I" }],
        annualGrowth: [{ year: 2024, revenue: 125000000, projects: 45, employees: 655 }],
      }

      vi.mocked(IkusiService.getMetrics).mockResolvedValue(mockFilteredMetrics)

      const result = await IkusiService.getMetrics({ countryId: "es" })

      expect(result).toEqual(mockFilteredMetrics)
    })
  })
})
