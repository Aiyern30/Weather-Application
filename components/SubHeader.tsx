import { chartTypes } from "@/type/chartTypes";
import {
  Temperature,
  SpeedUnit,
  DistanceUnit,
  PressureUnit,
  PrecipitationUnit,
} from "@/type/symbol";
import { useDistance } from "./context/DistanceContext";
import { usePrecipitation } from "./context/PrecipitationContext";
import { usePressure } from "./context/PressureContext";
import { useSpeed } from "./context/SpeedContext";
import { useDegree } from "./context/TemperatureContext";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui";
import React from "react";
import { SelectButton } from "primereact/selectbutton";

interface SubHeaderProps {
  setChartType: React.Dispatch<React.SetStateAction<chartTypes>>;
  chartType: chartTypes;
}

const SubHeader = ({ chartType, setChartType }: SubHeaderProps) => {
  const chartTypes: chartTypes[] = ["AREA", "BAR", "LINE"];
  const { degree, setDegree } = useDegree();
  const { speed, setSpeed } = useSpeed();
  const { pressure, setPressure } = usePressure();
  const { precipitation, setPrecipitation } = usePrecipitation();
  const { distance, setDistance } = useDistance();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1 m-3 max-w-5xl mx-auto">
      <div className="flex flex-col items-center justify-center ">
        <div className="text-sm font-semibold dark:text-white mb-2">Degree</div>
        <SelectButton
          value={degree}
          onChange={(e) => setDegree(e.value)}
          options={[
            { label: "°C", value: Temperature.DEGREE },
            { label: "°F", value: Temperature.FAHRENHEIT },
          ]}
          className="mb-2 sm:mb-0 custom-select-button"
        />
      </div>

      <div className="flex flex-col items-center justify-center ">
        <div className="text-sm font-semibold dark:text-white mb-2">Speed</div>
        <SelectButton
          value={speed}
          onChange={(e) => setSpeed(e.value)}
          options={[
            { label: "MPH", value: SpeedUnit.MPH },
            { label: "KPH", value: SpeedUnit.KPH },
          ]}
          className="mb-2 sm:mb-0 custom-select-button"
        />
      </div>

      <div className="flex flex-col items-center justify-center ">
        <div className="text-sm font-semibold dark:text-white mb-2">
          Distance
        </div>
        <SelectButton
          value={distance}
          onChange={(e) => setDistance(e.value)}
          options={[
            { label: "KM", value: DistanceUnit.KM },
            { label: "MILES", value: DistanceUnit.MILES },
          ]}
          className="mb-2 sm:mb-0 custom-select-button"
        />
      </div>

      <div className="flex flex-col items-center justify-center ">
        <div className="text-sm font-semibold dark:text-white mb-2">
          Pressure
        </div>
        <SelectButton
          value={pressure}
          onChange={(e) => setPressure(e.value)}
          options={[
            { label: "INCH", value: PressureUnit.INCH },
            { label: "MB", value: PressureUnit.MB },
          ]}
          className="mb-2 sm:mb-0 custom-select-button"
        />
      </div>

      <div className="flex flex-col items-center justify-center ">
        <div className="text-sm font-semibold dark:text-white mb-2">
          Precipitation
        </div>
        <SelectButton
          value={precipitation}
          onChange={(e) => setPrecipitation(e.value)}
          options={[
            { label: "INCH", value: PrecipitationUnit.INCH },
            { label: "MM", value: PrecipitationUnit.MM },
          ]}
          className="mb-2 sm:mb-0 custom-select-button"
        />
      </div>

      <div className="flex flex-col items-center justify-center ">
        <div className="text-sm font-semibold dark:text-white mb-2">
          Chart Type
        </div>
        <Select
          value={chartType}
          onValueChange={(value: chartTypes) => setChartType(value)}
        >
          <SelectTrigger className="w-full sm:w-[180px] custom-select-button">
            <SelectValue placeholder="Chart Type" />
          </SelectTrigger>
          <SelectContent>
            {chartTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SubHeader;
