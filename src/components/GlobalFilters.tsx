import React from "react"
import { FaFilter, FaTimes } from "react-icons/fa"

interface GlobalFiltersProps {
  countries: Array<{ id: string; name: string }>
  cities: Array<{ id: string; name: string; countryId: string }>
  selectedCountry?: string
  selectedCity?: string
  onCountryChange: (countryId: string | undefined) => void
  onCityChange: (cityId: string | undefined) => void
}

export const GlobalFilters: React.FC<GlobalFiltersProps> = ({
  countries,
  cities,
  selectedCountry,
  selectedCity,
  onCountryChange,
  onCityChange,
}) => {
  const filteredCities = selectedCountry
    ? cities.filter((city) => city.countryId === selectedCountry)
    : cities

  const handleClearFilters = () => {
    onCountryChange(undefined)
    onCityChange(undefined)
  }

  const hasActiveFilters = selectedCountry || selectedCity

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FaFilter className="text-primary" />
          <h3 className="text-lg font-semibold text-gray-900">Filtros Globales</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
          >
            <FaTimes />
            <span>Limpiar filtros</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="country-filter" className="block text-sm font-medium text-gray-700 mb-2">
            País
          </label>
          <select
            id="country-filter"
            value={selectedCountry || ""}
            onChange={(e) => {
              const value = e.target.value || undefined
              onCountryChange(value)
              if (!value) {
                onCityChange(undefined)
              }
            }}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
          >
            <option value="">Todos los países</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="city-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Ciudad
          </label>
          <select
            id="city-filter"
            value={selectedCity || ""}
            onChange={(e) => onCityChange(e.target.value || undefined)}
            disabled={!selectedCountry}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Todas las ciudades</option>
            {filteredCities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedCountry && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
              País: {countries.find((c) => c.id === selectedCountry)?.name}
              <button
                onClick={() => {
                  onCountryChange(undefined)
                  onCityChange(undefined)
                }}
                className="ml-2 hover:text-teal-800"
              >
                <FaTimes className="h-3 w-3" />
              </button>
            </span>
          )}
          {selectedCity && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary/10 text-secondary">
              Ciudad: {cities.find((c) => c.id === selectedCity)?.name}
              <button onClick={() => onCityChange(undefined)} className="ml-2 hover:text-blue-800">
                <FaTimes className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}
