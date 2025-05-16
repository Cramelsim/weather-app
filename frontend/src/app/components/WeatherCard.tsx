// WeatherCard.tsx

"use client";

import React, { useState } from "react";
import axios from "axios";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

export default function WeatherCard() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");

  const getWeather = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            q: city,
            appid: process.env.NEXT_PUBLIC_WEATHER_API_KEY,
            units: unit,
          },
        }
      );
      setWeather(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === "metric" ? "imperial" : "metric"));
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
      {/* A & B: Search Form */}
      <form onSubmit={getWeather} className="flex gap-2 mb-4">
        {/* A: Search Box */}
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {/* B: Search Button */}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      {/* C: Unit Toggle */}
      <div className="mb-4 text-right">
        <button
          onClick={toggleUnit}
          className="text-sm text-blue-600 underline hover:text-blue-800"
        >
          Toggle to {unit === "metric" ? "°F" : "°C"}
        </button>
      </div>

      {/* D, E: Weather Info */}
      {weather && (
        <div className="text-center">
          {/* D: Weather Icon */}
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
            alt={weather.weather[0].description}
            className="mx-auto mb-2"
          />

          {/* E: Weather Details */}
          <h2 className="text-2xl font-semibold mb-1">{weather.name}</h2>
          <p className="text-gray-700 text-lg mb-1">
            {weather.main.temp}° {unit === "metric" ? "C" : "F"}
          </p>
          <p className="text-gray-500 capitalize">
            {weather.weather[0].description}
          </p>
        </div>
      )}
    </div>
  );
}
