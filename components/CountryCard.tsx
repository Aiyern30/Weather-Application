import WeatherIcon from "@/app/WeatherIcon";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui";
import { AirQuality, CurrentWeather, Forecastday } from "@/type/types";
import { useRouter } from "next/navigation";
type CountryWeatherData = {
  current: CurrentWeather | null;
  forecast: Forecastday | null;
  airQuality: AirQuality | null;
  imageUrl: string | null;
};

interface WeatherCardGridProps {
  additionalWeatherData: Record<string, CountryWeatherData>;
  setLocation: (country: string) => void;
}
const WeatherCardGrid = ({
  additionalWeatherData,
  setLocation,
}: WeatherCardGridProps) => {
  const router = useRouter();
  console.log(additionalWeatherData);
  return (
    <>
      {Object.entries(additionalWeatherData).map(([country, data]) => (
        <Card
          key={country}
          className="relative h-[300px] overflow-hidden flex flex-col items-center justify-center"
          style={{
            backgroundImage: `url(${data.imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          onClick={() => {
            router.push(`/Statistics/`);
            setLocation(country);
          }}
        >
          <CardHeader className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
            <CardTitle className="text-lg font-bold">{country}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-full w-full bg-black bg-opacity-40 p-4 relative">
            {!data.current ? (
              <div className="text-white">Loading...</div>
            ) : (
              <>
                <WeatherIcon
                  icon={data.current.condition.icon}
                  code={data.current.condition.code}
                  text={data.current.condition.text}
                  className="w-12 h-12 absolute top-0 right-0"
                />
                <div className="text-white text-xl font-bold">
                  {data.current.temp_c}°C
                </div>
                <div className="text-white text-sm mt-1">
                  UV Index: {data.current.uv}
                </div>
                <div className="text-white text-sm mt-1">
                  Humidity: {data.current.humidity}%
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default WeatherCardGrid;
