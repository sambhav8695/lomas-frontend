let loadPromise = null;

/**
 * Loads the Google Maps JavaScript API with the Places library.
 * Requires VITE_GOOGLE_PLACES_API_KEY to be set — see .env.example.
 * Safe to call multiple times; the script is only injected once.
 */
export function loadGoogleMaps() {
  if (window.google?.maps?.places) return Promise.resolve(window.google);
  if (loadPromise) return loadPromise;

  const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return Promise.reject(
      new Error("Missing VITE_GOOGLE_PLACES_API_KEY — birth-place autocomplete is disabled.")
    );
  }

  loadPromise = new Promise((resolve, reject) => {
    const callbackName = "__lomasGoogleMapsCallback";
    window[callbackName] = () => resolve(window.google);

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=${callbackName}&loading=async`;
    script.async = true;
    script.defer = true;
    script.onerror = () => reject(new Error("Failed to load Google Maps script."));
    document.head.appendChild(script);
  });

  return loadPromise;
}
