// Image sourcing via Pexels, proxied so the API key never reaches the client.
// Falls back to keyless placeholder images if no key or the API fails.

const PEXELS_URL = "https://api.pexels.com/v1/search";
const cache = new Map(); // query -> { at, data }
const TTL_MS = 1000 * 60 * 30;

function fallbackImages(query, perPage) {
  // Deterministic keyless images so the UI never breaks. Uses Lorem Picsum
  // (picsum.photos), which is reliable and needs no API key. Images are not
  // destination-specific — set PEXELS_API_KEY for real travel photos.
  const base = (query || "travel").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return Array.from({ length: perPage }, (_, i) => ({
    id: `fallback-${base}-${i}`,
    url: `https://picsum.photos/seed/${base}-${i}/800/600`,
    thumb: `https://picsum.photos/seed/${base}-${i}/400/300`,
    photographer: "Lorem Picsum",
    alt: query,
    fallback: true,
  }));
}

/**
 * @param {string} query
 * @param {number} perPage
 * @returns {Promise<Array>} normalized photo objects
 */
export async function searchImages(query, perPage = 6) {
  const q = (query || "travel").trim();
  const key = `${q}::${perPage}`;

  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.data;

  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    const data = fallbackImages(q, perPage);
    cache.set(key, { at: Date.now(), data });
    return data;
  }

  try {
    const url = `${PEXELS_URL}?query=${encodeURIComponent(q)}&per_page=${perPage}&orientation=landscape`;
    const res = await fetch(url, { headers: { Authorization: apiKey } });
    if (!res.ok) throw new Error(`Pexels ${res.status}`);
    const json = await res.json();

    const data = (json.photos || []).map((p) => ({
      id: String(p.id),
      url: p.src?.large || p.src?.original,
      thumb: p.src?.medium || p.src?.small,
      photographer: p.photographer,
      alt: p.alt || q,
      fallback: false,
    }));

    const result = data.length ? data : fallbackImages(q, perPage);
    cache.set(key, { at: Date.now(), data: result });
    return result;
  } catch (err) {
    console.warn(`[imageService] falling back: ${err.message}`);
    const data = fallbackImages(q, perPage);
    cache.set(key, { at: Date.now(), data });
    return data;
  }
}
