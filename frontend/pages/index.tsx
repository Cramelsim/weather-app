import { useState, useEffect } from 'react'
import { Search, Wind, Droplets, Eye, Thermometer, MapPin, Calendar, Sunrise, Sunset } from 'lucide-react'

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
  const [windowWidth, setWindowWidth] = useState<number>(1024)

  // Mock data mapping for different cities
  const cityDataMap: { [key: string]: Partial<WeatherData> } = {
    // US Cities
    'san francisco': { city: 'San Francisco', country: 'US' },
    'new york': { city: 'New York', country: 'US' },
    'los angeles': { city: 'Los Angeles', country: 'US' },
    'chicago': { city: 'Chicago', country: 'US' },
    'miami': { city: 'Miami', country: 'US' },
    'seattle': { city: 'Seattle', country: 'US' },
    'boston': { city: 'Boston', country: 'US' },
    'las vegas': { city: 'Las Vegas', country: 'US' },
    'denver': { city: 'Denver', country: 'US' },
    'atlanta': { city: 'Atlanta', country: 'US' },
    
    // European Cities
    'london': { city: 'London', country: 'GB' },
    'paris': { city: 'Paris', country: 'FR' },
    'berlin': { city: 'Berlin', country: 'DE' },
    'madrid': { city: 'Madrid', country: 'ES' },
    'rome': { city: 'Rome', country: 'IT' },
    'amsterdam': { city: 'Amsterdam', country: 'NL' },
    'vienna': { city: 'Vienna', country: 'AT' },
    'prague': { city: 'Prague', country: 'CZ' },
    'stockholm': { city: 'Stockholm', country: 'SE' },
    'oslo': { city: 'Oslo', country: 'NO' },
    'copenhagen': { city: 'Copenhagen', country: 'DK' },
    'zurich': { city: 'Zurich', country: 'CH' },
    'brussels': { city: 'Brussels', country: 'BE' },
    'dublin': { city: 'Dublin', country: 'IE' },
    'lisbon': { city: 'Lisbon', country: 'PT' },
    'athens': { city: 'Athens', country: 'GR' },
    'warsaw': { city: 'Warsaw', country: 'PL' },
    'budapest': { city: 'Budapest', country: 'HU' },
    'bucharest': { city: 'Bucharest', country: 'RO' },
    'helsinki': { city: 'Helsinki', country: 'FI' },
    
    // Asian Cities
    'tokyo': { city: 'Tokyo', country: 'JP' },
    'beijing': { city: 'Beijing', country: 'CN' },
    'shanghai': { city: 'Shanghai', country: 'CN' },
    'hong kong': { city: 'Hong Kong', country: 'HK' },
    'singapore': { city: 'Singapore', country: 'SG' },
    'seoul': { city: 'Seoul', country: 'KR' },
    'mumbai': { city: 'Mumbai', country: 'IN' },
    'delhi': { city: 'Delhi', country: 'IN' },
    'bangalore': { city: 'Bangalore', country: 'IN' },
    'kolkata': { city: 'Kolkata', country: 'IN' },
    'chennai': { city: 'Chennai', country: 'IN' },
    'hyderabad': { city: 'Hyderabad', country: 'IN' },
    'pune': { city: 'Pune', country: 'IN' },
    'bangkok': { city: 'Bangkok', country: 'TH' },
    'manila': { city: 'Manila', country: 'PH' },
    'jakarta': { city: 'Jakarta', country: 'ID' },
    'kuala lumpur': { city: 'Kuala Lumpur', country: 'MY' },
    'ho chi minh': { city: 'Ho Chi Minh City', country: 'VN' },
    'hanoi': { city: 'Hanoi', country: 'VN' },
    'phnom penh': { city: 'Phnom Penh', country: 'KH' },
    'yangon': { city: 'Yangon', country: 'MM' },
    'dhaka': { city: 'Dhaka', country: 'BD' },
    'karachi': { city: 'Karachi', country: 'PK' },
    'lahore': { city: 'Lahore', country: 'PK' },
    'islamabad': { city: 'Islamabad', country: 'PK' },
    'kabul': { city: 'Kabul', country: 'AF' },
    'tehran': { city: 'Tehran', country: 'IR' },
    'riyadh': { city: 'Riyadh', country: 'SA' },
    'dubai': { city: 'Dubai', country: 'AE' },
    'abu dhabi': { city: 'Abu Dhabi', country: 'AE' },
    'doha': { city: 'Doha', country: 'QA' },
    'kuwait city': { city: 'Kuwait City', country: 'KW' },
    'muscat': { city: 'Muscat', country: 'OM' },
    'manama': { city: 'Manama', country: 'BH' },
    'amman': { city: 'Amman', country: 'JO' },
    'beirut': { city: 'Beirut', country: 'LB' },
    'damascus': { city: 'Damascus', country: 'SY' },
    'baghdad': { city: 'Baghdad', country: 'IQ' },
    'jerusalem': { city: 'Jerusalem', country: 'IL' },
    'tel aviv': { city: 'Tel Aviv', country: 'IL' },
    
    // African Cities
    'nairobi': { city: 'Nairobi', country: 'KE' },
    'kisumu': { city: 'Kisumu', country: 'KE' },
    'mombasa': { city: 'Mombasa', country: 'KE' },
    'kampala': { city: 'Kampala', country: 'UG' },
    'dar es salaam': { city: 'Dar es Salaam', country: 'TZ' },
    'kigali': { city: 'Kigali', country: 'RW' },
    'addis ababa': { city: 'Addis Ababa', country: 'ET' },
    'lagos': { city: 'Lagos', country: 'NG' },
    'abuja': { city: 'Abuja', country: 'NG' },
    'accra': { city: 'Accra', country: 'GH' },
    'dakar': { city: 'Dakar', country: 'SN' },
    'bamako': { city: 'Bamako', country: 'ML' },
    'ouagadougou': { city: 'Ouagadougou', country: 'BF' },
    'abidjan': { city: 'Abidjan', country: 'CI' },
    'conakry': { city: 'Conakry', country: 'GN' },
    'freetown': { city: 'Freetown', country: 'SL' },
    'monrovia': { city: 'Monrovia', country: 'LR' },
    'cairo': { city: 'Cairo', country: 'EG' },
    'alexandria': { city: 'Alexandria', country: 'EG' },
    'tunis': { city: 'Tunis', country: 'TN' },
    'algiers': { city: 'Algiers', country: 'DZ' },
    'rabat': { city: 'Rabat', country: 'MA' },
    'casablanca': { city: 'Casablanca', country: 'MA' },
    'tripoli': { city: 'Tripoli', country: 'LY' },
    'khartoum': { city: 'Khartoum', country: 'SD' },
    'johannesburg': { city: 'Johannesburg', country: 'ZA' },
    'cape town': { city: 'Cape Town', country: 'ZA' },
    'durban': { city: 'Durban', country: 'ZA' },
    'pretoria': { city: 'Pretoria', country: 'ZA' },
    'lusaka': { city: 'Lusaka', country: 'ZM' },
    'harare': { city: 'Harare', country: 'ZW' },
    'gaborone': { city: 'Gaborone', country: 'BW' },
    'windhoek': { city: 'Windhoek', country: 'NA' },
    'maputo': { city: 'Maputo', country: 'MZ' },
    'antananarivo': { city: 'Antananarivo', country: 'MG' },
    'port louis': { city: 'Port Louis', country: 'MU' },
    
    // Oceania Cities
    'sydney': { city: 'Sydney', country: 'AU' },
    'melbourne': { city: 'Melbourne', country: 'AU' },
    'brisbane': { city: 'Brisbane', country: 'AU' },
    'perth': { city: 'Perth', country: 'AU' },
    'adelaide': { city: 'Adelaide', country: 'AU' },
    'canberra': { city: 'Canberra', country: 'AU' },
    'auckland': { city: 'Auckland', country: 'NZ' },
    'wellington': { city: 'Wellington', country: 'NZ' },
    'christchurch': { city: 'Christchurch', country: 'NZ' },
    'suva': { city: 'Suva', country: 'FJ' },
    'port moresby': { city: 'Port Moresby', country: 'PG' },
    
    // South American Cities
    'sao paulo': { city: 'São Paulo', country: 'BR' },
    'rio de janeiro': { city: 'Rio de Janeiro', country: 'BR' },
    'brasilia': { city: 'Brasília', country: 'BR' },
    'salvador': { city: 'Salvador', country: 'BR' },
    'fortaleza': { city: 'Fortaleza', country: 'BR' },
    'belo horizonte': { city: 'Belo Horizonte', country: 'BR' },
    'manaus': { city: 'Manaus', country: 'BR' },
    'recife': { city: 'Recife', country: 'BR' },
    'porto alegre': { city: 'Porto Alegre', country: 'BR' },
    'curitiba': { city: 'Curitiba', country: 'BR' },
    'buenos aires': { city: 'Buenos Aires', country: 'AR' },
    'cordoba': { city: 'Córdoba', country: 'AR' },
    'rosario': { city: 'Rosario', country: 'AR' },
    'mendoza': { city: 'Mendoza', country: 'AR' },
    'santiago': { city: 'Santiago', country: 'CL' },
    'valparaiso': { city: 'Valparaíso', country: 'CL' },
    'lima': { city: 'Lima', country: 'PE' },
    'arequipa': { city: 'Arequipa', country: 'PE' },
    'bogota': { city: 'Bogotá', country: 'CO' },
    'medellin': { city: 'Medellín', country: 'CO' },
    'cali': { city: 'Cali', country: 'CO' },
    'barranquilla': { city: 'Barranquilla', country: 'CO' },
    'caracas': { city: 'Caracas', country: 'VE' },
    'maracaibo': { city: 'Maracaibo', country: 'VE' },
    'valencia': { city: 'Valencia', country: 'VE' },
    'quito': { city: 'Quito', country: 'EC' },
    'guayaquil': { city: 'Guayaquil', country: 'EC' },
    'la paz': { city: 'La Paz', country: 'BO' },
    'santa cruz': { city: 'Santa Cruz', country: 'BO' },
    'asuncion': { city: 'Asunción', country: 'PY' },
    'montevideo': { city: 'Montevideo', country: 'UY' },
    'georgetown': { city: 'Georgetown', country: 'GY' },
    'paramaribo': { city: 'Paramaribo', country: 'SR' },
    'cayenne': { city: 'Cayenne', country: 'GF' },
    
    // North American Cities (Canada & Mexico)
    'toronto': { city: 'Toronto', country: 'CA' },
    'vancouver': { city: 'Vancouver', country: 'CA' },
    'montreal': { city: 'Montreal', country: 'CA' },
    'calgary': { city: 'Calgary', country: 'CA' },
    'ottawa': { city: 'Ottawa', country: 'CA' },
    'edmonton': { city: 'Edmonton', country: 'CA' },
    'winnipeg': { city: 'Winnipeg', country: 'CA' },
    'quebec city': { city: 'Quebec City', country: 'CA' },
    'halifax': { city: 'Halifax', country: 'CA' },
    'mexico city': { city: 'Mexico City', country: 'MX' },
    'guadalajara': { city: 'Guadalajara', country: 'MX' },
    'monterrey': { city: 'Monterrey', country: 'MX' },
    'puebla': { city: 'Puebla', country: 'MX' },
    'tijuana': { city: 'Tijuana', country: 'MX' },
    'leon': { city: 'León', country: 'MX' },
    'juarez': { city: 'Juárez', country: 'MX' },
    'torreon': { city: 'Torreón', country: 'MX' },
    'merida': { city: 'Mérida', country: 'MX' },
    'cancun': { city: 'Cancún', country: 'MX' }
  }

  // Mock data for demonstration since we can't make external API calls
  const mockWeatherData: WeatherData = {
    city: 'San Francisco',
    country: 'US',
    current: {
      temp: 22,
      feels_like: 24,
      humidity: 65,
      wind_speed: 3.5, // m/s
      weather: {
        main: 'Clear',
        description: 'clear sky',
        icon: '01d'
      },
      dt: Date.now() / 1000
    },
    forecast: [
      {
        dt: Date.now() / 1000 + 86400,
        temp: 20,
        temp_min: 18,
        temp_max: 25,
        weather: { main: 'Sunny', description: 'sunny', icon: '01d' },
        humidity: 60,
        wind_speed: 4.2
      },
      {
        dt: Date.now() / 1000 + 172800,
        temp: 19,
        temp_min: 16,
        temp_max: 23,
        weather: { main: 'Cloudy', description: 'partly cloudy', icon: '02d' },
        humidity: 70,
        wind_speed: 2.8
      },
      {
        dt: Date.now() / 1000 + 259200,
        temp: 17,
        temp_min: 14,
        temp_max: 21,
        weather: { main: 'Rain', description: 'light rain', icon: '10d' },
        humidity: 85,
        wind_speed: 5.1
      }
    ]
  }

  // Conversion functions
  const convertTemp = (temp: number, fromUnit: Unit, toUnit: Unit) => {
    if (fromUnit === toUnit) return temp
    if (fromUnit === 'metric' && toUnit === 'imperial') {
      return (temp * 9/5) + 32 // Celsius to Fahrenheit
    } else {
      return (temp - 32) * 5/9 // Fahrenheit to Celsius
    }
  }

  const convertWindSpeed = (speed: number) => {
    // Convert m/s to km/h
    return speed * 3.6
  }

  const getDisplayTemp = (temp: number) => {
    if (unit === 'imperial') {
      return Math.round(convertTemp(temp, 'metric', 'imperial'))
    }
    return Math.round(temp)
  }

  const getDisplayWindSpeed = (speed: number) => {
    return Math.round(convertWindSpeed(speed) * 10) / 10 // Round to 1 decimal
  }

  const fetchWeatherData = async (cityName: string) => {
    setLoading(true)
    setError(null)

    // Simulate API call with delay
    setTimeout(() => {
      const cityKey = cityName.toLowerCase().trim()
      const cityData = cityDataMap[cityKey] || { city: cityName, country: 'Unknown' }
      
      setWeatherData({
        ...mockWeatherData,
        city: cityData.city || cityName,
        country: cityData.country || 'Unknown'
      })
      setCity(cityName)
      setLoading(false)
    }, 800)
  }

  const handleSearch = (e: any) => {
    if (searchInput.trim()) {
      fetchWeatherData(searchInput.trim())
    }
  }

  const toggleUnit = () => {
    const newUnit: Unit = unit === 'metric' ? 'imperial' : 'metric'
    setUnit(newUnit)
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getWeatherEmoji = (main: string) => {
    const emojiMap: { [key: string]: string } = {
      'Clear': '☀️',
      'Sunny': '☀️',
      'Clouds': '☁️',
      'Cloudy': '☁️',
      'Rain': '🌧️',
      'Snow': '❄️',
      'Thunderstorm': '⛈️',
      'Drizzle': '🌦️',
      'Mist': '🌫️',
      'Fog': '🌫️'
    }
    return emojiMap[main] || '🌤️'
  }

  useEffect(() => {
    fetchWeatherData('San Francisco')
    
    // Handle window resize for responsive design
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    
    // Set initial window width
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth)
      window.addEventListener('resize', handleResize)
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #312e81 100%)',
    position: 'relative' as const,
    overflow: 'hidden'
  }

  const backgroundElementStyle = {
    position: 'absolute' as const,
    width: '320px',
    height: '320px',
    borderRadius: '50%',
    filter: 'blur(80px)',
    animation: 'pulse 3s ease-in-out infinite'
  }

  const glassmorphismStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '24px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  }

  const inputStyle = {
    ...glassmorphismStyle,
    width: '100%',
    paddingLeft: '48px',
    paddingRight: '16px',
    paddingTop: '16px',
    paddingBottom: '16px',
    color: 'white',
    borderRadius: '16px',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.3s ease'
  }

  const buttonStyle = {
    background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    color: 'white',
    padding: '16px 32px',
    borderRadius: '16px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    fontSize: '16px'
  }

  const cardStyle = {
    ...glassmorphismStyle,
    padding: '32px',
    transition: 'all 0.5s ease'
  }

  return (
    <div style={containerStyle}>
      {/* Animated background elements */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div style={{
          ...backgroundElementStyle,
          top: '-160px',
          right: '-160px',
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(251, 191, 36, 0.2))'
        }}></div>
        <div style={{
          ...backgroundElementStyle,
          bottom: '-160px',
          left: '-160px',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2))',
          animationDelay: '1s'
        }}></div>
        <div style={{
          ...backgroundElementStyle,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '256px',
          height: '256px',
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1))',
          animationDelay: '0.5s'
        }}></div>
      </div>

      <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh', padding: '32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h1 style={{
              fontSize: '4rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #22d3ee, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Weather Forecast
            </h1>
            <p style={{ color: '#bfdbfe', fontSize: '18px' }}>Beautiful weather, beautifully displayed</p>
          </div>

          {/* Search Section */}
          <div style={{ marginBottom: '64px' }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: windowWidth < 768 ? 'column' : 'row',
              gap: windowWidth < 768 ? '16px' : '24px', 
              maxWidth: '700px', 
              margin: '0 auto',
              alignItems: windowWidth < 768 ? 'stretch' : 'center' 
            }}>
              <div style={{ position: 'relative', flex: windowWidth < 768 ? '1' : '2' }}>
                <Search style={{ 
                  position: 'absolute', 
                  left: '16px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: '#9ca3af', 
                  width: '20px', 
                  height: '20px' 
                }} />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search for a city..."
                  style={inputStyle}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading}
                style={{
                  ...buttonStyle,
                  opacity: loading ? 0.5 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  minWidth: '120px', 
                  flexShrink: 0,
                  flex: windowWidth < 768 ? 'none' : '0 0 auto' 
                }}
              >
                {loading ? (
                  <div style={{
                    width: '24px',
                    height: '24px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto'
                  }}></div>
                ) : (
                  'Search'
                )}
              </button>
              <button
                onClick={toggleUnit}
                style={{
                  ...glassmorphismStyle,
                  padding: '16px 24px',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  minWidth: '80px', // consistent button width
                  flex: windowWidth < 768 ? 'none' : '0 0 auto'
                }}
              >
                °{unit === 'metric' ? 'F' : 'C'}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              maxWidth: '512px',
              margin: '0 auto 64px',
              padding: '16px',
              background: 'rgba(239, 68, 68, 0.2)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '16px',
              color: '#fecaca'
            }}>
              {error}
            </div>
          )}

          {weatherData && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: windowWidth >= 1280 ? '1fr 2fr' : '1fr',
              gap: '32px' 
            }}>
              {/* Main Weather Card */}
              <div>
                <div style={cardStyle}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                      <MapPin style={{ width: '20px', height: '20px', color: '#22d3ee', marginRight: '8px' }} />
                      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', margin: 0 }}>
                        {weatherData.city}, {weatherData.country}
                      </h2>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                      <Calendar style={{ width: '16px', height: '16px', color: '#93c5fd', marginRight: '8px' }} />
                      <p style={{ color: '#bfdbfe', margin: 0 }}>{getCurrentDate()}</p>
                    </div>

                    <div style={{ margin: '32px 0' }}>
                      <div style={{ fontSize: '80px', marginBottom: '16px' }}>
                        {getWeatherEmoji(weatherData.current.weather.main)}
                      </div>
                      <div style={{ fontSize: '60px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
                        {getDisplayTemp(weatherData.current.temp)}°{unit === 'metric' ? 'C' : 'F'}
                      </div>
                      <div style={{ fontSize: '20px', color: '#bfdbfe', textTransform: 'capitalize', marginBottom: '16px' }}>
                        {weatherData.current.weather.description}
                      </div>
                      <div style={{ fontSize: '18px', color: '#93c5fd' }}>
                        Feels like {getDisplayTemp(weatherData.current.feels_like)}°{unit === 'metric' ? 'C' : 'F'}
                      </div>
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '32px' }}>
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '16px',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        <Sunrise style={{ width: '24px', height: '24px', color: '#fb923c', margin: '0 auto 8px' }} />
                        <div style={{ fontSize: '18px', fontWeight: '600', color: 'white' }}>
                          6
                        </div>
                        <div style={{ fontSize: '14px', color: '#fed7aa' }}>UV Index</div>
                      </div>
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '16px',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        <Eye style={{ width: '24px', height: '24px', color: '#3b82f6', margin: '0 auto 8px' }} />
                        <div style={{ fontSize: '18px', fontWeight: '600', color: 'white' }}>
                          10 km
                        </div>
                        <div style={{ fontSize: '14px', color: '#bfdbfe' }}>Visibility</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Forecast Section */}
              <div>
                <div style={cardStyle}>
                  <h3 style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold', 
                    color: 'white', 
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <Calendar style={{ width: '24px', height: '24px', marginRight: '12px', color: '#22d3ee' }} />
                    3-Day Forecast
                  </h3>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: windowWidth >= 768 ? 'repeat(3, 1fr)' : '1fr',
                    gap: '24px' 
                  }}>
                    {weatherData.forecast.slice(0, 3).map((day, index) => (
                      <div 
                        key={day.dt} 
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '16px',
                          padding: '24px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          transition: 'all 0.3s ease',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontSize: '18px', fontWeight: '600', color: 'white', marginBottom: '8px' }}>
                          {formatDate(day.dt)}
                        </div>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                          {getWeatherEmoji(day.weather.main)}
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
                          {getDisplayTemp(day.temp_max)}° / {getDisplayTemp(day.temp_min)}°
                        </div>
                        <div style={{ color: '#bfdbfe', textTransform: 'capitalize', marginBottom: '16px' }}>
                          {day.weather.description}
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px' }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '8px',
                            padding: '8px'
                          }}>
                            <Wind style={{ width: '16px', height: '16px', color: '#22d3ee', marginRight: '4px' }} />
                            <span style={{ color: '#bfdbfe' }}>{getDisplayWindSpeed(day.wind_speed)}km/h</span>
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '8px',
                            padding: '8px'
                          }}>
                            <Droplets style={{ width: '16px', height: '16px', color: '#3b82f6', marginRight: '4px' }} />
                            <span style={{ color: '#bfdbfe' }}>{day.humidity}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Additional Weather Info */}
                  <div style={{ 
                    marginTop: '32px', 
                    display: 'grid', 
                    gridTemplateColumns: windowWidth >= 768 ? '1fr 1fr' : '1fr',
                    gap: '24px' 
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2))',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1px solid rgba(6, 182, 212, 0.3)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                        <Wind style={{ width: '24px', height: '24px', color: '#22d3ee', marginRight: '12px' }} />
                        <h4 style={{ fontSize: '18px', fontWeight: '600', color: 'white', margin: 0 }}>Wind Speed</h4>
                      </div>
                      <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#22d3ee', marginBottom: '4px' }}>
                        {getDisplayWindSpeed(weatherData.current.wind_speed)} km/h
                      </div>
                      <div style={{ color: '#bfdbfe' }}>Current wind conditions</div>
                    </div>
                    
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 197, 253, 0.2))',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1px solid rgba(59, 130, 246, 0.3)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                        <Droplets style={{ width: '24px', height: '24px', color: '#3b82f6', marginRight: '12px' }} />
                        <h4 style={{ fontSize: '18px', fontWeight: '600', color: 'white', margin: 0 }}>Humidity</h4>
                      </div>
                      <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '4px' }}>
                        {weatherData.current.humidity}%
                      </div>
                      <div style={{ color: '#bfdbfe' }}>Moisture in the air</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        input::placeholder {
          color: #d1d5db;
        }
        
        button:hover {
          transform: scale(1.05);
        }
        
        button:disabled:hover {
          transform: none;
        }
      `}</style>
    </div>
  )
}