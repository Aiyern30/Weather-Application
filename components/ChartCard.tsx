import ChartRenderer from "./charts/ChartRenderer";
import { chartTypes } from "@/type/chartTypes";
import { Card, CardContent, CardHeader, CardTitle } from "./ui";

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
  <Card className="dark:bg-[#4A4A4A]">
    <CardHeader>
      <CardTitle className="text-center">{title}</CardTitle>
    </CardHeader>
    <CardContent className="h-[300px]">
      <ChartRenderer chartType={chartType} data={data} options={options} />
    </CardContent>
  </Card>
);
