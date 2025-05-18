import { useState, useEffect } from 'react'
import Head from 'next/head'
import { format } from 'date-fns'
import '../styles/globals.css'

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

      const data: WeatherData = await response.json()
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
      fetchWeatherData(searchInput.trim())
    }
  }

  const toggleUnit = () => {
    const newUnit: Unit = unit === 'metric' ? 'imperial' : 'metric'
    setUnit(newUnit)
    if (city) {
      fetchWeatherData(city)
    }
  }

  const getWeatherIcon = (iconCode: string) =>
    `https://openweathermap.org/img/wn/${iconCode}@2x.png`

  useEffect(() => {
    fetchWeatherData('London')
  }, [])

  return (
    <>
      <Head>
        <title>Weather App</title>
        <meta name="description" content="Weather application" />
      </Head>

      <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-5xl">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="mb-4 flex gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter city name"
              className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? '...' : 'Search'}
            </button>
            <button
              type="button"
              onClick={toggleUnit}
              className="text-sm text-blue-600 hover:text-blue-800 ml-2"
            >
              Switch to °{unit === 'metric' ? 'F' : 'C'}
            </button>
          </form>

          {error && (
            <div className="bg-red-100 text-red-700 border border-red-400 p-3 rounded mb-4">
              {error}
            </div>
          )}

          {weatherData && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Current Weather */}
              <div className="col-span-1 border rounded-lg p-4 bg-gray-50 shadow-sm">
                <h2 className="text-xl font-semibold">
                  {weatherData.city}, {weatherData.country}
                </h2>
                <p className="text-sm text-gray-500">
                  {format(new Date(weatherData.current.dt * 1000), 'do MMMM yyyy')}
                </p>
                <img
                  src={getWeatherIcon(weatherData.current.weather.icon)}
                  alt={weatherData.current.weather.main}
                  className="w-20 h-20 mt-4"
                />
                <p className="text-3xl font-bold mt-2">
                  {Math.round(weatherData.current.temp)}°{unit === 'metric' ? 'C' : 'F'}
                </p>
                <p className="capitalize text-gray-600 mt-1">
                  {weatherData.current.weather.description}
                </p>
              </div>

              {/* Middle Column: 3 Day Forecast */}
              <div className="col-span-2">
                <h3 className="text-lg font-semibold mb-2">3-Day Forecast</h3>
                <div className="grid grid-cols-3 gap-4">
                  {weatherData.forecast.slice(0, 3).map((day) => (
                    <div key={day.dt} className="border rounded-lg p-4 text-center bg-white shadow-sm">
                      <p className="font-medium">
                        {format(new Date(day.dt * 1000), 'EEE, d MMM')}
                      </p>
                      <img
                        src={getWeatherIcon(day.weather.icon)}
                        alt={day.weather.main}
                        className="w-10 h-10 mx-auto my-2"
                      />
                      <p className="text-lg font-semibold">
                        {Math.round(day.temp_min)}° / {Math.round(day.temp_max)}°
                      </p>
                      <p className="text-sm text-gray-500 capitalize">{day.weather.description}</p>
                    </div>
                  ))}
                </div>

                {/* Bottom Boxes: Wind & Humidity */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Wind Status</h3>
                    <p className="text-xl font-semibold">
                      {weatherData.current.wind_speed} {unit === 'metric' ? 'm/s' : 'mph'}
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Humidity</h3>
                    <p className="text-xl font-semibold">
                      {weatherData.current.humidity}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
