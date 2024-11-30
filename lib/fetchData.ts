import { WeatherApiResponse } from "@/type/types";
import axios from "axios";

export const fetchCurrentWeather = async (
  query: string,
  WEATHER_API_URL: string
) => {
  try {
    const currentResponse = await fetch(
      `${WEATHER_API_URL}/v1/current.json?key=f1250c5c92844d20a8d104804240104&q=${query}&aqi=yes`
    );
    if (!currentResponse.ok) throw new Error("Location not found");

    const currentData: WeatherApiResponse = await currentResponse.json();
    return currentData;
  } catch (error) {
    return null;
  }
};

export const fetchForecastWeather = async (
  query: string,
  WEATHER_API_URL: string
) => {
  try {
    const forecastResponse = await fetch(
      `${WEATHER_API_URL}/v1/forecast.json?key=f1250c5c92844d20a8d104804240104&q=${query}&days=1&aqi=yes&alerts=no`
    );
    if (!forecastResponse.ok) throw new Error("Location not found");

    const forecastData = await forecastResponse.json();
    return forecastData;
  } catch (error) {
    return null;
  }
};

export const fetchWeatherDataForCountry = async (
  country: string,
  WEATHER_API_URL: string
) => {
  try {
    // Fetch weather data
    const weatherResponse = await fetch(
      `${WEATHER_API_URL}/v1/current.json?key=f1250c5c92844d20a8d104804240104&q=${country}&aqi=yes`
    );
    if (!weatherResponse.ok) throw new Error("Location not found");

    const weatherData: WeatherApiResponse = await weatherResponse.json();
    return weatherData;
  } catch (error) {
    console.error(`Error fetching weather data for ${country}:`, error);
    return null;
  }
};

export const fetchImageUrl = async (
  query: string,
  UNSPLASH_API_URL: string
): Promise<string | null> => {
  try {
    const response = await fetch(
      `${UNSPLASH_API_URL}/search/photos?query=${query}&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}&per_page=1`
    );
    const data = await response.json();
    return data.results[0]?.urls?.regular || null;
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
};
export const fetchSuggestions = async (
  query: string,
  WEATHER_API_URL: string
) => {
  if (query.length < 3) return;
  try {
    const response = await fetch(
      `${WEATHER_API_URL}/v1/search.json?key=f1250c5c92844d20a8d104804240104&q=${query}`
    );
    const data = await response.json();
    return data.map((item: any) => item.name);
  } catch (error) {
    console.error("Error fetching location suggestions:", error);
    return [];
  }
};

export const fetchUnsplashImage = async (
  query: string,
  UNSPLASH_API_URL: string
) => {
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
