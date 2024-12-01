"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

// Register necessary Chart.js components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  headers: string[];
  datasets: string[];
}

const BarChart = ({
  data,
}: {
  data: { time: string; feelslike_c: number }[];
}) => {
  const chartData = {
    labels: data.map((item) => item.time),
    datasets: [
      {
        label: "Feels Like Temperature (°C)",
        data: data.map((item) => item.feelslike_c),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: { title: { display: true, text: "Time" } },
      y: { title: { display: true, text: "Feels Like (°C)" } },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChart;
