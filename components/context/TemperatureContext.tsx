"use client";

import { Temperature } from "@/type/symbol";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface DegreeContextProps {
  degree: Temperature;
  setDegree: (degree: Temperature) => void;
}

const DegreeContext = createContext<DegreeContextProps | undefined>(undefined);

export const DegreeProvider = ({ children }: { children: ReactNode }) => {
  // State to hold degree value, defaulting to Temperature.DEGREE
  const [degree, setDegree] = useState<Temperature>(Temperature.DEGREE);

  // Effect to load the initial degree value from localStorage (only on client-side)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedDegree = localStorage.getItem("degree");
      if (storedDegree) {
        setDegree(storedDegree as Temperature); // Cast to Temperature type
      }
    }
  }, []); // Runs only once after the component mounts

  // Effect to update localStorage whenever the degree value changes (only on client-side)
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("degree", degree);
    }
  }, [degree]);

  return (
    <DegreeContext.Provider value={{ degree, setDegree }}>
      {children}
    </DegreeContext.Provider>
  );
};

export const useDegree = () => {
  const context = useContext(DegreeContext);
  if (!context) {
    throw new Error("useDegree must be used within a DegreeProvider");
  }
  return context;
};
