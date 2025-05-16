import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import Head from 'next/head'

type WeatherData = {
  city: string
  country: string
  current: {
    temp: number
    feels_like: number
    humidity: number
    wind_speed: number
    weather: {
      main: string
      description: string
      icon: string
    }
    dt: number
  }
  forecast: Array<{
    dt: number
    temp: number
    temp_min: number
    temp_max: number
    weather: {
      main: string
      description: string
      icon: string
    }
    humidity: number
    wind_speed: number
    units: string
  }>
}

type Unit = 'metric' | 'imperial'

export default function Home() {
  const [city, setCity] = useState<string>('')
  const [searchInput, setSearchInput] = useState<string>('')
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [unit, setUnit] = useState<Unit>('metric')

  const fetchWeatherData = async (cityName: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(
        `http://localhost:8000/api/weather?city=${encodeURIComponent(cityName)}&units=${unit}`
      )
      
      if (!response.ok) {
        throw new Error('City not found or API error')
      }
      
      const data = await response.json()
      setWeatherData(data)
      setCity(cityName)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      setWeatherData(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      fetchWeatherData(searchInput)
    }
  }

  const toggleUnit = () => {
    const newUnit = unit === 'metric' ? 'imperial' : 'metric'
    setUnit(newUnit)
    if (city) {
      fetchWeatherData(city)
    }
  }

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
  }

  useEffect(() => {
    // Fetch default weather for a city on initial load
    fetchWeatherData('London')
  }, [])

  return (
    <>
      <Head>
        <title>Weather App</title>
        <meta name="description" content="Weather application" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">Weather Forecast</h1>
          
          {/* Search Box */}
          <form onSubmit={handleSearch} className="mb-8 flex gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter city name"
              className="flex-1 p-3 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button
              type="button"
              onClick={toggleUnit}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-3 rounded-lg transition-colors"
            >
              °{unit === 'metric' ? 'C' : 'F'}
            </button>
          </form>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {weatherData && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Current Weather */}
              <div className="p-6 md:p-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {weatherData.city}, {weatherData.country}
                    </h2>
                    <p className="text-blue-100">
                      {format(new Date(weatherData.current.dt * 1000), 'EEEE, MMMM d, yyyy')}
                    </p>
                    <p className="mt-2 text-xl capitalize">
                      {weatherData.current.weather.description}
                    </p>
                  </div>
                  <div className="flex items-center mt-4 md:mt-0">
                    <img
                      src={getWeatherIcon(weatherData.current.weather.icon)}
                      alt={weatherData.current.weather.main}
                      className="w-20 h-20"
                    />
                    <span className="text-5xl font-bold">
                      {Math.round(weatherData.current.temp)}°
                      {unit === 'metric' ? 'C' : 'F'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Weather Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Wind Status</h3>
                  <p className="text-2xl font-bold">
                    {weatherData.current.wind_speed} {unit === 'metric' ? 'm/s' : 'mph'}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Humidity</h3>
                  <p className="text-2xl font-bold">
                    {weatherData.current.humidity}%
                  </p>
                </div>
              </div>

              {/* Forecast */}
              <div className="p-6 md:p-8 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">3-Day Forecast</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {weatherData.forecast.map((day, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-700">
                        {format(new Date(day.dt * 1000), 'EEEE')}
                      </h4>
                      <div className="flex items-center justify-between mt-2">
                        <img
                          src={getWeatherIcon(day.weather.icon)}
                          alt={day.weather.main}
                          className="w-12 h-12"
                        />
                        <div className="text-right">
                          <p className="text-xl font-bold">
                            {Math.round(day.temp)}°{unit === 'metric' ? 'C' : 'F'}
                          </p>
                          <p className="text-sm text-gray-500 capitalize">
                            {day.weather.description}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Wind</span>
                          <p>{day.wind_speed} {unit === 'metric' ? 'm/s' : 'mph'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Humidity</span>
                          <p>{day.humidity}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}