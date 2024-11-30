import { AirQuality, WeatherApiResponse } from "@/type/types";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage, Input } from "../ui";

export default function Header() {
  const [location, setLocation] = useState("Malaysia");
  const [weatherData, setWeatherData] = useState<WeatherApiResponse | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [airQuality, setAirQuality] = useState<AirQuality | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [locationImage, setLocationImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Define the fetchWeatherData function within the component scope
  const fetchWeatherData = async (query: string) => {
    setLoading(true);
    try {
      console.log(`Fetching data for location: ${query}`);
      const response = await fetch(`/api/weather?query=${query}`);
      if (!response.ok) throw new Error("Location not found");

      const data = await response.json();
      console.log("Fetched data:", data);

      setWeatherData(data.current);
      setAirQuality(data.air_quality);
      setLocationImage(data.image_url);
      setError(null);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      setWeatherData(null);
      setAirQuality(null);
      setLocationImage(null);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data when the location changes or the component mounts
    fetchWeatherData(location);
  }, [location]);

  const handleSelectLocation = (selectedLocation: string) => {
    setLocation(selectedLocation);
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
          <div className="text-sm text-gray-500 mt-1">
            {loading ? (
              "Fetching..."
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : weatherData ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 font-body">
                {[
                  {
                    src: "/Weather/time.gif",
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
              "No data available"
            )}
          </div>
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
            <div className="absolute top-full mt-2 w-full sm:w-full md:w-auto bg-white border border-gray-300 shadow-lg rounded z-10">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-sm"
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
}
