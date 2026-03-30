import { MapContainer, TileLayer, Polyline, CircleMarker, useMap } from 'react-leaflet';
import { useEffect } from 'react';

interface Props {
  route: { lat: number; lng: number }[];
  eventPins: { lat: number; lng: number; type: string }[];
  currentPosition: { lat: number; lng: number } | null;
}

function MapUpdater({ center }: { center: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], map.getZoom(), { animate: true });
    }
  }, [center, map]);
  return null;
}

const pinColors: Record<string, string> = {
  pee: '#3b82f6',
  poop: '#b45309',
  accident: '#ef4444',
};

export function WalkMap({ route, eventPins, currentPosition }: Props) {
  const center = currentPosition || (route.length > 0 ? route[route.length - 1] : null);

  if (!center) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
        Waiting for GPS...
      </div>
    );
  }

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={17}
      className="w-full h-full"
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapUpdater center={currentPosition} />
      {route.length > 1 && (
        <Polyline
          positions={route.map(p => [p.lat, p.lng])}
          color="#6366f1"
          weight={4}
          opacity={0.8}
        />
      )}
      {eventPins.map((pin, i) => (
        <CircleMarker
          key={i}
          center={[pin.lat, pin.lng]}
          radius={8}
          fillColor={pinColors[pin.type] || '#6b7280'}
          fillOpacity={1}
          color="white"
          weight={2}
        />
      ))}
      {currentPosition && (
        <CircleMarker
          center={[currentPosition.lat, currentPosition.lng]}
          radius={6}
          fillColor="#6366f1"
          fillOpacity={1}
          color="white"
          weight={3}
        />
      )}
    </MapContainer>
  );
}
