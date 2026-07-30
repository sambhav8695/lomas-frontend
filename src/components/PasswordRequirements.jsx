import { Check, X } from "lucide-react";
import { passwordRules } from "../lib/passwordRules";

export function PasswordRequirements({ password }) {
  return (
    <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
      {passwordRules.map((rule) => {
        const met = rule.test(password || "");
        return (
          <li
            key={rule.key}
            className={`flex items-center gap-1.5 text-xs transition-colors ${
              met ? "text-gold" : "text-stone-light"
            }`}
          >
            {met ? <Check size={12} /> : <X size={12} />}
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
}

export function PasswordMatchHint({ password, confirmPassword }) {
  if (!confirmPassword) return null;
  const matches = password === confirmPassword;
  return (
    <p className={`flex items-center gap-1.5 text-xs mt-1.5 ${matches ? "text-gold" : "text-clay"}`}>
      {matches ? <Check size={12} /> : <X size={12} />}
      {matches ? "Passwords match" : "Passwords don't match yet"}
    </p>
  );
}
