const BASE_URL = "https://api.geoapify.com/v1/geocode/autocomplete";

/**
 * Looks up place suggestions via Geoapify's Autocomplete API. Requires
 * VITE_GEOAPIFY_API_KEY — see .env.example. Returns [] (rather than throwing)
 * when no key is configured, so callers can degrade to a plain text input.
 */
export async function fetchPlaceSuggestions(query, { signal } = {}) {
  const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
  if (!apiKey || !query || query.trim().length < 2) {
    return [];
  }

  const url = new URL(BASE_URL);
  url.searchParams.set("text", query);
  url.searchParams.set("type", "city");
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "5");
  url.searchParams.set("apiKey", apiKey);

  const response = await fetch(url.toString(), { signal });
  if (!response.ok) {
    throw new Error(`Geoapify request failed (${response.status})`);
  }

  const data = await response.json();
  return (data.results || []).map((result) => ({
    id: result.place_id,
    label: result.formatted,
    lat: result.lat,
    lon: result.lon,
  }));
}

export function isGeoapifyConfigured() {
  return Boolean(import.meta.env.VITE_GEOAPIFY_API_KEY);
}
