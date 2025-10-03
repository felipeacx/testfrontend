import React, { useState } from "react"
import { DataVisualizer } from "../components/DataVisualizer"
import { IkusiCharts } from "../components/IkusiCharts"
import { Header } from "../components/Header"
import { GlobalFilters } from "../components/GlobalFilters"
import { ikusiCountries, ikusiCities } from "../data/ikusiData"
import type { VisualizationLevel } from "../types/ikusiTypes"
import Footer from "../components/Footer"

export const Dashboard: React.FC = () => {
  const [level, setLevel] = useState<VisualizationLevel>("global")
  const [selectedCountry, setSelectedCountry] = useState<string>()
  const [selectedCity, setSelectedCity] = useState<string>()
  const [activeView, setActiveView] = useState<"data" | "charts">("data")

  // Filtros globales solo para gráficos
  const [filterCountry, setFilterCountry] = useState<string>()
  const [filterCity, setFilterCity] = useState<string>()

  const [navigationPath, setNavigationPath] = useState<
    Array<{
      level: VisualizationLevel
      id: string
      name: string
    }>
  >([])

  const handleNavigation = (newLevel: VisualizationLevel, id?: string) => {
    const newPath = [...navigationPath]

    switch (newLevel) {
      case "countries":
        setLevel("countries")
        setSelectedCountry(undefined)
        setSelectedCity(undefined)
        setNavigationPath([])
        break
      case "cities":
        if (id) {
          setSelectedCountry(id)
          setLevel("cities")
          setSelectedCity(undefined)
          setNavigationPath([{ level: "countries", id, name: getCountryName(id) }])
        }
        break
      case "centers":
        if (id) {
          setSelectedCity(id)
          setLevel("centers")
          newPath.push({ level: "cities", id, name: getCityName(id) })
          setNavigationPath(newPath)
        }
        break
      default:
        setLevel(newLevel)
    }
  }

  const handleBacktrack = (index: number) => {
    const item = navigationPath[index]
    const newPath = navigationPath.slice(0, index)
    setNavigationPath(newPath)

    if (item.level === "countries") {
      setLevel("cities")
      setSelectedCountry(item.id)
      setSelectedCity(undefined)
    } else if (item.level === "cities") {
      setLevel("centers")
      setSelectedCity(item.id)
    }
  }

  const getCountryName = (id: string): string => {
    const names: Record<string, string> = {
      es: "España",
      mx: "México",
      br: "Brasil",
      pe: "Perú",
      cl: "Chile",
      co: "Colombia",
      fr: "Francia",
      de: "Alemania",
    }
    return names[id] || id
  }

  const getCityName = (id: string): string => {
    const names: Record<string, string> = {
      mad: "Madrid",
      bcn: "Barcelona",
      bil: "Bilbao",
      cdmx: "Ciudad de México",
      gdl: "Guadalajara",
      sp: "São Paulo",
      rio: "Río de Janeiro",
      lima: "Lima",
      scl: "Santiago",
      bog: "Bogotá",
      par: "París",
      ber: "Berlín",
    }
    return names[id] || id
  }

  const getLevelTitle = (): string => {
    switch (level) {
      case "global":
        return "Visión Global de Ikusi"
      case "countries":
        return "Presencia por Países"
      case "cities":
        return `Ciudades en ${getCountryName(selectedCountry!)}`
      case "centers":
        return `Centros en ${getCityName(selectedCity!)}`
      default:
        return "Panel de Control"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        level={level}
        activeView={activeView}
        onNavigate={handleNavigation}
        onViewChange={setActiveView}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-14">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{getLevelTitle()}</h2>
              {navigationPath.length > 0 && (
                <nav className="mt-2">
                  <ol className="flex items-center space-x-2 text-sm text-gray-500">
                    <li>
                      <button
                        onClick={() => handleNavigation("global")}
                        className="text-primary hover:text-teal-800"
                      >
                        Inicio
                      </button>
                    </li>
                    {navigationPath.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <span className="mx-2">/</span>
                        <button
                          onClick={() => handleBacktrack(index)}
                          className="text-primary hover:text-teal-800"
                        >
                          {item.name}
                        </button>
                      </li>
                    ))}
                    <li className="flex items-center">
                      <span className="mx-2">/</span>
                      <span className="text-gray-900 font-medium">
                        {level === "cities" && "Ciudades"}
                        {level === "centers" && "Centros"}
                      </span>
                    </li>
                  </ol>
                </nav>
              )}
            </div>
          </div>
        </div>

        {activeView === "charts" && (
          <GlobalFilters
            countries={ikusiCountries.map((c) => ({ id: c.id, name: c.name }))}
            cities={ikusiCities.map((c) => ({ id: c.id, name: c.name, countryId: c.countryId }))}
            selectedCountry={filterCountry}
            selectedCity={filterCity}
            onCountryChange={setFilterCountry}
            onCityChange={setFilterCity}
          />
        )}

        <div className="space-y-6">
          {activeView === "data" ? (
            <DataVisualizer
              level={level}
              selectedCountry={selectedCountry}
              selectedCity={selectedCity}
              onNavigate={handleNavigation}
            />
          ) : (
            <IkusiCharts
              filters={{
                countryId: filterCountry,
                cityId: filterCity,
              }}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
