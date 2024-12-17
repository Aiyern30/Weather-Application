"use client";

import { SpeedUnit } from "@/type/symbol";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface SpeedContextProps {
  speed: string;
  setSpeed: (Speed: SpeedUnit) => void;
}

const SpeedContext = createContext<SpeedContextProps | undefined>(undefined);

export const SpeedProvider = ({ children }: { children: ReactNode }) => {
  const [speed, setSpeed] = useState<SpeedUnit>(SpeedUnit.MPH);
  return (
    <SpeedContext.Provider value={{ speed, setSpeed }}>
      {children}
    </SpeedContext.Provider>
  );
};

export const useSpeed = () => {
  const context = useContext(SpeedContext);
  if (!context) {
    throw new Error("useSpeed must be used within a SpeedProvider");
  }
  return context;
};
