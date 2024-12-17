"use client";

import { PrecipitationUnit } from "@/type/symbol";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface PrecipitationContextProps {
  precipitation: PrecipitationUnit;
  setPrecipitation: (precipitation: PrecipitationUnit) => void;
}

const PrecipitationContext = createContext<
  PrecipitationContextProps | undefined
>(undefined);

export const PrecipitationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // State to store precipitation
  const [precipitation, setPrecipitation] = useState<PrecipitationUnit>(
    PrecipitationUnit.INCH
  );

  // Effect to retrieve initial precipitation value from localStorage (only on client-side)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPrecipitation = localStorage.getItem("precipitation");
      if (storedPrecipitation) {
        setPrecipitation(storedPrecipitation as PrecipitationUnit);
      }
    }
  }, []); // Empty dependency array ensures this runs once after the initial render

  // Effect to update localStorage whenever the precipitation value changes (only on client-side)
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("precipitation", precipitation);
    }
  }, [precipitation]);

  return (
    <PrecipitationContext.Provider value={{ precipitation, setPrecipitation }}>
      {children}
    </PrecipitationContext.Provider>
  );
};

export const usePrecipitation = () => {
  const context = useContext(PrecipitationContext);
  if (!context) {
    throw new Error(
      "usePrecipitation must be used within a PrecipitationProvider"
    );
  }
  return context;
};
