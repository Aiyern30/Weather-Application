import React from "react";
import { generatePageMetadata } from "@/utils/metadata";

// #region testing

export const metadata = generatePageMetadata("Statistics", "");

const StatisticsLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default StatisticsLayout;
