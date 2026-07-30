export const passwordRules = [
  { key: "length", label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { key: "upper", label: "One uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
  { key: "lower", label: "One lowercase letter", test: (pw) => /[a-z]/.test(pw) },
  { key: "number", label: "One number", test: (pw) => /\d/.test(pw) },
  { key: "special", label: "One symbol (@ $ ! % * ? # &)", test: (pw) => /[@$!%*?#&]/.test(pw) },
];

export function passwordMeetsAllRules(pw) {
  return passwordRules.every((rule) => rule.test(pw || ""));
}
