import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";

interface GoogleMapsProps {
  lat: number;
  lon: number;
}

const libraries: string[] = ["places", "drawing", "geometry", "visualization"];

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
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [mapKey, setMapKey] = useState(Date.now());

  useEffect(() => {
    setCenter({ lat, lng: lon });
    setMapKey(Date.now()); // Force map refresh when lat or lon changes
  }, [lat, lon]);

  const onLoad = (map: google.maps.Map) => {
    setLoading(false); // Set loading to false when the map has fully loaded
  };

  const onError = () => {
    setLoadError(true); // Set loadError to true if the map fails to load
    setLoading(false);
  };

  const onMapUnmount = () => {
    setLoading(true);
    setLoadError(false);
  };

  const handleRefresh = () => {
    setMapKey(Date.now()); // Change the key to force a re-mount
    setLoading(true); // Set loading to true again
  };

  return (
    <div>
      {(loading || loadError) && (
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
          {loadError ? (
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
          ) : (
            <div>Loading Google Maps...</div>
          )}
        </div>
      )}

      <LoadScript
        googleMapsApiKey={GoogleMapAPI}
        libraries={libraries as any}
        onLoad={() => setLoading(false)} // Set loading to false when script is loaded
        onError={onError} // Handle script load errors
      >
        <GoogleMap
          key={mapKey} // Changing the key forces a re-mount
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={zoom}
          onLoad={onLoad}
          onUnmount={onMapUnmount}
          options={{
            streetViewControl: false,
            disableDefaultUI: false,
            mapTypeId: "roadmap",
          }}
        >
          <MarkerF position={center} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default GoogleMaps;
