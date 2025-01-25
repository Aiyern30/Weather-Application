import React, { useRef, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";

interface LatLng {
  lat: number;
  lng: number;
}

const GoogleMaps = () => {
  const GoogleMapAPI = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

  if (!GoogleMapAPI) {
    throw new Error(
      "Google Maps API key is missing. Please set NEXT_PUBLIC_GOOGLE_MAPS_KEY in your environment variables."
    );
  }
  const libraries = ["places", "drawing", "geometry", "visualization"];

  const mapContainerStyle = {
    width: "100%",
    height: "700px",
  };
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [googleMaps, setGoogleMaps] = useState<typeof google.maps | null>(null);
  const [currentPosition, setCurrentPosition] = useState<LatLng | null>(null); // Allow null initially
  const [error, setError] = useState("");
  const [center, setCenter] = useState({
    lat: 4.196544207089243,
    lng: 102.23060571379374,
  });
  const [zoom, setZoom] = useState(8);
  const [isLoaded, setIsLoaded] = useState(false);

  const onLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    setGoogleMaps(google.maps);
    setIsLoaded(true);

    google.maps.event.addListener(map, "click", () => {
      resetView();

      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
    });
  };
  const onUnmount = () => {
    setIsLoaded(false);
    if (mapRef.current) {
      google.maps.event.clearListeners(mapRef.current, "click");
    }
  };

  const resetView = () => {
    setCenter({ lat: 4.196544207089243, lng: 102.23060571379374 });

    setZoom(8);
  };
  return (
    <div>
      <LoadScript googleMapsApiKey={GoogleMapAPI} libraries={libraries as any}>
        {/* {markersData.length > 0 ? ( */}
        <>
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
              styles: [
                {
                  featureType: "poi.business",
                  stylers: [{ visibility: "off" }],
                },
                {
                  featureType: "transit",
                  elementType: "labels.icon",
                  stylers: [{ visibility: "off" }],
                },
                {
                  featureType: "poi.attraction",
                  stylers: [{ visibility: "off" }],
                },
                {
                  featureType: "poi.medical",
                  stylers: [{ visibility: "off" }],
                },
                {
                  featureType: "poi.school",
                  stylers: [{ visibility: "off" }],
                },
                {
                  featureType: "poi.place_of_worship",
                  stylers: [{ visibility: "off" }],
                },
                {
                  featureType: "poi.sports_complex",
                  stylers: [{ visibility: "off" }],
                },
                {
                  featureType: "water",
                  elementType: "labels",
                  stylers: [{ visibility: "off" }],
                },
                {
                  featureType: "natural",
                  elementType: "labels",
                  stylers: [{ visibility: "off" }],
                },
                {
                  featureType: "administrative",
                  elementType: "labels.text",
                  stylers: [{ visibility: "on" }],
                },
              ],
            }}
          >
            {/* {filteredMarkers.map((marker) => ( */}
            {/* {markersData.map((marker) => (
                  <MarkerF
                    key={marker.id}
                    position={{
                      lat: Number(marker.latitude),
                      lng: Number(marker.longitude)
                    }}
                    onClick={() => handleMarkerClick(marker)}
                  />
                ))} */}
            {/* {currentPosition && window.google && (
                  <MarkerF
                    position={currentPosition}
                    icon={{
                      url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                      scaledSize: new window.google.maps.Size(40, 40)
                    }}
                  />
                )}
                {markersData.map((marker) => {
                  const customIcon = renderMarkerIcon(marker.type);

                  return (
                    <MarkerF
                      key={marker.id}
                      position={{
                        lat: Number(marker.latitude),
                        lng: Number(marker.longitude)
                      }}
                      icon={customIcon} // Apply the dynamically created icon
                      onClick={() => handleMarkerClick(marker)}
                    />
                  );
                })} */}
          </GoogleMap>
        </>
      </LoadScript>
    </div>
  );
};

export default GoogleMaps;
