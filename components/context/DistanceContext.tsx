"use client";

import { DistanceUnit } from "@/type/symbol";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface DistanceContextProps {
  distance: string;
  setDistance: (Distance: DistanceUnit) => void;
}

const DistanceContext = createContext<DistanceContextProps | undefined>(
  undefined
);

export const DistanceProvider = ({ children }: { children: ReactNode }) => {
  const [distance, setDistance] = useState<DistanceUnit>(DistanceUnit.KM);
  return (
    <DistanceContext.Provider value={{ distance, setDistance }}>
      {children}
    </DistanceContext.Provider>
  );
};

export const useDistance = () => {
  const context = useContext(DistanceContext);
  if (!context) {
    throw new Error("useDistance must be used within a DistanceProvider");
  }
  return context;
};
