"use client";

import BarChart from "@/components/charts/Bar";
import ChartRenderer from "@/components/charts/ChartRenderer";
import LineChart from "@/components/charts/Line";
import Header from "@/components/Header";
import { useLocation } from "@/components/context/locationContext";
import {
  Button,
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
import { useDegree } from "@/components/context/TemperatureContext";
import {
  SpeedUnit,
  PrecipitationUnit,
  PressureUnit,
  Temperature,
  DistanceUnit,
} from "@/type/symbol";
import { usePressure } from "@/components/context/PressureContext";
import { usePrecipitation } from "@/components/context/PrecipitationContext";
import { useDistance } from "@/components/context/DistanceContext";
import { useSpeed } from "@/components/context/SpeedContext";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { color } from "framer-motion";

const Statistics = () => {
  const WEATHER_API_URL = process.env.NEXT_PUBLIC_WEATHER_API_URL;
  if (!WEATHER_API_URL) {
    throw new Error("WEATHER_API_URL is not defined");
  }
  const { theme } = useTheme();
  const { location } = useLocation();
  const { degree, setDegree } = useDegree();
  const { speed, setSpeed } = useSpeed();
  const { pressure, setPressure } = usePressure();
  const { precipitation, setPrecipitation } = usePrecipitation();
  const { distance, setDistance } = useDistance();
  const [forecastData, setForecastData] = useState<WeatherApiResponse | null>(
    null
  );
  const [hourlyData, setHourlyData] = useState<Hour[]>([]);
  const [chartType, setChartType] = useState<chartTypes>("BAR");
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
            feelslike_f: hour.feelslike_f,
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
            windchill_c: hour.windchill_c,
            windchill_f: hour.windchill_f,
            heatindex_c: hour.heatindex_c,
            heatindex_f: hour.heatindex_f,
            dewpoint_c: hour.dewpoint_c,
            dewpoint_f: hour.dewpoint_f,
            will_it_rain: hour.will_it_rain,
            vis_km: hour.vis_km,
            vis_miles: hour.vis_km,
            uv: hour.uv,
            gust_mph: hour.gust_mph,
            gust_kph: hour.gust_kph,
            chance_of_rain: hour.chance_of_rain,
          }))
        );
        setHourlyData(allHours);
      }
    };
    fetchAllForecastWeather();
  }, [WEATHER_API_URL, location]);

  const generateChartData = (
    label: string,
    dataKey: keyof Hour,
    isDarkTheme: boolean
  ) => {
    const colors = isDarkTheme
      ? generateRandomColor({ darkMode: true }) // Generate darker colors for dark theme
      : generateRandomColor({ darkMode: false }); // Generate lighter colors for light theme

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

  const chartDataWindSpeed = generateChartData(
    speed === SpeedUnit.MPH ? "Wind Speed (mph)" : "Wind Speed (kph)",
    speed === SpeedUnit.MPH ? "wind_mph" : "wind_kph",
    theme === "dark"
  );
  const chartDataGustSpeed = generateChartData(
    speed === SpeedUnit.MPH ? "Gust Speed (mph)" : "Gust Speed (kph)",
    speed === SpeedUnit.MPH ? "gust_mph" : "gust_kph",
    theme === "dark"
  );

  const chartDataVisible = generateChartData(
    distance === DistanceUnit.KM ? "Visibility (km)" : "Visibility (miles)",
    distance === DistanceUnit.KM ? "vis_km" : "vis_miles",
    theme === "dark"
  );

  const chartDataHumidity = generateChartData(
    "Humidity (%)",
    "humidity",
    theme === "dark"
  );

  const chartDataPressure = generateChartData(
    pressure === PressureUnit.INCH ? "Pressure (in)" : "Pressure (mb)",
    pressure === PressureUnit.INCH ? "pressure_in" : "pressure_mb",
    theme === "dark"
  );

  const chartDataPrecipitation = generateChartData(
    precipitation === PrecipitationUnit.INCH
      ? "Precipitation (inch)"
      : "Precipitation (mm)",
    precipitation === PrecipitationUnit.INCH ? "precip_in" : "precip_mm",
    theme === "dark"
  );

  const chartDataCloud = generateChartData("Cloud", "cloud", theme === "dark");
  const chartDataUVIndex = generateChartData(
    "UV Index",
    "uv",
    theme === "dark"
  );

  const chartDataWindChill = generateChartData(
    degree === Temperature.DEGREE ? "Wind Chill (°C)" : "Wind Chill (°F)",
    degree === Temperature.DEGREE ? "windchill_c" : "windchill_f",
    theme === "dark"
  );

  const chartDataDewpoint = generateChartData(
    degree === Temperature.DEGREE ? "Dew Point (°C)" : "Dew Point (°F)",
    degree === Temperature.DEGREE ? "dewpoint_c" : "dewpoint_f",
    theme === "dark"
  );

  const chartDataHeatIndex = generateChartData(
    degree === Temperature.DEGREE ? "Heat (°C)" : "Heat (°F)",
    degree === Temperature.DEGREE ? "heatindex_c" : "heatindex_f",
    theme === "dark"
  );
  const chartDataFeelsLike = generateChartData(
    degree === Temperature.DEGREE
      ? "Feels Like Temperature (°C)"
      : "Feels Like Temperature (°F)",
    degree === Temperature.DEGREE ? "feelslike_c" : "feelslike_f",
    theme === "dark"
  );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        labels: {
          color: theme === "dark" ? "white" : "black",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color:
            theme === "dark"
              ? "rgba(255, 255, 255, 0.8)"
              : "rgba(0, 0, 0, 0.8)",
        },
        title: {
          display: true,
          text: "Time",
          color:
            theme === "dark"
              ? "rgba(255, 255, 255, 0.8)"
              : "rgba(0, 0, 0, 0.8)",
        },
      },
      y: {
        ticks: {
          color:
            theme === "dark"
              ? "rgba(255, 255, 255, 0.8)"
              : "rgba(0, 0, 0, 0.8)",
        },
        title: {
          display: true,
          text: "Value",
          color:
            theme === "dark"
              ? "rgba(255, 255, 255, 0.8)"
              : "rgba(0, 0, 0, 0.8)",
        },
      },
    },
  };
  return (
    <div className="h-screen w-full">
      <Header />
      <div className="p-5">
        <div className="flex justify-end items-center m-3">
          <Button
            variant="outline"
            onClick={() => {
              degree === Temperature.DEGREE
                ? setDegree(Temperature.FAHRENHEIT)
                : setDegree(Temperature.DEGREE);
            }}
          >
            {degree}
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              speed === SpeedUnit.MPH
                ? setSpeed(SpeedUnit.KPH)
                : setSpeed(SpeedUnit.MPH);
            }}
          >
            {speed}
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              distance === DistanceUnit.KM
                ? setDistance(DistanceUnit.MILES)
                : setDistance(DistanceUnit.KM);
            }}
          >
            {distance}
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              pressure === PressureUnit.INCH
                ? setPressure(PressureUnit.MB)
                : setPressure(PressureUnit.INCH);
            }}
          >
            {pressure}
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              precipitation === PrecipitationUnit.INCH
                ? setPrecipitation(PrecipitationUnit.MM)
                : setPrecipitation(PrecipitationUnit.INCH);
            }}
          >
            {precipitation}
          </Button>

          <Select
            value={chartType}
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
            <div
              className={cn(
                "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-w-7xl mx-auto"
              )}
            >
              <div
                className={cn("bg-white dark:bg-[#4A4A4A] p-4 shadow rounded")}
              >
                <div className="text-center mb-4">Feels Like Temperature</div>
                <div className="h-[300px]">
                  <ChartRenderer
                    chartType={chartType}
                    data={chartDataFeelsLike}
                    options={chartOptions}
                  />
                </div>
              </div>
              <div
                className={cn("bg-white dark:bg-[#4A4A4A] p-4 shadow rounded")}
              >
                <div className="text-center mb-4">Wind Speed</div>
                <div className="h-[300px]">
                  <ChartRenderer
                    chartType={chartType}
                    data={chartDataWindSpeed}
                    options={chartOptions}
                  />
                </div>
              </div>
              <div
                className={cn("bg-white dark:bg-[#4A4A4A] p-4 shadow rounded")}
              >
                <div className="text-center mb-4">Gust Speed</div>
                <div className="h-[300px]">
                  <ChartRenderer
                    chartType={chartType}
                    data={chartDataGustSpeed}
                    options={chartOptions}
                  />
                </div>
              </div>
              <div
                className={cn("bg-white dark:bg-[#4A4A4A] p-4 shadow rounded")}
              >
                <div className="text-center mb-4">Visibility</div>
                <div className="h-[300px]">
                  <ChartRenderer
                    chartType={chartType}
                    data={chartDataVisible}
                    options={chartOptions}
                  />
                </div>
              </div>
              <div
                className={cn("bg-white dark:bg-[#4A4A4A] p-4 shadow rounded")}
              >
                <div className="text-center mb-4">Humidity</div>
                <div className="h-[300px]">
                  <ChartRenderer
                    chartType={chartType}
                    data={chartDataHumidity}
                    options={chartOptions}
                  />
                </div>
              </div>
              <div
                className={cn("bg-white dark:bg-[#4A4A4A] p-4 shadow rounded")}
              >
                <div className="text-center mb-4">Precipitation</div>
                <div className="h-[300px]">
                  <ChartRenderer
                    chartType={chartType}
                    data={chartDataPrecipitation}
                    options={chartOptions}
                  />
                </div>
              </div>
              <div
                className={cn("bg-white dark:bg-[#4A4A4A] p-4 shadow rounded")}
              >
                <div className="text-center mb-4">Heat Index</div>
                <div className="h-[300px]">
                  <ChartRenderer
                    chartType={chartType}
                    data={chartDataHeatIndex}
                    options={chartOptions}
                  />
                </div>
              </div>
              <div
                className={cn("bg-white dark:bg-[#4A4A4A] p-4 shadow rounded")}
              >
                <div className="text-center mb-4">Pressure</div>
                <div className="h-[300px]">
                  <ChartRenderer
                    chartType={chartType}
                    data={chartDataPressure}
                    options={chartOptions}
                  />
                </div>
              </div>
              <div
                className={cn("bg-white dark:bg-[#4A4A4A] p-4 shadow rounded")}
              >
                <div className="text-center mb-4">Cloud</div>
                <div className="h-[300px]">
                  <ChartRenderer
                    chartType={chartType}
                    data={chartDataCloud}
                    options={chartOptions}
                  />
                </div>
              </div>
              <div
                className={cn("bg-white dark:bg-[#4A4A4A] p-4 shadow rounded")}
              >
                <div className="text-center mb-4">UV Index</div>
                <div className="h-[300px]">
                  <ChartRenderer
                    chartType={chartType}
                    data={chartDataUVIndex}
                    options={chartOptions}
                  />
                </div>
              </div>
              <div
                className={cn("bg-white dark:bg-[#4A4A4A] p-4 shadow rounded")}
              >
                <div className="text-center mb-4">Wind Chill</div>
                <div className="h-[300px]">
                  <ChartRenderer
                    chartType={chartType}
                    data={chartDataWindChill}
                    options={chartOptions}
                  />
                </div>
              </div>
              <div
                className={cn("bg-white dark:bg-[#4A4A4A] p-4 shadow rounded")}
              >
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
