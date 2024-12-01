"use client";

import BarChart from "@/components/charts/Bar";
import Header from "@/components/Header";
import { useLocation } from "@/components/locationContext";
import { fetchForecastWeather } from "@/lib/fetchData";
import { Day, Hour, WeatherApiResponse } from "@/type/types";
import React, { useEffect, useState } from "react";

const Statistics = () => {
  const WEATHER_API_URL = process.env.NEXT_PUBLIC_WEATHER_API_URL;
  if (!WEATHER_API_URL) {
    throw new Error("WEATHER_API_URL is not defined");
  }

  const { location } = useLocation();
  const [forecastData, setForecastData] = useState<WeatherApiResponse | null>(
    null
  );
  const [hourlyData, setHourlyData] = useState<
    { time: string; feelslike_c: number }[]
  >([]);

  useEffect(() => {
    const fetchAllForecastWeather = async () => {
      const response = await fetchForecastWeather(location, WEATHER_API_URL);
      if (response) {
        setForecastData(response);

        // Extract hourly data
        const allHours = response.forecast.forecastday.flatMap((day: any) =>
          day.hour.map((hour: Hour) => ({
            time: hour.time,
            feelslike_c: hour.feelslike_c,
          }))
        );
        setHourlyData(allHours);
      }
    };
    fetchAllForecastWeather();
  }, [location]);

  return (
    <div className="h-screen w-full">
      <Header />

      {/* Display forecast summary */}
      {forecastData &&
        forecastData.forecast.forecastday.map((day) => (
          <div key={day.date}>
            <h2>{day.date}</h2>
            <p>Min Temp: {day.day.mintemp_c}°C</p>
            <p>Max Temp: {day.day.maxtemp_c}°C</p>
          </div>
        ))}

      {/* Pass hourly data to BarChart */}
      <BarChart data={hourlyData} />
    </div>
  );
};

export default Statistics;
