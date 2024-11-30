// "use client";

// import Header from "@/components/pages/Header";
// import { AirQuality, WeatherApiResponse } from "@/type/types";
// import React, { useEffect, useState } from "react";

// const Page = () => {
//   return (
//     <div className="h-screen w-full">
//       <Header />
//       <div></div>
//     </div>
//   );
// };

// export default Page;

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Input,
} from "@/components/ui";
import WeatherIcon from "@/app/WeatherIcon";
import { AirQuality, WeatherApiResponse } from "@/type/types";
import Header from "@/components/Header";
import { useLocation } from "@/components/locationContext";
import { fetchImageUrl, fetchWeatherDataForCountry } from "@/lib/fetchData";

export default function Home() {
  const WEATHER_API_URL = process.env.NEXT_PUBLIC_WEATHER_API_URL;
  if (!WEATHER_API_URL) {
    throw new Error("WEATHER_API_URL is not defined");
  }
  const UNSPLASH_API_URL = process.env.NEXT_PUBLIC_UNSPLASH_API_URL;
  if (!UNSPLASH_API_URL) {
    throw new Error("UNSPLASH_API_URL is not defined");
  }
  const { location } = useLocation();

  const [weatherData, setWeatherData] = useState<WeatherApiResponse | null>(
    null
  );

  const [airQuality, setAirQuality] = useState<AirQuality | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [locationImage, setLocationImage] = useState<string | null>(null);

  const [additionalWeatherData, setAdditionalWeatherData] = useState<
    Record<
      string,
      { weather: WeatherApiResponse | null; imageUrl: string | null }
    >
  >({
    "South Korea": { weather: null, imageUrl: null },
    China: { weather: null, imageUrl: null },
    "United States": { weather: null, imageUrl: null },
    Japan: { weather: null, imageUrl: null },
  });

  // Fetch weather data based on location
  useEffect(() => {
    const fetchAllWeatherData = async (query: string) => {
      try {
        // Fetch current weather
        const currentResponse = await fetch(
          `${WEATHER_API_URL}/v1/current.json?key=f1250c5c92844d20a8d104804240104&q=${query}&aqi=yes`
        );
        if (!currentResponse.ok) throw new Error("Location not found");

        const currentData: WeatherApiResponse = await currentResponse.json();

        // Fetch forecast weather
        const forecastResponse = await fetch(
          `${WEATHER_API_URL}/v1/forecast.json?key=f1250c5c92844d20a8d104804240104&q=${query}&days=1&aqi=yes&alerts=no`
        );
        if (!forecastResponse.ok) throw new Error("Location not found");

        const forecastData = await forecastResponse.json();

        // Fetch image from Unsplash
        const imageUrl = await fetchUnsplashImage(query);

        // Set weather data with forecast data and image
        setWeatherData({ ...currentData, forecast: forecastData.forecast });

        setAirQuality(currentData.current.air_quality);
        setLocationImage(imageUrl);
        setError(null);
      } catch (error: any) {
        console.error("Error fetching weather data:", error);
        setWeatherData(null);
        setAirQuality(null);
        setLocationImage(null);
        setError(error.message);
      }
    };

    fetchAllWeatherData(location);

    const fetchWeatherDataForCountries = async (
      country: string,
      WEATHER_API_URL: string
    ) => {
      try {
        const response = await fetchWeatherDataForCountry(
          country,
          WEATHER_API_URL
        );
        if (response) {
          // Fetch image URL
          const imageUrl = await fetchImageUrl(country, UNSPLASH_API_URL);

          setAdditionalWeatherData((prevData) => ({
            ...prevData,
            [country]: { weather: weatherData, imageUrl: imageUrl || null },
          }));
        }
      } catch (error) {
        setAdditionalWeatherData((prevData) => ({
          ...prevData,
          [country]: { weather: null, imageUrl: null },
        }));
      }
    };
    const countries = ["South Korea", "China", "United States", "Japan"];
    countries.forEach((country) =>
      fetchWeatherDataForCountries(country, WEATHER_API_URL)
    );
  }, [location]);

  // Fetch image from Unsplash with Axios
  const fetchUnsplashImage = async (query: string) => {
    try {
      const response = await axios.get(
        `${UNSPLASH_API_URL}/search/photos?query=${query}&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
      );
      return response.data.results[0]?.urls?.regular || null;
    } catch (error) {
      console.error("Error fetching image from Unsplash:", error);
      return null;
    }
  };

  return (
    <div className="h-screen w-full">
      <Header />
      <div className="p-5">
        <div className="col-span-full sm:col-span-2 lg:col-span-3 h-auto border border-gray-300 flex flex-col lg:flex-row items-center lg:items-start justify-center p-4 space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Weather Icon Section */}
          <div className="flex flex-col items-center lg:items-start mb-4 lg:mb-0 w-full lg:w-auto">
            {weatherData?.current.condition.icon ? (
              <WeatherIcon
                icon={weatherData.current.condition.icon}
                code={weatherData.current.condition.code}
                text={weatherData.current.condition.text}
                className="w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 xl:w-80 xl:h-80" // Adjust icon size for mobile and larger screens
              />
            ) : (
              <div className="text-gray-500">No weather data available</div>
            )}
          </div>
          {/* Container for Weather Details and Image */}
          <div className="flex flex-col lg:flex-row flex-grow w-full space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Weather Details Section */}
            <div className="flex flex-col w-full bg-transparent">
              <Card className="w-full bg-transparent">
                <CardHeader>
                  <CardTitle className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                    <span className="font-number">
                      {weatherData?.current.temp_c
                        ? weatherData.current.temp_c
                        : 0}
                    </span>{" "}
                    <span className="font-title text-xl md:text-2xl lg:text-3xl">
                      °C
                    </span>
                  </CardTitle>
                  <CardDescription className="text-center text-base sm:text-lg md:text-xl lg:text-2xl font-body">
                    {weatherData?.current.condition.text}
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 text-sm md:text-base">
                  {/* Weather Details Content */}
                  <div className="flex flex-col space-y-2">
                    {[
                      {
                        src: "/Weather/uv-radiation.gif",
                        label: "UV INDEX",
                        value: weatherData?.current.uv || 0,
                      },
                      {
                        src: "/Weather/wind.gif",
                        label: "WIND",
                        value: `${weatherData?.current.wind_mph || 0} MPH`,
                      },
                      {
                        src: "/Weather/feel-like.gif",
                        label: "FEELS LIKE",
                        value: `${weatherData?.current.feelslike_c || 0} °C`,
                      },
                      {
                        src: "/Weather/humidity.gif",
                        label: "HUMIDITY",
                        value: `${weatherData?.current.humidity || 0}%`,
                      },
                    ].map(({ src, label, value }) => (
                      <div key={label} className="flex items-center">
                        <Avatar>
                          <AvatarImage src={src} alt={label} />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <span className="ml-2">
                          <span className="font-body font-semibold">
                            {label}:
                          </span>
                          <span className="font-number"> {value}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col space-y-2">
                    {[
                      {
                        src: "/Weather/Pressure.gif",
                        label: "PRESSURE",
                        value: `${weatherData?.current.pressure_mb || 0} mb`,
                      },
                      {
                        src: "/Weather/visibility.gif",
                        label: "VISIBILITY",
                        value: `${weatherData?.current.vis_km || 0} km`,
                      },
                      {
                        src: "/Weather/sunrise.gif",
                        label: "SUNRISE",
                        value:
                          weatherData?.forecast.forecastday[0].astro.sunrise ||
                          "N/A",
                      },
                      {
                        src: "/Weather/sunset.gif",
                        label: "SUNSET",
                        value:
                          weatherData?.forecast.forecastday[0].astro.sunset ||
                          "N/A",
                      },
                    ].map(({ src, label, value }) => (
                      <div key={label} className="flex items-center">
                        <Avatar>
                          <AvatarImage src={src} alt={label} />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <span className="ml-2">
                          <span className="font-body font-semibold">
                            {label}:
                          </span>
                          <span className="font-number"> {value}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {locationImage && (
              <div className="w-full lg:w-1/2 flex-shrink-0">
                <div
                  className="w-full h-60 sm:h-80 md:h-96 lg:h-80 xl:h-96 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${locationImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between mb-4">
          <div className="text-xl font-bold">Other Large Cities</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 cursor-pointer">
          {Object.entries(additionalWeatherData).map(([country, data]) => (
            <div
              key={country}
              className="relative h-40 border border-gray-300 rounded-lg overflow-hidden flex flex-col items-center justify-center bg-gray-100"
              style={{
                backgroundImage: `url(${data.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                <span className="font-bold text-lg">{country}</span>
              </div>
              <div className="flex flex-col items-center justify-center h-full w-full bg-black bg-opacity-40 p-4">
                <div className="text-white text-xl font-bold">
                  {data.weather?.current.temp_c}°C
                </div>
                <div className="text-white text-sm mt-1">
                  UV Index: {data.weather?.current.uv}
                </div>
                <div className="text-white text-sm mt-1">
                  Humidity: {data.weather?.current.humidity}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
