// const handleFilterChange = (filter: string) => {
//   setFilters((prev) =>
//     prev.includes(filter)
//       ? prev.filter((f) => f !== filter)
//       : [...prev, filter]
//   );
// };

// const [location, setLocation] = useState("Malaysia");
//   const [weatherData, setWeatherData] = useState<WeatherApiResponse | null>(
//     null
//   );
//   console.log("weatherData", weatherData);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [suggestions, setSuggestions] = useState<string[]>([]); // Store location suggestions
//   const [airQuality, setAirQuality] = useState<AirQuality | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [day, setDay] = useState<number>(1);
//   console.log("day", day);
//   const [filters, setFilters] = useState<string[]>([
//     "Temperature (°C)",
//     "UV Index",
//     "Feels Like (°C)",
//   ]);
//   const [data, setData] = useState<{
//     weather: WeatherApiResponse | null;
//     airQuality: AirQuality | null;
//     error: string | null;
//   }>({
//     weather: null,
//     airQuality: null,
//     error: null,
//   });

// const currentHour =
//     weatherData?.location?.localtime?.split(" ")[1].slice(0, 2) || "";

//   const filteredData = {
//     labels: hourlyData.map((item) => item.time),
//     datasets: [
//       ...(filters.includes("Temperature (°C)")
//         ? [
//             {
//               label: "Temperature (°C)",
//               data: hourlyData.map((item) => item.temp_c),
//               borderColor: "rgba(75,192,192,1)",
//               backgroundColor: "rgba(75,192,192,0.2)",
//               fill: true,
//             },
//           ]
//         : []),
//       ...(filters.includes("Humidity (%)")
//         ? [
//             {
//               label: "Humidity (%)",
//               data: hourlyData.map((item) => item.humidity),
//               borderColor: "rgba(54, 162, 235, 1)",
//               backgroundColor: "rgba(54, 162, 235, 0.2)",
//               fill: true,
//             },
//           ]
//         : []),
//       ...(filters.includes("UV Index")
//         ? [
//             {
//               label: "UV Index",
//               data: hourlyData.map((item) => item.uv),
//               borderColor: "rgba(255, 206, 86, 1)",
//               backgroundColor: "rgba(255, 206, 86, 0.2)",
//               fill: true,
//             },
//           ]
//         : []),
//       ...(filters.includes("Wind Speed (kph)")
//         ? [
//             {
//               label: "Wind Speed (kph)",
//               data: hourlyData.map((item) => item.wind_kph),
//               borderColor: "rgba(255, 99, 132, 1)",
//               backgroundColor: "rgba(255, 99, 132, 0.2)",
//               fill: true,
//             },
//           ]
//         : []),
//       ...(filters.includes("Pressure (mb)")
//         ? [
//             {
//               label: "Pressure (mb)",
//               data: hourlyData.map((item) => item.pressure_mb),
//               borderColor: "rgba(153, 102, 255, 1)",
//               backgroundColor: "rgba(153, 102, 255, 0.2)",
//               fill: true,
//             },
//           ]
//         : []),
//       ...(filters.includes("Precipitation (mm)")
//         ? [
//             {
//               label: "Precipitation (mm)",
//               data: hourlyData.map((item) => item.precip_mm),
//               borderColor: "rgba(255, 159, 64, 1)",
//               backgroundColor: "rgba(255, 159, 64, 0.2)",
//               fill: true,
//             },
//           ]
//         : []),
//       ...(filters.includes("Feels Like (°C)")
//         ? [
//             {
//               label: "Feels Like (°C)",
//               data: hourlyData.map((item) => item.feelslike_c),
//               borderColor: "rgba(75, 192, 192, 1)",
//               backgroundColor: "rgba(75, 192, 192, 0.2)",
//               fill: true,
//             },
//           ]
//         : []),
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//       x: {
//         ticks: {
//           autoSkip: true,
//           maxTicksLimit: 10,
//         },
//       },
//       y: {
//         beginAtZero: false,
//       },
//     },
//     plugins: {
//       tooltip: {
//         callbacks: {
//           label: function (tooltipItem: TooltipItem<"line">) {
//             const datasetLabel = tooltipItem.dataset.label || "";
//             const value = tooltipItem.raw;
//             return `${datasetLabel}: ${value}`;
//           },
//         },
//       },
//     },
//   };

