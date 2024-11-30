// app/api/weather/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "Location query is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch current weather
    const currentResponse = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=f1250c5c92844d20a8d104804240104&q=${query}&aqi=yes`
    );
    if (currentResponse.status !== 200) throw new Error("Location not found");

    const currentData = currentResponse.data;

    // Fetch forecast weather
    const forecastResponse = await axios.get(
      `http://api.weatherapi.com/v1/forecast.json?key=f1250c5c92844d20a8d104804240104&q=${query}&days=1&aqi=yes&alerts=no`
    );
    if (forecastResponse.status !== 200) throw new Error("Location not found");

    const forecastData = forecastResponse.data;

    // Fetch image from Unsplash
    const unsplashResponse = await axios.get(
      `https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    const imageUrl = unsplashResponse.data.results[0]?.urls?.regular || null;

    // Respond with the combined data
    return NextResponse.json({
      current: currentData,
      forecast: forecastData.forecast,
      air_quality: currentData.current.air_quality,
      image_url: imageUrl,
    });
  } catch (error: any) {
    console.error("Error fetching weather data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
