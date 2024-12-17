"use client";

import { SpeedUnit } from "@/type/symbol";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface SpeedContextProps {
  speed: SpeedUnit;
  setSpeed: (speed: SpeedUnit) => void;
}

const SpeedContext = createContext<SpeedContextProps | undefined>(undefined);

export const SpeedProvider = ({ children }: { children: ReactNode }) => {
  // State to hold speed value, defaulting to SpeedUnit.MPH
  const [speed, setSpeed] = useState<SpeedUnit>(SpeedUnit.MPH);

  // Effect to load the initial speed value from localStorage (only on client-side)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSpeed = localStorage.getItem("speed");
      if (storedSpeed) {
        setSpeed(storedSpeed as SpeedUnit); // Cast to SpeedUnit type
      }
    }
  }, []); // Runs only once, after the component mounts

  // Effect to update localStorage whenever the speed value changes (only on client-side)
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("speed", speed);
    }
  }, [speed]);

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
