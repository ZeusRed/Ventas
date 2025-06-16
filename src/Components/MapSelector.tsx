// components/MapSelector.tsx
import React, { useEffect, useRef } from "react";

interface MapSelectorProps {
  position: { lat: number; lng: number };
  onPositionChange: (coords: { lat: number; lng: number }) => void;
}

const MapSelector: React.FC<MapSelectorProps> = ({ position, onPositionChange }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || mapInstance.current) return;

      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: position,
        zoom: 15,
      });

      markerRef.current = new google.maps.Marker({
        position,
        map: mapInstance.current,
      });

      mapInstance.current.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
          markerRef.current?.setPosition(newPos);
          mapInstance.current?.panTo(newPos);
          onPositionChange(newPos);
        }
      });
    };

    if (!window.google) {
      const script = document.createElement("script");
      script.src =
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyD4qaM-eBil9gRgpV-oERJNFeQiqlphXbY";
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.body.appendChild(script);
    } else {
      initMap();
    }
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: 300, border: "1px solid #ccc" }} />;
};

export default MapSelector;
