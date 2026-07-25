// Keyless, always-available image URL from a seed (Lorem Picsum).
// Used for static marketing backgrounds so nothing ever renders broken.
// Dynamic destination/interest images come from the backend /api/images
// endpoint (real Pexels photos when PEXELS_API_KEY is set).
export function seedImage(seed, w = 1200, h = 800) {
  const s = String(seed || "travel").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return `https://picsum.photos/seed/${s}/${w}/${h}`;
}
