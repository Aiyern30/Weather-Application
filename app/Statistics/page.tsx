"use client";

import BarChart from "@/components/charts/Bar";
import LineChart from "@/components/charts/Line";
import Header from "@/components/Header";
import { useLocation } from "@/components/locationContext";
import { fetchForecastWeather } from "@/lib/fetchData";
import { Day, Hour, WeatherApiResponse } from "@/type/types";
import { formatTime } from "@/utils/function";
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
  const [hourlyData, setHourlyData] = useState<Hour[]>([]);

  useEffect(() => {
    const fetchAllForecastWeather = async () => {
      const response = await fetchForecastWeather(location, WEATHER_API_URL);
      if (response) {
        setForecastData(response);

        const allHours = response.forecast.forecastday.flatMap((day: any) =>
          day.hour.map((hour: Hour) => ({
            time: hour.time,
            feelslike_c: hour.feelslike_c,
            wind_mph: hour.wind_mph,
            wind_kph: hour.wind_kph,
            pressure_mb: hour.pressure_mb,
            pressure_in: hour.pressure_in,
            precip_mm: hour.precip_mm,
            precip_in: hour.precip_in,
            snow_cm: hour.snow_cm,
            humidity: hour.humidity,
            cloud: hour.cloud,
            feelslike_f: hour.feelslike_f,
            windchill_c: hour.windchill_c,
            windchill_f: hour.windchill_f,
            heatindex_c: hour.heatindex_c,
            heatindex_f: hour.heatindex_f,
            dewpoint_c: hour.dewpoint_c,
            dewpoint_f: hour.dewpoint_f,
            will_it_rain: hour.will_it_rain,
            chance_of_rain: hour.chance_of_rain,
          }))
        );
        setHourlyData(allHours);
      }
    };
    fetchAllForecastWeather();
  }, [WEATHER_API_URL, location]);

  // Separate chart data for different parameters
  const chartDataFeelsLike = {
    labels: hourlyData.map((item) => formatTime(item.time)),
    datasets: [
      {
        label: "Feels Like Temperature (°C)",
        data: hourlyData.map((item) => item.feelslike_c),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartDataWindSpeed = {
    labels: hourlyData.map((item) => formatTime(item.time)),
    datasets: [
      {
        label: "Wind Speed (mph)",
        data: hourlyData.map((item) => item.wind_mph),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartDataHumidity = {
    labels: hourlyData.map((item) => formatTime(item.time)),
    datasets: [
      {
        label: "Humidity (%)",
        data: hourlyData.map((item) => item.humidity),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartDataPrecipitation = {
    labels: hourlyData.map((item) => formatTime(item.time)),
    datasets: [
      {
        label: "Precipitation (mm)",
        data: hourlyData.map((item) => item.precip_mm),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: true, text: "Time" } },
      y: { title: { display: true, text: "Value" } },
    },
  };

  const chartDataHeatIndex = {
    labels: hourlyData.map((item) => formatTime(item.time)),
    datasets: [
      {
        label: "Heat (c)",
        data: hourlyData.map((item) => item.heatindex_c),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="h-screen w-full">
      <Header />
      <div className="p-5">
        {forecastData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-w-7xl mx-auto">
              <div className="bg-white p-4 shadow rounded">
                <div className="text-center mb-4">Feels Like Temperature</div>
                <div className="h-[300px]">
                  <BarChart data={chartDataFeelsLike} options={chartOptions} />
                </div>
              </div>
              <div className="bg-white p-4 shadow rounded">
                <div className="text-center mb-4">Wind Speed</div>
                <div className="h-[300px]">
                  <BarChart data={chartDataWindSpeed} options={chartOptions} />
                </div>
              </div>
              <div className="bg-white p-4 shadow rounded">
                <div className="text-center mb-4">Humidity</div>
                <div className="h-[300px]">
                  <BarChart data={chartDataHumidity} options={chartOptions} />
                </div>
              </div>
              <div className="bg-white p-4 shadow rounded">
                <div className="text-center mb-4">Precipitation</div>
                <div className="h-[300px]">
                  <BarChart
                    data={chartDataPrecipitation}
                    options={chartOptions}
                  />
                </div>
              </div>
              <div className="bg-white p-4 shadow rounded">
                <div className="text-center mb-4">Heat Index</div>
                <div className="h-[300px]">
                  <LineChart data={chartDataHeatIndex} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Statistics;
