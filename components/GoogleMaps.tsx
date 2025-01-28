import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import { useLoadScript } from "@react-google-maps/api";
import { GoogleMapMarker } from "@/type/googleMap";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface GoogleMapsProps {
  lat: number;
  lon: number;
  mapStyle: google.maps.MapTypeStyle[];
}

const GoogleMaps: React.FC<GoogleMapsProps> = ({ lat, lon, mapStyle }) => {
  const GoogleMapAPI = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

  if (!GoogleMapAPI) {
    throw new Error(
      "Google Maps API key is missing. Please set NEXT_PUBLIC_GOOGLE_MAPS_KEY in your environment variables."
    );
  }

  const mapContainerStyle = {
    width: "100%",
    height: "100vh",
  };
  const router = useRouter();
  const { toast } = useToast();

  const [center, setCenter] = useState({ lat, lng: lon });
  const [zoom, setZoom] = useState(8);
  const [mapKey, setMapKey] = useState(Date.now());
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GoogleMapAPI,
    libraries: ["places", "drawing", "geometry", "visualization"],
  });

  useEffect(() => {
    setCenter({ lat, lng: lon });
    setMapKey(Date.now());
  }, [lat, lon]);

  const onMapUnmount = () => {
    setCenter({ lat, lng: lon });
  };

  const handleRefresh = () => {
    setMapKey(Date.now());
  };

  const handleMarkerClick = (marker: GoogleMapMarker) => {
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }

    // Safely access marker.link properties
    const linkHref = marker.link?.href || "#";
    const linkLabel = marker.link?.label || "";

    // The contentString now contains inline styles for the buttons
    const contentString = `
  <div style="max-width: 300px; padding: 10px;" id="google-maps">
    <div style="font-size: 18px; font-weight: bold; color: #333; margin-bottom: 8px;">${marker.label}</div>
    <div style="font-size: 14px; color: #555; margin-bottom: 8px;">${marker.description}</div>
    <button
      id="navigate-link"
      style="background: none; border: none; cursor: pointer; font-size: 14px; color: blue; text-decoration: underline; margin-top: 8px;"
    >
      ${linkLabel}
    </button>
    <div style="margin-top: 12px;">
      <button
        id="open-in-google-maps"
        style="width: 100%; padding: 8px; font-size: 14px; background-color: #F99D22; color: white; border: none; border-radius: 4px; cursor: pointer; margin-bottom: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
      >
        Open in Google Maps
      </button>
      <button
        id="copy-coordinates"
        style="width: 100%; padding: 8px; font-size: 14px; background-color: #F99D22; color: white; border: none; border-radius: 4px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
      >
        Copy Coordinates
      </button>
    </div>
  </div>
`;

    // Set the marker position
    const position = {
      lat: Number(marker.latitude),
      lng: Number(marker.longitude),
    };

    setCenter(position);
    setZoom(marker.focusLevel || 8);

    if (mapRef.current) {
      const infoWindow = new google.maps.InfoWindow({
        content: contentString,
      });

      infoWindow.addListener("closeclick", () => {
        resetView();
      });

      infoWindow.open(mapRef.current);
      infoWindow.setPosition(position);

      // Save reference to the InfoWindow
      infoWindowRef.current = infoWindow;
    }

    // Add event listeners to the InfoWindow content
    setTimeout(() => {
      const navigateLink = document.getElementById("navigate-link");
      const openInGoogleMaps = document.getElementById("open-in-google-maps");
      const copyCoordinates = document.getElementById("copy-coordinates");

      // Event listener for "Navigate Link"
      if (navigateLink) {
        navigateLink.addEventListener("click", () => router.push(linkHref));
      }

      // Event listener for "Open in Google Maps"
      if (openInGoogleMaps) {
        openInGoogleMaps.addEventListener("click", () => {
          const googleMapsUrl = `https://www.google.com/maps?q=${marker.latitude},${marker.longitude}`;
          window.open(googleMapsUrl, "_blank");
        });
      }

      // Event listener for "Copy Coordinates"
      if (copyCoordinates) {
        copyCoordinates.addEventListener("click", () => {
          navigator.clipboard
            .writeText(`${marker.latitude}, ${marker.longitude}`)
            .then(() => {
              toast({
                variant: "default",
                title: "Copy Coordinates",
                description: "Coordinates copied to clipboard.",
              });
            })
            .catch(() => {
              toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
              });
            });
        });
      }
    }, 0);
  };

  const resetView = () => {
    setCenter({ lat: 4.196544207089243, lng: 102.23060571379374 });

    setZoom(8);
  };

  if (loadError) {
    return (
      <div>
        Failed to load Google Maps.{" "}
        <button
          onClick={handleRefresh}
          style={{
            marginTop: "10px",
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Click to Refresh
        </button>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className="loading-overlay"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: "20px",
          borderRadius: "8px",
          color: "#fff",
          fontSize: "16px",
        }}
      >
        Loading Google Maps...
      </div>
    );
  }

  return (
    <GoogleMap
      key={mapKey}
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={zoom}
      onUnmount={onMapUnmount}
      options={{
        streetViewControl: false,
        disableDefaultUI: false,
        mapTypeId: "roadmap",
        styles: mapStyle,
      }}
    >
      <MarkerF position={center} />
    </GoogleMap>
  );
};

export default GoogleMaps;
