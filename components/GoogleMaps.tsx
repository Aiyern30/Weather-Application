import React, { useRef, useState, useEffect } from "react";
import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";

interface GoogleMapsProps {
  lat: number;
  lon: number;
}

const GoogleMaps: React.FC<GoogleMapsProps> = ({ lat, lon }) => {
  const GoogleMapAPI = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

  if (!GoogleMapAPI) {
    throw new Error(
      "Google Maps API key is missing. Please set NEXT_PUBLIC_GOOGLE_MAPS_KEY in your environment variables."
    );
  }

  const libraries = ["places", "drawing", "geometry", "visualization"];

  const mapContainerStyle = {
    width: "100%",
    height: "100vh",
  };

  const [center, setCenter] = useState({ lat, lng: lon });
  const [zoom, setZoom] = useState(8);

  useEffect(() => {
    // Update map center when coordinates change
    setCenter({ lat, lng: lon });
  }, [lat, lon]);

  const onLoad = (map: google.maps.Map) => {
    // Optionally handle map load events
  };

  const onUnmount = () => {
    // Optionally handle map unmount events
  };

  return (
    <div>
      <LoadScript googleMapsApiKey={GoogleMapAPI} libraries={libraries as any}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={zoom}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            streetViewControl: false,
            disableDefaultUI: false,
            mapTypeId: "roadmap",
          }}
        >
          {/* Add a marker at the center */}
          <MarkerF position={center} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default GoogleMaps;
