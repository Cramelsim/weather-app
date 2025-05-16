<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;

class WeatherController extends Controller
{
    private $openWeatherApiKey;
    private $client;

    public function __construct()
    {
        $this->openWeatherApiKey = env('OPENWEATHER_API_KEY');
        $this->client = new Client([
            'base_uri' => 'https://api.openweathermap.org/',
            'timeout'  => 2.0,
        ]);
    }

    /**
     * Get weather data for a city
     */
    public function getWeather(Request $request)
    {
        $city = $request->input('city');
        $units = $request->input('units', 'metric');

        if (!$city) {
            return response()->json(['error' => 'City name is required'], 400);
        }

        try {
            // First, get coordinates for the city
            $geoResponse = $this->client->get('geo/1.0/direct', [
                'query' => [
                    'q' => $city,
                    'limit' => 1,
                    'appid' => $this->openWeatherApiKey,
                ]
            ]);

            $geoData = json_decode($geoResponse->getBody(), true);

            if (empty($geoData)) {
                return response()->json(['error' => 'City not found'], 404);
            }

            $lat = $geoData[0]['lat'];
            $lon = $geoData[0]['lon'];
            $cityName = $geoData[0]['name'];
            $country = $geoData[0]['country'] ?? '';

            // Get current weather
            $weatherResponse = $this->client->get('data/2.5/weather', [
                'query' => [
                    'lat' => $lat,
                    'lon' => $lon,
                    'units' => $units,
                    'appid' => $this->openWeatherApiKey,
                ]
            ]);

            $currentWeather = json_decode($weatherResponse->getBody(), true);

            // Get forecast
            $forecastResponse = $this->client->get('data/2.5/forecast', [
                'query' => [
                    'lat' => $lat,
                    'lon' => $lon,
                    'units' => $units,
                    'cnt' => 24, // 24 intervals (3 days)
                    'appid' => $this->openWeatherApiKey,
                ]
            ]);

            $forecastData = json_decode($forecastResponse->getBody(), true);

            // Process forecast data to get daily data
            $dailyForecast = $this->processForecast($forecastData['list'], $units);

            return response()->json([
                'city' => $cityName,
                'country' => $country,
                'current' => [
                    'temp' => $currentWeather['main']['temp'],
                    'feels_like' => $currentWeather['main']['feels_like'],
                    'humidity' => $currentWeather['main']['humidity'],
                    'wind_speed' => $currentWeather['wind']['speed'],
                    'weather' => $currentWeather['weather'][0],
                    'dt' => $currentWeather['dt'],
                ],
                'forecast' => $dailyForecast,
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Process forecast data to get daily forecast
     */
    private function processForecast($forecastList, $units)
    {
        $dailyData = [];
        $dayCount = 0;
        $previousDate = null;

        foreach ($forecastList as $item) {
            $date = date('Y-m-d', $item['dt']);
            
            if ($date !== $previousDate && $dayCount < 3) {
                $dailyData[] = [
                    'dt' => $item['dt'],
                    'temp' => $item['main']['temp'],
                    'temp_min' => $item['main']['temp_min'],
                    'temp_max' => $item['main']['temp_max'],
                    'weather' => $item['weather'][0],
                    'humidity' => $item['main']['humidity'],
                    'wind_speed' => $item['wind']['speed'],
                    'units' => $units,
                ];
                $previousDate = $date;
                $dayCount++;
            }
        }

        return $dailyData;
    }
}