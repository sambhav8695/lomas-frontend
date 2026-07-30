const GLYPHS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

/**
 * The recurring signature motif of the product: a hand-built birth-chart
 * wheel with a slow-breathing gold halo and a faint rotating ring of
 * degree ticks, standing in for the "self" at the center of the chart.
 */
export default function AstroWheel({ size = 420, className = "", animate = true }) {
  const cx = 210;
  const cy = 210;
  const rOuter = 195;
  const rGlyphRing = 168;
  const rInnerRing = 132;
  const rCore = 60;

  const ticks = Array.from({ length: 72 }, (_, i) => i * 5);

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(217,167,92,0.35) 0%, rgba(217,167,92,0.12) 45%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <svg
        viewBox="0 0 420 420"
        width={size}
        height={size}
        className="relative"
        role="img"
        aria-label="Illustration of an astrological birth chart wheel"
      >
        <defs>
          <linearGradient id="wheelStroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#bd8a45" />
            <stop offset="100%" stopColor="#7a5a2e" />
          </linearGradient>
        </defs>

        <g stroke="url(#wheelStroke)" strokeWidth="1" fill="none" opacity="0.75">
          <circle cx={cx} cy={cy} r={rOuter} />
          <circle cx={cx} cy={cy} r={rGlyphRing} />
          <circle cx={cx} cy={cy} r={rInnerRing} />
        </g>

        {/* degree ticks */}
        <g stroke="#bd8a45" opacity="0.45">
          {ticks.map((deg) => {
            const long = deg % 30 === 0;
            const rad = (deg * Math.PI) / 180;
            const r1 = rOuter;
            const r2 = rOuter - (long ? 10 : 5);
            return (
              <line
                key={deg}
                x1={cx + r1 * Math.cos(rad)}
                y1={cy + r1 * Math.sin(rad)}
                x2={cx + r2 * Math.cos(rad)}
                y2={cy + r2 * Math.sin(rad)}
                strokeWidth={long ? 1.2 : 0.6}
              />
            );
          })}
        </g>

        {/* 12 house spokes */}
        <g stroke="#bd8a45" strokeWidth="0.6" opacity="0.4">
          {GLYPHS.map((_, i) => {
            const rad = (i * 30 * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={cx + rInnerRing * Math.cos(rad)}
                y1={cy + rInnerRing * Math.sin(rad)}
                x2={cx + rCore * Math.cos(rad)}
                y2={cy + rCore * Math.sin(rad)}
              />
            );
          })}
        </g>

        {/* zodiac glyphs */}
        <g
          fontFamily="Fraunces, serif"
          fontSize="15"
          fill="#7a5a2e"
          textAnchor="middle"
          dominantBaseline="middle"
          className={animate ? "origin-center animate-[spin_120s_linear_infinite]" : ""}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        >
          {GLYPHS.map((g, i) => {
            const rad = (i * 30 * Math.PI) / 180;
            return (
              <text key={g} x={cx + rGlyphRing * Math.cos(rad)} y={cy + rGlyphRing * Math.sin(rad)}>
                {g}
              </text>
            );
          })}
        </g>

        {/* natal chart aspect lines — a loose star polygon connecting a few houses */}
        <g stroke="#bd8a45" strokeWidth="0.8" opacity="0.55" fill="none">
          <polygon
            points={[1, 4, 7, 10, 2, 6, 9]
              .map((i) => {
                const rad = (i * 30 * Math.PI) / 180;
                const r = rInnerRing - 6;
                return `${cx + r * Math.cos(rad)},${cy + r * Math.sin(rad)}`;
              })
              .join(" ")}
          />
        </g>

        {/* abstracted figure at the center, standing in for "the self" */}
        <g stroke="#5b431f" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.85">
          <circle cx={cx} cy={cy - 22} r="9" />
          <line x1={cx} y1={cy - 13} x2={cx} y2={cy + 20} />
          <line x1={cx} y1={cy - 4} x2={cx - 26} y2={cy - 16} />
          <line x1={cx} y1={cy - 4} x2={cx + 26} y2={cy - 16} />
          <line x1={cx} y1={cy + 20} x2={cx - 18} y2={cy + 44} />
          <line x1={cx} y1={cy + 20} x2={cx + 18} y2={cy + 44} />
        </g>

        <circle cx={cx} cy={cy} r={rCore} stroke="#bd8a45" strokeWidth="0.8" fill="none" opacity="0.5" />
      </svg>
    </div>
  );
}
