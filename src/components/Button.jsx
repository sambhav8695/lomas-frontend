import { Loader2 } from "lucide-react";

const base = "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

const variants = {
  primary: `${base} bg-ink text-cream-soft hover:bg-ink-soft`,
  secondary: `${base} border border-ink/20 text-ink hover:bg-ink/5`,
  ghost: `${base} text-ink-soft hover:text-ink`,
};

export default function Button({ variant = "primary", loading, disabled, children, className = "", ...props }) {
  return (
    <button className={`${variants[variant]} ${className}`} disabled={loading || disabled} {...props}>
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}
