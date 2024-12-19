"use client";

import Header from "@/components/Header";
import { useLocation } from "@/components/context/locationContext";
import { fetchForecastWeather } from "@/lib/fetchData";
import { chartTypes } from "@/type/chartTypes";
import { Hour, WeatherApiResponse } from "@/type/types";
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
import { ChartCard } from "@/components/ChartCard";
import SubHeader from "@/components/SubHeader";

const Statistics = () => {
  const WEATHER_API_URL = process.env.NEXT_PUBLIC_WEATHER_API_URL;
  if (!WEATHER_API_URL) {
    throw new Error("WEATHER_API_URL is not defined");
  }
  const { theme } = useTheme();
  const { location } = useLocation();
  const { degree } = useDegree();
  const { speed } = useSpeed();
  const { pressure } = usePressure();
  const { precipitation } = usePrecipitation();
  const { distance } = useDistance();
  const [forecastData, setForecastData] = useState<WeatherApiResponse | null>(
    null
  );
  const [hourlyData, setHourlyData] = useState<Hour[]>([]);
  const [chartType, setChartType] = useState<chartTypes>("BAR");
  console.log("chartType", chartType);

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
      ? generateRandomColor({ darkMode: true })
      : generateRandomColor({ darkMode: false });

    const fillConfig =
      chartType === "AREA"
        ? {
            target: "origin",
            above: colors.backgroundColor,
            below: colors.backgroundColor,
          }
        : false;

    return {
      labels: hourlyData.map((item) => formatTime(item.time)),
      datasets: [
        {
          label,
          data: hourlyData.map((item) => item[dataKey]),
          backgroundColor: colors.backgroundColor,
          borderColor: colors.borderColor,
          borderWidth: 1,
          fill: fillConfig,
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

  const charts = [
    { title: "Feels Like Temperature", data: chartDataFeelsLike },
    { title: "Wind Speed", data: chartDataWindSpeed },
    { title: "Gust Speed", data: chartDataGustSpeed },
    { title: "Visibility", data: chartDataVisible },
    { title: "Humidity", data: chartDataHumidity },
    { title: "Precipitation", data: chartDataPrecipitation },
    { title: "Heat Index", data: chartDataHeatIndex },
    { title: "Pressure", data: chartDataPressure },
    { title: "Cloud", data: chartDataCloud },
    { title: "UV Index", data: chartDataUVIndex },
    { title: "Wind Chill", data: chartDataWindChill },
    { title: "Dew Point", data: chartDataDewpoint },
  ];

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
        <SubHeader chartType={chartType} setChartType={setChartType} />

        {forecastData && (
          <div
            className={cn(
              "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-w-7xl mx-auto"
            )}
          >
            {charts.map((chart, index) => (
              <ChartCard
                key={index}
                title={chart.title}
                chartType={chartType}
                data={chart.data}
                options={chartOptions}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistics;
