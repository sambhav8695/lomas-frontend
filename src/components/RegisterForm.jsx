import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi, startOAuth2Login } from "../api/auth";
import { extractErrorMessage } from "../api/client";
import { passwordMeetsAllRules } from "../lib/passwordRules";
import Field, { inputClass } from "./Field";
import Button from "./Button";
import Notice from "./Notice";
import PasswordInput from "./PasswordInput";
import { PasswordRequirements, PasswordMatchHint } from "./PasswordRequirements";
import PlaceAutocompleteInput from "./PlaceAutocompleteInput";
import Captcha from "./Captcha";
import GoogleIcon from "./GoogleIcon";
import { GENDER_OPTIONS } from "../lib/gender";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  dateOfBirth: "",
  birthPlace: "",
  birthTime: "",
  gender: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterForm({ compact = false }) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const captchaRef = useRef(null);
  const navigate = useNavigate();

  function update(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  const passwordsMatch = form.password && form.password === form.confirmPassword;
  const passwordValid = passwordMeetsAllRules(form.password);
  const canSubmit = passwordValid && passwordsMatch && Boolean(form.gender) && Boolean(captchaToken);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.gender) {
      setError("Please select a gender.");
      return;
    }
    if (!passwordValid) {
      setError("Your password doesn't meet all the requirements yet.");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords don't match.");
      return;
    }
    if (!captchaToken) {
      setError("Please complete the captcha.");
      return;
    }

    setLoading(true);
    try {
      await authApi.register(form, captchaToken);
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      setError(extractErrorMessage(err));
      captchaRef.current?.reset();
      setCaptchaToken(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={compact ? "rounded-card border border-line bg-cream-soft p-8" : "w-full max-w-md"}>
      <button
        type="button"
        onClick={() => startOAuth2Login("google")}
        className="w-full flex items-center justify-center gap-3 rounded-xl border border-line bg-paper py-3 text-[15px] hover:border-gold/50 transition-colors"
      >
        <GoogleIcon />
        Continue with Google
      </button>

      <div className="flex items-center gap-3 my-6 text-xs text-stone-light">
        <div className="flex-1 h-px bg-line" />
        or continue with email
        <div className="flex-1 h-px bg-line" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Notice type="error">{error}</Notice>
        <div className="grid grid-cols-2 gap-4">
          <Field label="First name">
            <input required className={inputClass} value={form.firstName} onChange={update("firstName")} />
          </Field>
          <Field label="Last name">
            <input required className={inputClass} value={form.lastName} onChange={update("lastName")} />
          </Field>
        </div>
        <Field label="Email address">
          <input
            required
            type="email"
            className={inputClass}
            value={form.email}
            onChange={update("email")}
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Date of birth">
            <input
              required
              type="date"
              className={inputClass}
              value={form.dateOfBirth}
              onChange={update("dateOfBirth")}
            />
          </Field>
          <Field label="Time of birth">
            <input
              required
              type="time"
              className={inputClass}
              value={form.birthTime}
              onChange={update("birthTime")}
            />
          </Field>
        </div>
        <Field label="Gender">
          <select required className={inputClass} value={form.gender} onChange={update("gender")}>
            <option value="" disabled>
              Select one
            </option>
            {GENDER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Place of birth">
          <PlaceAutocompleteInput
            required
            placeholder="City, Country"
            value={form.birthPlace}
            onChange={(val) => setForm((f) => ({ ...f, birthPlace: val }))}
          />
        </Field>
        <Field label="Password">
          <PasswordInput required value={form.password} onChange={update("password")} />
          <PasswordRequirements password={form.password} />
        </Field>
        <Field label="Confirm password">
          <PasswordInput required value={form.confirmPassword} onChange={update("confirmPassword")} />
          <PasswordMatchHint password={form.password} confirmPassword={form.confirmPassword} />
        </Field>

        <Captcha ref={captchaRef} onChange={setCaptchaToken} />

        <Button type="submit" loading={loading} disabled={!canSubmit} className="w-full mt-2">
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-stone mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-ink font-medium hover:text-gold">
          Sign in
        </Link>
      </p>
    </div>
  );
}
