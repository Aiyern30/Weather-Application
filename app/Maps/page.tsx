"use client";
import GoogleMaps from "@/components/GoogleMaps";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { styles } from "@/utils/mapStyle";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useState, useEffect, act } from "react";

const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
});

const defaultCoords = { lat: 4.2105, lon: 101.9758 };

const Page = () => {
  const [mapStyle, setMapStyle] = useState<google.maps.MapTypeStyle[]>(
    styles.default
  );
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    defaultCoords
  );

  const handleMapStyleChange = (style: string) => {
    setMapStyle(styles[style]);
  };
  const [activeTab, setActiveTab] = useState("Google");
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState("Malaysia");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Fetch coordinates based on the location (e.g., from Weather API)
  const fetchCoordinates = async (location: string) => {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=f1250c5c92844d20a8d104804240104&q=${location}&aqi=yes`
      );
      const data = await response.json();

      if (data && data.location) {
        const { lat, lon } = data.location;
        setCoords({ lat, lon });
        setLocation(location); // Update the location name
      } else {
        setError("Location not found.");
      }
    } catch (err) {
      setError("Failed to fetch location data.");
    }
  };

  const fetchSuggestions = async (query: string) => {
    // Replace with your own logic to fetch location suggestions
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/search.json?key=f1250c5c92844d20a8d104804240104&q=${query}`
      );
      const data = await response.json();
      const suggestions = data.map((item: any) => item.name); // Adjust based on API response structure
      setSuggestions(suggestions);
    } catch (err) {
      console.error("Failed to fetch suggestions.");
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      setLocation(searchQuery);
    }
  };

  const handleSelectLocation = (location: string) => {
    setLocation(location);
    setSearchQuery("");
    setSuggestions([]);
    fetchCoordinates(location);
  };

  useEffect(() => {
    fetchCoordinates("Malaysia"); // Fetch default location data for Malaysia on page load
  }, []);

  useEffect(() => {
    if (searchQuery) {
      fetchSuggestions(searchQuery);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  return (
    <div className="relative">
      <div className="absolute top-4 right-20 z-10 flex items-center justify-center space-x-5">
        <Select
          value={activeTab}
          onValueChange={(value) => setActiveTab(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a map" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Google">Google Maps</SelectItem>
              <SelectItem value="Reatlef">Reatlef</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {activeTab === "Google" && (
          <Select
            value={Object.keys(styles).find((key) => styles[key] === mapStyle)}
            onValueChange={(value) => handleMapStyleChange(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a map style" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="night">Night</SelectItem>
                <SelectItem value="retro">Retro</SelectItem>
                <SelectItem value="Dark">Dark</SelectItem>
                <SelectItem value="Aubergine">Aubergine</SelectItem>
                <SelectItem value="Vintage">Vintage</SelectItem>
                <SelectItem value="Avocado">Avocado</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      </div>

      <h1 className="absolute top-5 left-1/2 transform -translate-x-1/2 z-10 bg-white px-4 py-2 rounded-lg shadow-md text-black">
        Map Page - {location}
      </h1>
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10 bg-white px-4 py-2 rounded-lg shadow-md flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:space-x-2 text-black">
        <Input
          type="text"
          name="location"
          placeholder="Search location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          className="p-2 border rounded-lg w-full sm:w-auto"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Search
        </button>

        {/* Location suggestions dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute top-full mt-2 w-full sm:w-auto bg-white border border-gray-300 shadow-lg rounded z-10">
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

      {error && (
        <p className="absolute top-24 left-1/2 transform -translate-x-1/2 z-10 text-red-500 bg-white px-4 py-2 rounded-lg shadow-md">
          {error}
        </p>
      )}

      {/* Display location-related image if available */}
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={location}
          style={{
            width: "100%",
            maxHeight: "400px",
            objectFit: "cover",
            position: "absolute",
            bottom: "10px",
            left: "0",
            zIndex: 10,
          }}
        />
      )}

      {/* Only render the MapComponent if coords are available */}
      {coords ? (
        activeTab === "Google" ? (
          <GoogleMaps lat={coords.lat} lon={coords.lon} mapStyle={mapStyle} />
        ) : (
          <MapComponent lat={coords.lat} lon={coords.lon} />
        )
      ) : (
        <p>Enter a location to view its map.</p>
      )}
    </div>
  );
};

export default Page;
