"use client";

import { PressureUnit } from "@/type/symbol";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface PressureContextProps {
  pressure: string;
  setPressure: (pressure: PressureUnit) => void;
}

const PressureContext = createContext<PressureContextProps | undefined>(
  undefined
);

export const PressureProvider = ({ children }: { children: ReactNode }) => {
  const [pressure, setPressure] = useState<PressureUnit>(PressureUnit.INCH);
  return (
    <PressureContext.Provider value={{ pressure, setPressure }}>
      {children}
    </PressureContext.Provider>
  );
};

export const usePressure = () => {
  const context = useContext(PressureContext);
  if (!context) {
    throw new Error("usePressure must be used within a pressureProvider");
  }
  return context;
};
