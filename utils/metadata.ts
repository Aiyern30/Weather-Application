import { Metadata } from "next";

// utils/metadata.ts
const iconUrl = "/Breezy-logo.jpg";

export const generatePageMetadata = (
  title: string,
  description: string
): Metadata => {
  return {
    title: `Breezy Forecast | ${title}`,
    description: description,
    icons: {
      icon: [{ url: iconUrl, type: "image/jpeg" }],
    },
  };
};
