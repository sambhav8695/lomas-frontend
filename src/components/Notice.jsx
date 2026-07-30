import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function Notice({ type = "error", children }) {
  if (!children) return null;
  const isError = type === "error";
  return (
    <div
      className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
        isError ? "border-clay/30 bg-clay/5 text-clay" : "border-gold/40 bg-gold-soft/40 text-ink-soft"
      }`}
      role="status"
    >
      {isError ? <AlertCircle size={16} className="mt-0.5 shrink-0" /> : <CheckCircle2 size={16} className="mt-0.5 shrink-0" />}
      <span>{children}</span>
    </div>
  );
}
