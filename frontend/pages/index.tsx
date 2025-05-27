import { useState, useEffect } from 'react';
import { Search, Wind, Droplets, Eye, Thermometer, MapPin, Calendar, Sunrise, Sunset } from 'lucide-react';

type WeatherData = {
  city: string;
  country: string;
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    weather: {
      main: string;
      description: string;
      icon: string;
    };
    dt: number;
  };
  forecast: Array<{
    dt: number;
    temp: number;
    temp_min: number;
    temp_max: number;
    weather: {
      main: string;
      description: string;
      icon: string;
    };
    humidity: number;
    wind_speed: number;
  }>;
};

type Unit = 'metric' | 'imperial';

export default function Home() {
  const [city, setCity] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<Unit>('metric');
  const [windowWidth, setWindowWidth] = useState<number>(1024);

  // Conversion functions
  const convertTemp = (temp: number, fromUnit: Unit, toUnit: Unit) => {
    if (fromUnit === toUnit) return temp;
    if (fromUnit === 'metric' && toUnit === 'imperial') {
      return (temp * 9/5) + 32; // Celsius to Fahrenheit
    } else {
      return (temp - 32) * 5/9; // Fahrenheit to Celsius
    }
  };

  const getDisplayTemp = (temp: number) => {
    if (unit === 'imperial') {
      return Math.round(convertTemp(temp, 'metric', 'imperial'));
    }
    return Math.round(temp);
  };

  const getDisplayWindSpeed = (speed: number) => {
    // Convert m/s to km/h for display
    return Math.round(speed * 3.6 * 10) / 10; // Round to 1 decimal
  };

  const fetchWeatherData = async (cityName: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:8000/api/weather?city=${encodeURIComponent(cityName)}&units=${unit}`
      );

      if (!response.ok) {
        throw new Error('City not found or API error');
      }

      const data: WeatherData = await response.json();
      setWeatherData(data);
      setCity(cityName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchWeatherData(searchInput.trim());
    }
  };

  const toggleUnit = () => {
    const newUnit: Unit = unit === 'metric' ? 'imperial' : 'metric';
    setUnit(newUnit);
    if (city) {
      fetchWeatherData(city);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
    };
    return emojiMap[main] || '🌤️';
  };

  useEffect(() => {
    fetchWeatherData('London');
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  // Styles
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #312e81 100%)',
    position: 'relative' as const,
    overflow: 'hidden'
  };

  const backgroundElementStyle = {
    position: 'absolute' as const,
    width: '320px',
    height: '320px',
    borderRadius: '50%',
    filter: 'blur(80px)',
    animation: 'pulse 3s ease-in-out infinite'
  };

  const glassmorphismStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '24px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  };

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
  };

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
  };

  const cardStyle = {
    ...glassmorphismStyle,
    padding: '32px',
    transition: 'all 0.5s ease'
  };

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
  <form onSubmit={handleSearch} style={{ 
    display: 'flex', 
    flexDirection: windowWidth < 768 ? 'column' : 'row',
    gap: windowWidth < 768 ? '16px' : '24px',
    maxWidth: '700px', 
    margin: '0 auto',
    alignItems: windowWidth < 768 ? 'stretch' : 'center',
    width: '100%'
  }}>
    <div style={{ 
      position: 'relative', 
      flex: windowWidth < 768 ? '1' : '1 1 auto',
      minWidth: 0
    }}>
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
      type="submit"
      disabled={loading}
      style={{
        ...buttonStyle,
        opacity: loading ? 0.5 : 1,
        cursor: loading ? 'not-allowed' : 'pointer',
        minWidth: '120px',
        flexShrink: 0
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
        'Go'
      )}
    </button>
    <button
      type="button"
      onClick={toggleUnit}
      style={{
        ...glassmorphismStyle,
        padding: '16px 24px',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        fontWeight: '500',
        transition: 'all 0.3s ease',
        minWidth: '80px',
        flexShrink: 0
      }}
    >
      °{unit === 'metric' ? 'F' : 'C'}
    </button>
  </form>
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

                    {/* Stats - UV Index and Visibility */}
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
                    {weatherData.forecast.slice(0, 3).map((day) => (
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
                            <span style={{ color: '#bfdbfe' }}>{getDisplayWindSpeed(day.wind_speed)} km/h</span>
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

                  {/* Additional Weather Info - Wind Speed and Humidity Cards */}
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
  );
}