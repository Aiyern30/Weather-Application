import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { LocationProvider } from "@/components/context/locationContext";
import { DegreeProvider } from "@/components/context/TemperatureContext";
import { PressureProvider } from "@/components/context/PressureContext";
import { PrecipitationProvider } from "@/components/context/PrecipitationContext";
import { DistanceProvider } from "@/components/context/DistanceContext";
import { SpeedProvider } from "@/components/context/SpeedContext";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Toaster } from "@/components/ui";
import breezy_logo from "@/public/Breezy-Logo.png";

const inter = Inter({ subsets: ["latin"] });

export const generateMetadata = async (): Promise<Metadata> => {
  const websiteName = "Breezy Forecast";
  const name = "";

  return {
    title: `${websiteName}${name ? " | " + name : ""}`,
    description: "Developed by Ian Gan",
    icons: {
      icon: [{ url: breezy_logo.src, type: "image/jpg" }],
    },
  };
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex h-screen overflow-hidden dark:bg-[#1E1E1E] bg-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LocationProvider>
            <DegreeProvider>
              <PressureProvider>
                <PrecipitationProvider>
                  <DistanceProvider>
                    <SpeedProvider>
                      <Sidebar />
                      <div className="flex-1 overflow-auto">{children}</div>
                      <Toaster />
                    </SpeedProvider>
                  </DistanceProvider>
                </PrecipitationProvider>
              </PressureProvider>
            </DegreeProvider>
          </LocationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
