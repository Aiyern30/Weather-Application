"use client";

import {
  Chart as ChartJS,
  Filler,
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register necessary Chart.js components along with Filler plugin
ChartJS.register(
  Filler, // Add this to register the Filler plugin
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

interface AreaChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string;
      borderColor?: string;
      borderWidth?: number;
      fill?: boolean; // Make sure the fill option is true for area effect
    }[];
  };
  options?: Record<string, any>;
  width?: number;
  height?: number;
}

const AreaChart = ({ data, options, width, height }: AreaChartProps) => {
  return <Line data={data} options={options} width={width} height={height} />;
};

export default AreaChart;
