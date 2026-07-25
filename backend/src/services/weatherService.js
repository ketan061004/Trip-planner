// Weather via Open-Meteo (free, no API key).
// Geocoding: https://open-meteo.com/en/docs/geocoding-api
// Forecast:  https://open-meteo.com/en/docs

const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

const WMO = {
  0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Fog", 48: "Rime fog", 51: "Light drizzle", 53: "Drizzle", 55: "Dense drizzle",
  61: "Light rain", 63: "Rain", 65: "Heavy rain", 71: "Light snow", 73: "Snow",
  75: "Heavy snow", 80: "Rain showers", 81: "Rain showers", 82: "Violent showers",
  95: "Thunderstorm", 96: "Thunderstorm w/ hail", 99: "Severe thunderstorm",
};

/**
 * Search places by name for autocomplete — states, cities, landmarks,
 * attractions. Primary source: Photon (komoot, OSM-based, free, no key),
 * which understands states ("Rajasthan"), landmarks ("Taj Mahal"), and
 * regions ("Rann of Kutch") that Open-Meteo's city-only geocoder misses.
 * Falls back to Open-Meteo if Photon is unreachable.
 * @param {string} name
 * @param {number} count
 */
export async function searchPlaces(name, count = 5) {
  const q = (name || "").trim();
  if (!q) return [];

  try {
    return await searchPhoton(q, count);
  } catch (err) {
    console.warn(`[geo] Photon failed (${err.message}), falling back to Open-Meteo`);
    return searchOpenMeteo(q, count);
  }
}

// Human-friendly labels for OSM place types we care about.
const OSM_TYPE_LABEL = {
  state: "State", region: "Region", province: "Province",
  city: "City", town: "Town", village: "Village", suburb: "Area",
  island: "Island", beach: "Beach", attraction: "Attraction",
  viewpoint: "Viewpoint", monument: "Monument", memorial: "Monument",
  castle: "Fort/Palace", fort: "Fort", palace: "Palace", ruins: "Heritage",
  archaeological_site: "Heritage", museum: "Museum", theme_park: "Theme park",
  zoo: "Zoo", national_park: "National park", nature_reserve: "Nature",
  wetland: "Nature", peak: "Mountain", volcano: "Mountain",
  waterfall: "Waterfall", lake: "Lake", reservoir: "Lake", bay: "Bay",
  temple: "Temple", place_of_worship: "Temple", county: "District",
  district: "District", municipality: "City", hamlet: "Village",
};

// OSM values that are never travel destinations — filtered out.
const OSM_SKIP = new Set([
  "restaurant", "fast_food", "cafe", "bar", "pub", "hotel", "hostel",
  "guest_house", "supermarket", "bus_station", "bus_stop", "station",
  "halt", "platform", "company", "office", "shop", "clothes",
  "hairdresser", "doctors", "pharmacy", "school", "kindergarten",
  "house", "residential", "apartments", "detached", "yes",
  "government", "townhall", "courthouse", "police", "fire_station",
  "bank", "atm", "fuel", "parking", "college", "university", "hospital",
]);

async function searchPhoton(q, count) {
  // Over-fetch so we still have `count` results after filtering noise.
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=${count * 3}&lang=en`;
  const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
  if (!res.ok) throw new Error(`Photon ${res.status}`);
  const data = await res.json();

  const seen = new Set();
  const results = [];
  for (const f of data.features || []) {
    const p = f.properties || {};
    const [lon, lat] = f.geometry?.coordinates || [];
    if (lat == null || lon == null || !p.name) continue;
    if (OSM_SKIP.has(p.osm_value)) continue;
    // Photon marks POIs and buildings alike as layer "house"/"street".
    // Keep them only when the OSM value is a known travel type
    // (attraction, monument, temple, ...), drop generic buildings.
    if ((p.type === "house" || p.type === "street") && !OSM_TYPE_LABEL[p.osm_value]) continue;

    const type = OSM_TYPE_LABEL[p.osm_value] || OSM_TYPE_LABEL[p.type] || (p.type === "other" ? "" : capitalize(p.type));
    const label = [p.name, p.state && p.state !== p.name ? p.state : "", p.country]
      .filter(Boolean)
      .join(", ");

    const key = label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    results.push({
      name: p.name,
      country: p.country || "",
      admin1: p.state || "",
      lat,
      lon,
      label,
      type: type || "",
    });
    if (results.length >= count) break;
  }
  if (!results.length) throw new Error("no usable results");
  return results;
}

async function searchOpenMeteo(q, count) {
  const url = `${GEO_URL}?name=${encodeURIComponent(q)}&count=${count}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding failed (${res.status})`);
  const data = await res.json();
  return (data.results || []).map((hit) => ({
    name: hit.name,
    country: hit.country,
    admin1: hit.admin1 || "",
    lat: hit.latitude,
    lon: hit.longitude,
    label: [hit.name, hit.admin1, hit.country].filter(Boolean).join(", "),
    type: "",
  }));
}

function capitalize(s) {
  return s ? s[0].toUpperCase() + s.slice(1) : "";
}

export async function geocode(place) {
  const [hit] = await searchPlaces(place, 1);
  if (!hit) throw new Error(`Location not found: ${place}`);
  return { lat: hit.lat, lon: hit.lon, name: hit.name, country: hit.country };
}

export async function getWeather(place) {
  const loc = await geocode(place);
  const url =
    `${FORECAST_URL}?latitude=${loc.lat}&longitude=${loc.lon}` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
    `&forecast_days=7&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather fetch failed (${res.status})`);
  const data = await res.json();

  const days = (data.daily?.time || []).map((date, i) => ({
    date,
    code: data.daily.weather_code[i],
    condition: WMO[data.daily.weather_code[i]] || "Unknown",
    tempMax: data.daily.temperature_2m_max[i],
    tempMin: data.daily.temperature_2m_min[i],
    precipChance: data.daily.precipitation_probability_max[i],
  }));

  return { location: loc, unit: "°C", days };
}
