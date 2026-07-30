export default function Field({ label, error, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      {label && <span className="block text-sm text-ink-soft mb-1.5">{label}</span>}
      {children}
      {error && <span className="block text-xs text-clay mt-1.5">{error}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border border-line bg-paper px-4 py-3 text-[15px] text-ink placeholder:text-stone-light outline-none transition-colors focus:border-gold";
