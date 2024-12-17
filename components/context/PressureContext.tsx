"use client";

import { PressureUnit } from "@/type/symbol";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface PressureContextProps {
  pressure: PressureUnit;
  setPressure: (pressure: PressureUnit) => void;
}

const PressureContext = createContext<PressureContextProps | undefined>(
  undefined
);

export const PressureProvider = ({ children }: { children: ReactNode }) => {
  // State to store pressure value
  const [pressure, setPressure] = useState<PressureUnit>(PressureUnit.INCH);

  // Effect to retrieve initial pressure value from localStorage (only on client-side)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPressure = localStorage.getItem("pressure");
      if (storedPressure) {
        setPressure(storedPressure as PressureUnit);
      }
    }
  }, []); // This will run only once, after the component mounts

  // Effect to update localStorage whenever the pressure value changes (only on client-side)
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pressure", pressure);
    }
  }, [pressure]);

  return (
    <PressureContext.Provider value={{ pressure, setPressure }}>
      {children}
    </PressureContext.Provider>
  );
};

export const usePressure = () => {
  const context = useContext(PressureContext);
  if (!context) {
    throw new Error("usePressure must be used within a PressureProvider");
  }
  return context;
};
