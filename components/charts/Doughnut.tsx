"use client";

import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary Chart.js components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

interface DoughnutChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[]; // Color for each slice
      borderColor: string[]; // Border color for each slice
      borderWidth?: number;
    }[];
  };
  options?: Record<string, any>;
  width?: number;
  height?: number;
}

const DoughnutChart = ({
  data,
  options,
  width,
  height,
}: DoughnutChartProps) => {
  return (
    <Doughnut data={data} options={options} width={width} height={height} />
  );
};

export default DoughnutChart;
