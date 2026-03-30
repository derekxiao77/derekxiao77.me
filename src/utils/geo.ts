export function haversineDistance(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h = sinLat * sinLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function totalRouteDistance(route: { lat: number; lng: number }[]): number {
  let total = 0;
  for (let i = 1; i < route.length; i++) {
    total += haversineDistance(route[i - 1], route[i]);
  }
  return total;
}