//   const humidityData = {
//     labels: hourlyData.map((item) => item.time),
//     datasets: [
//       {
//         label: "Humidity (%)",
//         data: hourlyData.map((item) => item.humidity),
//         backgroundColor: "rgba(54, 162, 235, 0.6)",
//         borderColor: "rgba(54, 162, 235, 1)",
//         borderWidth: 1,
//       },
//     ],
//   };

//   const UvData = {
//     labels: hourlyData.map((item) => item.time),
//     datasets: [
//       {
//         label: "UV Index",
//         data: hourlyData.map((item) => item.uv),
//         backgroundColor: "rgba(54, 162, 235, 0.6)",
//         borderColor: "rgba(54, 162, 235, 1)",
//         borderWidth: 1,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//       x: {
//         ticks: {
//           autoSkip: true,
//           maxTicksLimit: 10,
//         },
//       },
//       y: {
//         beginAtZero: true,
//       },
//     },
//   };

//   const scrollableChartOptions = {
//     ...chartOptions,
//     scales: {
//       ...chartOptions.scales,
//       x: {
//         ...chartOptions.scales.x,
//         ticks: {
//           autoSkip: false,
//         },
//       },
//     },
//   };

{
  /* <div className="flex justify-between my-4">
          <div className="text-xl font-bold font-title">Forecast Overview</div>
          <div className="flex justify-center items-center space-x-3">
            <Select onValueChange={(value) => setDay(Number(value))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Day" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger className="w-[180px] bg-blue-500 text-white rounded h-8">
                Select Filters
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                {[
                  "Temperature (°C)",
                  "Humidity (%)",
                  "UV Index",
                  "Wind Speed (kph)",
                  "Pressure (mb)",
                  "Precipitation (mm)",
                  "Feels Like (°C)",
                ].map((filter) => (
                  <DropdownMenuItem
                    key={filter}
                    onClick={() => handleFilterChange(filter)}
                  >
                    <Checkbox
                      checked={filters.includes(filter)}
                      onChange={() => handleFilterChange(filter)}
                      className="mr-2"
                    />
                    {filter}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-96 border border-gray-300 flex items-center justify-center">
            <Line data={filteredData} options={options} />
          </div>
          <div className="h-96 border border-gray-300 flex items-center justify-center">
            <Bar
              data={{
                labels: [
                  "PM2.5",
                  "PM10",
                  "NO2",
                  "CO",
                  "GB-Defra",
                  "O3",
                  "SO2",
                  "US-EPa",
                ],
                datasets: [
                  {
                    label: "Air Quality",
                    data: [
                      airQuality?.pm2_5 ?? 0,
                      airQuality?.pm10 ?? 0,
                      airQuality?.no2 ?? 0,
                      airQuality?.co ?? 0,
                      airQuality?.["gb-defra-index"] ?? 0,
                      airQuality?.o3 ?? 0,
                      airQuality?.so2 ?? 0,
                      airQuality?.["us-epa-index"] ?? 0,
                    ],
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                  },
                ],
              }}
              options={chartOptions}
            />
          </div>
          <div className="h-48 border border-gray-300 overflow-x-auto">
            <div className="text-center">Humidity</div>
            <div className="w-[1200px]">
              <Bar data={humidityData} options={scrollableChartOptions} />
            </div>
          </div>
          <div className="h-48 border border-gray-300 overflow-x-auto">
            <div className="text-center">UV Index</div>
            <div className="w-[1200px]">
              <Bar data={UvData} options={scrollableChartOptions} />
            </div>
          </div>
        </div> */
}

import React from "react";

const page = () => {
  return <div></div>;
};

export default page;
