import { cn } from "@/lib/utils";
import ChartRenderer from "./charts/ChartRenderer";
import { chartTypes } from "@/type/chartTypes";

interface ChartCardProps {
  title: string;
  chartType: chartTypes;
  data: any;
  options: any;
}

export const ChartCard = ({
  title,
  chartType,
  data,
  options,
}: ChartCardProps) => (
  <div className={cn("bg-white dark:bg-[#4A4A4A] p-4 shadow rounded")}>
    <div className="text-center mb-4">{title}</div>
    <div className="h-[300px]">
      <ChartRenderer chartType={chartType} data={data} options={options} />
    </div>
  </div>
);
