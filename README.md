markdown
# Weather Application

A modern weather app with Next.js frontend and Laravel backend that displays current weather and forecasts.

![Weather App Screenshot](./screenshot.png)

## Features

- Current weather with temperature, conditions, and icons
- 3-day forecast with weather predictions
- City search functionality
- Unit conversion (Celsius/Fahrenheit)
- Wind speed and humidity indicators
- Responsive design for all devices

## Technologies

**Frontend:**
- Next.js 13+
- TypeScript
- Tailwind CSS
- React Icons
- date-fns

**Backend:**
- Laravel 10+
- Guzzle HTTP Client
- OpenWeatherMap API

## Installation

### 1. Clone Repository
```bash
git clone https://github.com/your-username/weather-app.git
cd weather-app
2. Backend Setup
bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
Add your OpenWeatherMap API key to .env:

env
OPENWEATHER_API_KEY=your_api_key_here
Start backend server:

bash
php artisan serve
3. Frontend Setup
bash
cd ../frontend
npm install
npm run dev
Configuration
Backend Environment (.env):

env
APP_URL=http://localhost:8000
OPENWEATHER_API_KEY=your_api_key_here
Frontend Environment (.env.local):

env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
API Endpoints
Get Weather Data:

GET /api/weather?city={city}&units={metric|imperial}
Example Response:

json
{
  "city": "London",
  "country": "GB",
  "current": {
    "temp": 18.5,
    "weather": {
      "main": "Clouds",
      "description": "scattered clouds",
      "icon": "03d"
    },
    "wind_speed": 3.09,
    "humidity": 65
  },
  "forecast": [...]
}
Project Structure
weather-app/
├── backend/
│   ├── app/Http/Controllers/WeatherController.php
│   ├── routes/api.php
│   └── .env
└── frontend/
    ├── pages/
    │   └── index.tsx
    ├── public/
    └── package.json
Available Scripts
Frontend:

bash
npm run dev    # Start development server
npm run build  # Create production build
npm run start  # Start production server
Backend:

bash
php artisan serve      # Start development server
php artisan optimize   # Optimize for production
Troubleshooting
Troubleshooting
Common Issues:

401 Unauthorized Error:

Verify OpenWeatherMap API key

Ensure key is activated (may take 10-20 minutes)

CORS Errors:

Add CORS middleware to Laravel

Verify backend URL in frontend config

Missing Weather Icons:

Check network requests for icon URLs

Verify OpenWeatherMap icon codes

## License
MIT License - See LICENSE for details.