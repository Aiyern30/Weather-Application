"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface LocationContextProps {
  location: string;
  setLocation: (location: string) => void;
}

const LocationContext = createContext<LocationContextProps | undefined>(
  undefined
);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  // State to store location
  const [location, setLocation] = useState<string>("Malaysia");

  // Effect to retrieve initial location from localStorage (only on client-side)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLocation = localStorage.getItem("location");
      if (storedLocation) {
        setLocation(storedLocation);
      }
    }
  }, []); // Empty dependency array ensures this runs once after the initial render

  // Effect to update localStorage whenever the location changes (only on client-side)
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("location", location);
    }
  }, [location]);

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
