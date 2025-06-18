import React, { useEffect, useRef } from "react";

interface MapSelectorProps {
  position: { lat: number; lng: number };
  onPositionChange: (coords: { lat: number; lng: number }) => void;
}

const MapSelector: React.FC<MapSelectorProps> = ({ position, onPositionChange }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || mapInstance.current) return;

      // Crear el mapa con Map ID
      mapInstance.current = new google.maps.Map(mapRef.current, {
        center: position,
        zoom: 15,
        mapId: "c68902a36f9275dc3029c397", // 👈 Reemplaza con tu Map ID real
      });

      // Crear marcador avanzado
      markerRef.current = new google.maps.marker.AdvancedMarkerElement({
        map: mapInstance.current,
        position,
      });

      // Listener para mover el marcador al hacer clic
      mapInstance.current.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
          if (markerRef.current) markerRef.current.position = newPos;
          mapInstance.current?.panTo(newPos);
          onPositionChange(newPos);
        }
      });
    };

    // Verificar si ya está cargada la API con "marker"
    const isLoaded =
      window.google &&
      window.google.maps &&
      window.google.maps.marker &&
      window.google.maps.marker.AdvancedMarkerElement;

    if (!isLoaded) {
      const script = document.createElement("script");
      script.src =
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyD4qaM-eBil9gRgpV-oERJNFeQiqlphXbY&libraries=marker";
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
