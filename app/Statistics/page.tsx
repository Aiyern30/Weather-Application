"use client";

import Header from "@/components/Header";
import { useLocation } from "@/components/locationContext";
import { fetchForecastWeather } from "@/lib/fetchData";
import { WeatherApiResponse } from "@/type/types";
import React, { useEffect, useState } from "react";

const Statistics = () => {
  const WEATHER_API_URL = process.env.NEXT_PUBLIC_WEATHER_API_URL;
  if (!WEATHER_API_URL) {
    throw new Error("WEATHER_API_URL is not defined");
  }
  const UNSPLASH_API_URL = process.env.NEXT_PUBLIC_UNSPLASH_API_URL;
  if (!UNSPLASH_API_URL) {
    throw new Error("UNSPLASH_API_URL is not defined");
  }

  const { location } = useLocation();
  const [forecastData, setForecastData] = useState<WeatherApiResponse | null>(
    null
  );
  console.log("forecastData", forecastData);

  useEffect(() => {
    const fetchAllForecastWeather = async () => {
      const response = await fetchForecastWeather(location, WEATHER_API_URL);
      console.log("response", response);
      if (response) {
        setForecastData(response);
      }
    };
    fetchAllForecastWeather();
  }, [location]);

  return (
    <div className="h-screen w-full">
      <Header />
      {forecastData &&
        forecastData.forecast.forecastday.map((day) => (
          <div key={day.date}>
            <h2>{day.date}</h2>
            <p>{day.day.mintemp_c}°C</p>
            <p>{day.day.maxtemp_c}°C</p>
          </div>
        ))}
    </div>
  );
};

export default Statistics;
