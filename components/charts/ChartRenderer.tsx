import { chartTypes } from "@/type/chartTypes";
import React from "react";
import BarChart from "./Bar";
import LineChart from "./Line";
import AreaChart from "./Area";
import DoughnutChart from "./Doughnut";

interface chartRenderProps {
  chartType: chartTypes;
  data: any;
  options: any;
}

const ChartRenderer: React.FC<chartRenderProps> = ({
  chartType,
  data,
  options,
}) => {
  const chartMap: { [key: string]: React.ReactNode } = {
    BAR: <BarChart data={data} options={options} />,
    LINE: <LineChart data={data} options={options} />,
    AREA: <AreaChart data={data} options={options} />,
    DOUGHNUT: <DoughnutChart data={data} options={options} />,
  };

  return chartMap[chartType] || <BarChart data={data} options={options} />;
};

export default ChartRenderer;
