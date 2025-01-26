import React, { useState, useEffect } from "react";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import { useLoadScript } from "@react-google-maps/api"; // No need to import Library type

interface GoogleMapsProps {
  lat: number;
  lon: number;
}

const libraries: string[] = ["places", "drawing", "geometry", "visualization"]; // Use string[] instead of Library[]

const GoogleMaps: React.FC<GoogleMapsProps> = ({ lat, lon }) => {
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

  const [center, setCenter] = useState({ lat, lng: lon });
  const [zoom, setZoom] = useState(8);
  const [mapKey, setMapKey] = useState(Date.now());

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GoogleMapAPI,
    // libraries, // Use string[] for libraries
  });

  useEffect(() => {
    setCenter({ lat, lng: lon });
    setMapKey(Date.now()); // Force map refresh when lat or lon changes
  }, [lat, lon]);

  const onMapUnmount = () => {
    setCenter({ lat, lng: lon }); // Ensure the map center is updated when it is unmounted
  };

  const handleRefresh = () => {
    setMapKey(Date.now()); // Change the key to force a re-mount
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
      key={mapKey} // Changing the key forces a re-mount
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={zoom}
      onUnmount={onMapUnmount}
      options={{
        streetViewControl: false,
        disableDefaultUI: false,
        mapTypeId: "roadmap",
      }}
    >
      <MarkerF position={center} />
    </GoogleMap>
  );
};

export default GoogleMaps;
