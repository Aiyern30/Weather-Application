import React from "react";
import { generatePageMetadata } from "@/utils/metadata";

// #region testing

export const metadata = generatePageMetadata("Maps", "");

const MapsLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default MapsLayout;
