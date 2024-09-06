import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import React from "react";
import dynamic from "next/dynamic";

// Dynamically import Lottie
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// Import Lottie animation JSON files
import SunnyDay from "@/app/Sunny.json";
import SunnyNight from "@/app/Night-Clear.json";
import RainDay from "@/app/Rain.json";
import RainNight from "@/app/Night-Rain.json";
import SnowDay from "@/app/Snow.json";
import SnowNight from "@/app/Night-Snow.json";
import ThunderDay from "@/app/Thunder.json";
import ThunderNight from "@/app/Night-Thunder.json";
import MistDay from "@/app/Mist.json";
import MistNight from "@/app/Night-Mist.json";
// import Sleet from "@/app/Sleet.json";

interface WeatherIconProps {
  icon: string;
  code: number;
  text: string;
  className?: string; // Add className as an optional prop
}

// Define weather categories and their codes
const weatherCategories: { [key: string]: number[] } = {
  sunny: [1000, 1003, 1009], // Clear, partly cloudy
  rain: [1063, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246], // Rain and showers
  snow: [1066, 1114, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258], // Snow
  thunder: [1087, 1273, 1276, 1279, 1282], // Thunderstorms
  mist: [1030, 1135, 1147], // Mist, fog
  sleet: [1069, 1072, 1168, 1204, 1207, 1249, 1252], // Sleet
};

const WeatherIcon = ({ icon, code, text, className }: WeatherIconProps) => {
  // Helper function to check if the icon URL indicates day or night
  const isDayTime = (icon: string): boolean => {
    return icon.includes("/day/");
  };

  // Determine if it's day or night based on the icon URL
  const dayOrNight = isDayTime(icon) ? "day" : "night";

  // Function to map weather code to category
  const getWeatherCategory = (code: number): string => {
    if (weatherCategories.sunny.includes(code)) return "sunny";
    if (weatherCategories.rain.includes(code)) return "rain";
    if (weatherCategories.snow.includes(code)) return "snow";
    if (weatherCategories.thunder.includes(code)) return "thunder";
    if (weatherCategories.mist.includes(code)) return "mist";
    if (weatherCategories.sleet.includes(code)) return "sleet";
    return "default";
  };

  const category = getWeatherCategory(code);

  // Render the appropriate Lottie animation or GIF based on the category
  const renderCategoryIcon = (category: string): JSX.Element | null => {
    switch (category) {
      case "sunny":
        return dayOrNight === "day" ? (
          <Lottie animationData={SunnyDay} className={` ${className}`} />
        ) : (
          <Lottie animationData={SunnyNight} className={` ${className}`} />
        );
      case "rain":
        return dayOrNight === "day" ? (
          <Lottie animationData={RainDay} className={` ${className}`} />
        ) : (
          <Lottie animationData={RainNight} className={` ${className}`} />
        );
      case "snow":
        return dayOrNight === "day" ? (
          <Lottie animationData={SnowDay} className={` ${className}`} />
        ) : (
          <Lottie animationData={SnowNight} className={` ${className}`} />
        );
      case "thunder":
        return dayOrNight === "day" ? (
          <Lottie animationData={ThunderDay} className={` ${className}`} />
        ) : (
          <Lottie animationData={ThunderNight} className={` ${className}`} />
        );
      case "mist":
        return dayOrNight === "day" ? (
          <Lottie animationData={MistDay} className={` ${className}`} />
        ) : (
          <Lottie animationData={MistNight} className={` ${className}`} />
        );
      case "sleet":
        return dayOrNight === "day" ? (
          <Lottie animationData={SnowDay} className={` ${className}`} />
        ) : (
          <Lottie animationData={SnowNight} className={` ${className}`} />
        );
      default:
        return (
          <Avatar>
            <AvatarImage src={icon} alt={text} className={className} />;
            <AvatarFallback>{text}</AvatarFallback>
          </Avatar>
        );
    }
  };

  return <div className={className}>{renderCategoryIcon(category)}</div>;
};

export default WeatherIcon;
