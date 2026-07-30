import { useEffect, useRef, useState } from "react";
import { inputClass } from "./Field";
import { loadGoogleMaps } from "../lib/googleMaps";

/**
 * NOTE: this uses the classic `google.maps.places.Autocomplete` widget because it
 * attaches directly to a plain <input>, which is what lets it match our design system.
 * Google deprecated this widget for API keys created after March 2025 in favor of the
 * new <gmp-place-autocomplete> web component. If your key is new enough that this
 * widget is unavailable on it, the field falls back to a plain text input automatically
 * (see the `available` state below) — enable "Places API (Legacy)" for your key, or
 * swap this component to wrap <gmp-place-autocomplete> instead.
 */
export default function PlaceAutocompleteInput({ value, onChange, placeholder, ...props }) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    let cancelled = false;

    loadGoogleMaps()
      .then((google) => {
        if (cancelled || !inputRef.current) return;
        autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
          types: ["(cities)"],
          fields: ["formatted_address", "name", "geometry"],
        });
        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current.getPlace();
          const description = place.formatted_address || place.name;
          if (description) onChange(description);
        });
      })
      .catch((err) => {
        console.warn(err.message);
        if (!cancelled) setAvailable(false);
      });

    return () => {
      cancelled = true;
      if (autocompleteRef.current) {
        window.google?.maps?.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onChange]);

  return (
    <div>
      <input
        ref={inputRef}
        className={inputClass}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        {...props}
      />
      {!available && (
        <p className="text-xs text-stone-light mt-1.5">
          Type your city and country — place suggestions are unavailable right now.
        </p>
      )}
    </div>
  );
}
