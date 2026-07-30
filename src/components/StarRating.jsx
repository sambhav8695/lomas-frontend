import { useState } from "react";
import { Star } from "lucide-react";

export default function StarRating({ value, onChange, size = 28 }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating out of 5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || value);
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              size={size}
              fill={filled ? "#bd8a45" : "none"}
              stroke={filled ? "#bd8a45" : "#a89f8b"}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
    </div>
  );
}
