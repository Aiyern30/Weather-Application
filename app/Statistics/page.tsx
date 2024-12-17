"use client";

import BarChart from "@/components/charts/Bar";
import ChartRenderer from "@/components/charts/ChartRenderer";
import LineChart from "@/components/charts/Line";
import Header from "@/components/Header";
import { useLocation } from "@/components/context/locationContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { fetchForecastWeather } from "@/lib/fetchData";
import { chartTypes } from "@/type/chartTypes";
import { Day, Hour, WeatherApiResponse } from "@/type/types";
import { formatTime, generateRandomColor } from "@/utils/function";
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
  const [chartType, setChartType] = useState<chartTypes>("LINE");
  const chartTypes: chartTypes[] = [
    "AREA",
    "BAR",
    "BUBBLE",
    "DOUGHNUT",
    "LINE",
    "POLAR",
    "RADAR",
  ];

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

  const generateChartData = (label: string, dataKey: keyof Hour) => {
    const colors = generateRandomColor();
    return {
      labels: hourlyData.map((item) => formatTime(item.time)),
      datasets: [
        {
          label,
          data: hourlyData.map((item) => item[dataKey]),
          backgroundColor: colors.backgroundColor,
          borderColor: colors.borderColor,
          borderWidth: 1,
        },
      ],
    };
  };

  const chartDataFeelsLike = generateChartData(
    "Feels Like Temperature (°C)",
    "feelslike_c"
  );

  const chartDataWindSpeed = generateChartData("Wind Speed (mph)", "wind_mph");

  const chartDataHumidity = generateChartData("Humidity (%)", "humidity");

  const chartDataPressure = generateChartData("Pressure (in)", "pressure_in");

  const chartDataPrecipitation = generateChartData(
    "Precipitation (mm)",
    "precip_mm"
  );
  const chartDataCloud = generateChartData("Cloud", "cloud");
  const chartDataWindChill = generateChartData("Wind Chill", "windchill_c");
  const chartDataDewpoint = generateChartData("Dew Point (°C)", "dewpoint_c");

  const chartDataHeatIndex = generateChartData("Heat (°C)", "heatindex_c");

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: true, text: "Time" } },
      y: { title: { display: true, text: "Value" } },
    },
  };
  return (
    <div className="h-screen w-full">
      <Header />
      <div className="p-5">
        <div className="flex justify-end m-3">
          <Select
            onValueChange={(value: chartTypes) => {
              setChartType(value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chart Type" />
            </SelectTrigger>
            <SelectContent>
              {chartTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {forecastData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-w-7xl mx-auto">
              <div className="bg-white p-4 shadow rounded">
                <div className="text-center mb-4">Feels Like Temperature</div>
                <div className="h-[300px]">
                  <ChartRenderer
                    chartType={chartType}
                    data={chartDataFeelsLike}
                    options={chartOptions}
                  />
                </div>
              </div>
              <div className="bg-white p-4 shadow rounded">
                <div className="text-center mb-4">Wind Speed</div>
                <div className="h-[300px]">
                  <ChartRenderer
                    chartType={chartType}
                    data={chartDataWindSpeed}
                    options={chartOptions}
                  />
                </div>
              </div>
              <div className="bg-white p-4 shadow rounded">
                <div className="text-center mb-4">Humidity</div>
                <div className="h-[300px]">
                  <ChartRenderer
                    chartType={chartType}
                    data={chartDataHumidity}
                    options={chartOptions}
                  />
                </div>
              </div>
              <div className="bg-white p-4 shadow rounded">
                <div className="text-center mb-4">Precipitation</div>
                <div className="h-[300px]">
                  <ChartRenderer
                    chartType={chartType}
                    data={chartDataPrecipitation}
                    options={chartOptions}
                  />
                </div>
              </div>
              <div className="bg-white p-4 shadow rounded">
                <div className="text-center mb-4">Heat Index</div>
                <div className="h-[300px]">
                  <ChartRenderer
                    chartType={chartType}
                    data={chartDataHeatIndex}
                    options={chartOptions}
                  />
                </div>
              </div>
              <div className="bg-white p-4 shadow rounded">
                <div className="text-center mb-4">Pressure</div>
                <div className="h-[300px]">
                  <ChartRenderer
                    chartType={chartType}
                    data={chartDataPressure}
                    options={chartOptions}
                  />
                </div>
              </div>
              <div className="bg-white p-4 shadow rounded">
                <div className="text-center mb-4">Cloud</div>
                <div className="h-[300px]">
                  <ChartRenderer
                    chartType={chartType}
                    data={chartDataCloud}
                    options={chartOptions}
                  />
                </div>
              </div>
              <div className="bg-white p-4 shadow rounded">
                <div className="text-center mb-4">Wind Chill</div>
                <div className="h-[300px]">
                  <ChartRenderer
                    chartType={chartType}
                    data={chartDataWindChill}
                    options={chartOptions}
                  />
                </div>
              </div>
              <div className="bg-white p-4 shadow rounded">
                <div className="text-center mb-4">Dew Point</div>
                <div className="h-[300px]">
                  <ChartRenderer
                    chartType={chartType}
                    data={chartDataDewpoint}
                    options={chartOptions}
                  />
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
