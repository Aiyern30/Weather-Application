"use client";

import { DistanceUnit } from "@/type/symbol";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface DistanceContextProps {
  distance: DistanceUnit;
  setDistance: (distance: DistanceUnit) => void;
}

const DistanceContext = createContext<DistanceContextProps | undefined>(
  undefined
);

export const DistanceProvider = ({ children }: { children: ReactNode }) => {
  // State to store distance
  const [distance, setDistance] = useState<DistanceUnit>(DistanceUnit.KM);

  // Effect to retrieve initial distance from localStorage (only on client-side)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedDistance = localStorage.getItem("distance") as DistanceUnit;
      if (storedDistance) {
        setDistance(storedDistance);
      }
    }
  }, []); // Empty dependency array ensures this runs once after the initial render

  // Effect to update localStorage whenever the distance changes (only on client-side)
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("distance", distance);
    }
  }, [distance]);

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
