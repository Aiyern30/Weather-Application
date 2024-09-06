import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet's CSS
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

interface MapProps {
  lat: number;
  lon: number;
}

const MapComponent = ({ lat, lon }: MapProps) => {
  useEffect(() => {
    // Initialize the map
    const map = L.map("map").setView([lat, lon], 13);

    // Add a tile layer from OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Add a marker at the coordinates
    const marker = L.marker([lat, lon]);
    marker.addTo(map);

    // Define the bounds
    const southWest = L.latLng(-89.98155760646617, -180);
    const northEast = L.latLng(89.99346179538875, 180);
    const bounds = L.latLngBounds(southWest, northEast);

    // Set max bounds
    map.setMaxBounds(bounds);

    // Prevent panning outside bounds
    map.on("drag", function () {
      map.panInsideBounds(bounds, { animate: false });
    });

    // Cleanup function to remove the map on unmount
    return () => {
      map.remove();
    };
  }, [lat, lon]);

  return (
    <div
      id="map"
      style={{
        height: "100vh",
        width: "100vw",
        position: "relative",
        zIndex: 0,
      }}
    ></div>
  );
};

export default MapComponent;
