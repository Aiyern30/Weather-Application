"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
} from "@/components/ui";
import WeatherIcon from "@/app/WeatherIcon";
import {
  AirQuality,
  CurrentWeather,
  Forecastday,
  WeatherApiResponse,
} from "@/type/types";
import Header from "@/components/Header";
import { useLocation } from "@/components/context/locationContext";
import { useRouter } from "next/navigation";
import { fetchAllCountries } from "@/lib/fetchCountry";
import { Country } from "@/type/country";
import { useToast } from "@/hooks/use-toast";
import WeatherCardGrid from "@/components/CountryCard";
type CountryWeatherData = {
  current: CurrentWeather | null;
  forecast: Forecastday | null;
  airQuality: AirQuality | null;
  imageUrl: string | null;
};
export default function Home() {
  const LOCAL_STORAGE_KEY = "selectedCountries";
  const { toast } = useToast();

  const WEATHER_API_URL = process.env.NEXT_PUBLIC_WEATHER_API_URL;
  if (!WEATHER_API_URL) {
    throw new Error("WEATHER_API_URL is not defined");
  }
  const UNSPLASH_API_URL = process.env.NEXT_PUBLIC_UNSPLASH_API_URL;
  if (!UNSPLASH_API_URL) {
    throw new Error("UNSPLASH_API_URL is not defined");
  }
  const { location, setLocation } = useLocation();

  const [weatherData, setWeatherData] = useState<WeatherApiResponse | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [airQuality, setAirQuality] = useState<AirQuality | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [locationImage, setLocationImage] = useState<string | null>(null);

  const [additionalWeatherData, setAdditionalWeatherData] = useState<
    Record<string, CountryWeatherData>
  >({});

  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const savedCountries = localStorage.getItem(LOCAL_STORAGE_KEY);
      return savedCountries ? JSON.parse(savedCountries) : [];
    }
    return [];
  });

  console.log("selectedCountries", selectedCountries);

  useEffect(() => {
    // Save selected countries to localStorage whenever they change
    if (typeof window !== "undefined") {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(selectedCountries)
      );
    }
  }, [selectedCountries]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredCountries = useMemo(() => {
    // Filter countries based on search query
    const searchResults = countries.filter(
      (country) =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        selectedCountries.includes(country.name)
    );
    // Ensure selected countries are included even if they don't match the query
    const uniqueCountries = Array.from(
      new Set([
        ...searchResults,
        ...countries.filter((country) =>
          selectedCountries.includes(country.name)
        ),
      ])
    );
    return uniqueCountries;
  }, [countries, searchQuery, selectedCountries]);
  const handleCheckboxChange = (countryName: string) => {
    setSelectedCountries((prev) => {
      if (prev.includes(countryName)) {
        const updatedSelectedCountries = prev.filter(
          (item) => item !== countryName
        );

        setAdditionalWeatherData((prevData) => {
          const updatedData = { ...prevData };
          delete updatedData[countryName];
          return updatedData;
        });

        return updatedSelectedCountries;
      } else {
        // Add country to selected list
        if (prev.length >= 20) {
          toast({
            title: "Selection Limit Reached",
            description: "You can only select up to 20 countries.",
            variant: "destructive",
          });
          return prev;
        }

        return [...prev, countryName];
      }
    });
  };

  // Fetch image from Unsplash with Axios
  const fetchUnsplashImage = useCallback(
    async (query: string) => {
      try {
        const response = await axios.get(
          `${UNSPLASH_API_URL}/search/photos?query=${query}&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
        );
        return response.data.results[0]?.urls?.regular || null;
      } catch (error) {
        console.error("Error fetching image from Unsplash:", error);
        return null;
      }
    },
    [UNSPLASH_API_URL]
  );
  // Fetch weather data based on location
  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        const fetchCountry = await fetchAllCountries();
        setCountries(fetchCountry);
      } catch (error) {
        console.log("Error fetching country");
      }
    };

    const fetchAllWeatherData = async (query: string) => {
      try {
        const currentResponse = await fetch(
          `${WEATHER_API_URL}/v1/current.json?key=f1250c5c92844d20a8d104804240104&q=${query}&aqi=yes`
        );
        if (!currentResponse.ok) throw new Error("Location not found");
        const currentData: WeatherApiResponse = await currentResponse.json();

        const forecastResponse = await fetch(
          `${WEATHER_API_URL}/v1/forecast.json?key=f1250c5c92844d20a8d104804240104&q=${query}&days=1&aqi=yes&alerts=no`
        );
        if (!forecastResponse.ok) throw new Error("Location not found");
        const forecastData = await forecastResponse.json();

        const imageUrl = await fetchUnsplashImage(query);

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

    const fetchWeatherDataForCountries = async (countries: string[]) => {
      for (const country of countries) {
        try {
          const currentResponse = await fetch(
            `${WEATHER_API_URL}/v1/current.json?key=f1250c5c92844d20a8d104804240104&q=${country}&aqi=yes`
          );
          if (!currentResponse.ok) throw new Error("Location not found");
          const currentData = await currentResponse.json();

          const forecastResponse = await fetch(
            `${WEATHER_API_URL}/v1/forecast.json?key=f1250c5c92844d20a8d104804240104&q=${country}&days=1&aqi=yes&alerts=no`
          );
          if (!forecastResponse.ok) throw new Error("Forecast not found");
          const forecastData = await forecastResponse.json();

          const imageUrl = await fetchUnsplashImage(country);

          setAdditionalWeatherData((prevData) => ({
            ...prevData,
            [country]: {
              current: currentData.current,
              forecast: forecastData.forecast,
              airQuality: currentData.current.air_quality,
              imageUrl: imageUrl || null,
            },
          }));
        } catch (error) {
          console.error(`Error fetching weather for ${country}:`, error);
          setAdditionalWeatherData((prevData) => ({
            ...prevData,
            [country]: {
              current: null,
              forecast: null,
              airQuality: null,
              imageUrl: null,
            },
          }));
        }
      }
    };

    fetchCountryData();

    if (location) {
      fetchAllWeatherData(location);
    }

    if (selectedCountries.length > 0) {
      fetchWeatherDataForCountries(selectedCountries);
    }
  }, [location, selectedCountries, WEATHER_API_URL, fetchUnsplashImage]);

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
          <Select>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select countries" />
            </SelectTrigger>
            <SelectContent>
              <div className="space-y-2 p-2">
                <Input
                  type="text"
                  className="w-full sm:w-full font-body"
                  placeholder="Search Countries"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleSearch(searchQuery)
                  }
                />
                {filteredCountries.map((country) => (
                  <div
                    key={country.code}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={country.code}
                      checked={selectedCountries.includes(country.name)}
                      onCheckedChange={() => handleCheckboxChange(country.name)}
                    />
                    <label
                      htmlFor={country.code}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {country.name}
                    </label>
                  </div>
                ))}
              </div>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 cursor-pointer">
          <WeatherCardGrid
            additionalWeatherData={additionalWeatherData}
            selectedCountries={selectedCountries}
            setLocation={setLocation}
          />
        </div>
      </div>
    </div>
  );
}
