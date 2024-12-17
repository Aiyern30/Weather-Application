import {
  fetchCurrentWeather,
  fetchForecastWeather,
  fetchImageUrl,
  fetchSuggestions,
  fetchUnsplashImage,
  fetchWeatherDataForCountry,
} from "@/lib/fetchData";
import { AirQuality, CurrentWeather, WeatherApiResponse } from "@/type/types";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage, Input } from "./ui";
import { useLocation } from "./context/locationContext";

const Header = () => {
  const WEATHER_API_URL = process.env.NEXT_PUBLIC_WEATHER_API_URL;
  if (!WEATHER_API_URL) {
    throw new Error("WEATHER_API_URL is not defined");
  }
  const UNSPLASH_API_URL = process.env.NEXT_PUBLIC_UNSPLASH_API_URL;
  if (!UNSPLASH_API_URL) {
    throw new Error("UNSPLASH_API_URL is not defined");
  }
  const [weatherData, setWeatherData] = useState<WeatherApiResponse | null>(
    null
  );
  const { location, setLocation } = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [airQuality, setAirQuality] = useState<AirQuality | null>(null);
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

  useEffect(() => {
    const fetchWeatherData = async (
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
    countries.forEach((country) => fetchWeatherData(country, WEATHER_API_URL));

    const fetchSuggestionsData = async (query: string) => {
      try {
        const response = await fetchSuggestions(query, WEATHER_API_URL);
        if (response) {
          setSuggestions(response);
        }
      } catch (error) {
        setSuggestions([]);
      }
    };
    fetchSuggestionsData(searchQuery);

    const fetchWeather = async (query: string) => {
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
        const imageUrl = await fetchUnsplashImage(query, UNSPLASH_API_URL);

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

    fetchWeather(location);
  }, [location]);

  const handleSelectLocation = (location: string) => {
    setLocation(location);
    setSearchQuery("");
    setSuggestions([]);
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      setLocation(searchQuery);
    }
  };

  return (
    <div className="p-5 border-b border-gray-300 flex flex-col md:flex-row items-center">
      <div className="p-5 border-gray-300 flex flex-col md:flex-row items-center w-full">
        {/* Today Overview Section */}
        <div className="flex flex-col mb-4 md:mb-0 w-full md:w-1/2">
          <span className="text-2xl font-bold font-title">Today Overview</span>
          <span className="text-sm text-gray-500 mt-1">
            {error ? (
              <div className="text-red-500">{error}</div>
            ) : weatherData ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 font-body">
                {[
                  {
                    src: "/Weather/Time.gif",
                    label: "Time",
                    value: weatherData.location?.localtime || "N/A",
                  },
                  {
                    src: "/Weather/Region.gif",
                    label: "Timezone",
                    value: weatherData.location?.tz_id || "N/A",
                  },
                  {
                    src: "/Weather/City.gif",
                    label: "Location",
                    value:
                      `${weatherData.location?.name}, ${weatherData.location?.region}, ${weatherData.location?.country}` ||
                      "N/A",
                  },
                  {
                    src: "/Weather/Location.gif",
                    label: "Coordinates",
                    value:
                      `(${weatherData.location?.lat}°, ${weatherData.location?.lon}°)` ||
                      "N/A",
                  },
                ].map(({ src, label, value }) => (
                  <div key={label} className="flex items-center">
                    <Avatar>
                      <AvatarImage src={src} alt={label} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span className="ml-2">
                      <span className="font-body font-semibold">{label}: </span>
                      <span className="font-number">{value}</span>
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              "Fetching..."
            )}
          </span>
        </div>

        {/* Search Section */}
        <div className="flex flex-col md:flex-row w-full md:w-1/2 gap-2 relative items-center">
          <Input
            type="text"
            className="w-full sm:w-full md:w-auto font-body"
            placeholder="Search Your Location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="w-full md:w-auto px-4 py-2 bg-blue-500 text-white rounded text-sm md:text-base"
          >
            Search
          </button>

          {/* Location suggestions dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute top-full mt-2 w-full sm:w-full md:w-auto  shadow-lg rounded z-10">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 cursor-pointer text-sm dark:bg-[#2D2D2D] hover:dark:bg-gray-800 z-50"
                  onClick={() => handleSelectLocation(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
