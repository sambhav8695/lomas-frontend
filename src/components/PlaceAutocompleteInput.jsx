import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { inputClass } from "./Field";
import { fetchPlaceSuggestions, isGeoapifyConfigured } from "../lib/geoapify";

const DEBOUNCE_MS = 300;

export default function PlaceAutocompleteInput({ value, onChange, placeholder, ...props }) {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef(null);
  const abortRef = useRef(null);
  const blurTimeoutRef = useRef(null);
  const configured = isGeoapifyConfigured();

  useEffect(() => {
    return () => {
      clearTimeout(debounceRef.current);
      clearTimeout(blurTimeoutRef.current);
      abortRef.current?.abort();
    };
  }, []);

  function handleChange(e) {
    const nextValue = e.target.value;
    onChange(nextValue);
    setHighlighted(-1);

    clearTimeout(debounceRef.current);
    if (!configured || nextValue.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);
      try {
        const results = await fetchPlaceSuggestions(nextValue, { signal: controller.signal });
        setSuggestions(results);
        setOpen(results.length > 0);
      } catch {
        // A failed lookup just means no suggestions this keystroke — the field still works as plain text.
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);
  }

  function selectSuggestion(suggestion) {
    onChange(suggestion.label);
    setSuggestions([]);
    setOpen(false);
    setHighlighted(-1);
  }

  function handleKeyDown(e) {
    if (!open || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter" && highlighted >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[highlighted]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  function handleBlur() {
    // Delay closing so a click on a suggestion registers before the list unmounts.
    blurTimeoutRef.current = setTimeout(() => setOpen(false), 150);
  }

  return (
    <div className="relative">
      <input
        className={inputClass}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        onBlur={handleBlur}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        {...props}
      />

      {open && suggestions.length > 0 && (
        <ul className="absolute z-20 mt-1.5 w-full max-h-64 overflow-y-auto rounded-xl border border-line bg-paper shadow-lg">
          {suggestions.map((suggestion, index) => (
            <li key={suggestion.id || suggestion.label}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectSuggestion(suggestion)}
                className={`w-full flex items-start gap-2 text-left px-3.5 py-2.5 text-sm transition-colors ${
                  index === highlighted ? "bg-gold-soft/50" : "hover:bg-cream-soft"
                }`}
              >
                <MapPin size={14} className="mt-0.5 shrink-0 text-gold" />
                <span>{suggestion.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {!configured && import.meta.env.DEV && (
        <p className="text-xs text-stone-light mt-1.5">
          Place autocomplete disabled — set VITE_GEOAPIFY_API_KEY to enable it.
        </p>
      )}
      {loading && <p className="text-xs text-stone-light mt-1.5">Searching…</p>}
    </div>
  );
}
