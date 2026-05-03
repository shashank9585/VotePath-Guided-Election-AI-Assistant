/**
 * Haversine formula to calculate distance between two coordinates in km
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

// City coordinates lookup
const CITY_COORDS = {
  bangalore: { lat: 12.9716, lon: 77.5946 },
  mysore: { lat: 12.2958, lon: 76.6394 },
  mumbai: { lat: 19.076, lon: 72.8777 },
  delhi: { lat: 28.6139, lon: 77.209 },
  hyderabad: { lat: 17.385, lon: 78.4867 },
  chennai: { lat: 13.0827, lon: 80.2707 },
  pune: { lat: 18.5204, lon: 73.8567 },
  kolkata: { lat: 22.5726, lon: 88.3639 },
};

export function getCityDistance(city1, city2) {
  const c1 = CITY_COORDS[city1.toLowerCase()];
  const c2 = CITY_COORDS[city2.toLowerCase()];
  if (!c1 || !c2) return null;
  return calculateDistance(c1.lat, c1.lon, c2.lat, c2.lon);
}

export function getCityCoords(city) {
  return CITY_COORDS[city.toLowerCase()] || null;
}
