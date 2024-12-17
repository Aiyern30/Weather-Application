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
import React, { useState } from "react";

const SubHeader = () => {
  const [chartType, setChartType] = useState<chartTypes>("BAR");
  const chartTypes: chartTypes[] = [
    "AREA",
    "BAR",
    "BUBBLE",
    "DOUGHNUT",
    "LINE",
    "POLAR",
    "RADAR",
  ];

  const { degree, setDegree } = useDegree();
  const { speed, setSpeed } = useSpeed();
  const { pressure, setPressure } = usePressure();
  const { precipitation, setPrecipitation } = usePrecipitation();
  const { distance, setDistance } = useDistance();
  return (
    <div className="flex justify-end items-center m-3">
      <Button
        variant="outline"
        onClick={() => {
          degree === Temperature.DEGREE
            ? setDegree(Temperature.FAHRENHEIT)
            : setDegree(Temperature.DEGREE);
        }}
      >
        {degree}
      </Button>

      <Button
        variant="outline"
        onClick={() => {
          speed === SpeedUnit.MPH
            ? setSpeed(SpeedUnit.KPH)
            : setSpeed(SpeedUnit.MPH);
        }}
      >
        {speed}
      </Button>

      <Button
        variant="outline"
        onClick={() => {
          distance === DistanceUnit.KM
            ? setDistance(DistanceUnit.MILES)
            : setDistance(DistanceUnit.KM);
        }}
      >
        {distance}
      </Button>

      <Button
        variant="outline"
        onClick={() => {
          pressure === PressureUnit.INCH
            ? setPressure(PressureUnit.MB)
            : setPressure(PressureUnit.INCH);
        }}
      >
        {pressure}
      </Button>

      <Button
        variant="outline"
        onClick={() => {
          precipitation === PrecipitationUnit.INCH
            ? setPrecipitation(PrecipitationUnit.MM)
            : setPrecipitation(PrecipitationUnit.INCH);
        }}
      >
        {precipitation}
      </Button>

      <Select
        value={chartType}
        onValueChange={(value: chartTypes) => {
          setChartType(value);
        }}
      >
        <SelectTrigger className="w-[180px]">
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
  );
};

export default SubHeader;
