"use client";

import { PrecipitationUnit } from "@/type/symbol";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface PrecipitationUnitProps {
  precipitation: string;
  setPrecipitation: (Precipitation: PrecipitationUnit) => void;
}

const PrecipitationContext = createContext<PrecipitationUnitProps | undefined>(
  undefined
);

export const PrecipitationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [precipitation, setPrecipitation] = useState<PrecipitationUnit>(
    PrecipitationUnit.INCH
  );
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
