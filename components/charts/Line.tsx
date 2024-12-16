"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary Chart.js components
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor?: string;
      backgroundColor?: string;
      tension?: number; // For smooth lines
      borderWidth?: number;
      pointStyle?: string; // For point styling (e.g., "circle", "rect")
      pointRadius?: number; // For size of points
    }[];
  };
  options?: Record<string, any>;
  width?: number;
  height?: number;
}

const LineChart = ({ data, options, width, height }: LineChartProps) => {
  return <Line data={data} options={options} width={width} height={height} />;
};

export default LineChart;
