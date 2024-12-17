"use client";

import { Temperature } from "@/type/symbol";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface DegreeContextProps {
  degree: string;
  setDegree: (degree: Temperature) => void;
}

const DegreeContext = createContext<DegreeContextProps | undefined>(undefined);

export const DegreeProvider = ({ children }: { children: ReactNode }) => {
  const [degree, setDegree] = useState<Temperature>(Temperature.DEGREE);
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
