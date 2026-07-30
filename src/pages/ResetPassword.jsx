import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Field, { inputClass } from "../components/Field";
import Button from "../components/Button";
import Notice from "../components/Notice";
import PasswordInput from "../components/PasswordInput";
import { PasswordRequirements, PasswordMatchHint } from "../components/PasswordRequirements";
import { passwordMeetsAllRules } from "../lib/passwordRules";
import { authApi } from "../api/auth";
import { extractErrorMessage } from "../api/client";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: location.state?.email || "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  const passwordsMatch = form.password && form.password === form.confirmPassword;
  const passwordValid = passwordMeetsAllRules(form.password);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!passwordValid) {
      setError("Your new password doesn't meet all the requirements yet.");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword(form);
      navigate("/login", { state: { passwordReset: true } });
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-24">
      <span className="eyebrow">Password reset</span>
      <h1 className="font-display text-4xl mt-3 mb-8">Set a new password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Notice type="error">{error}</Notice>
        <Field label="Email address">
          <input required type="email" className={inputClass} value={form.email} onChange={update("email")} />
        </Field>
        <Field label="Reset code">
          <input
            required
            inputMode="numeric"
            maxLength={6}
            className={`${inputClass} tracking-[0.5em] text-center font-label`}
            value={form.otp}
            onChange={(e) => setForm((f) => ({ ...f, otp: e.target.value.replace(/\D/g, "") }))}
          />
        </Field>
        <Field label="New password">
          <PasswordInput required value={form.password} onChange={update("password")} />
          <PasswordRequirements password={form.password} />
        </Field>
        <Field label="Confirm new password">
          <PasswordInput required value={form.confirmPassword} onChange={update("confirmPassword")} />
          <PasswordMatchHint password={form.password} confirmPassword={form.confirmPassword} />
        </Field>
        <Button type="submit" loading={loading} disabled={!passwordValid || !passwordsMatch} className="w-full">
          Reset password
        </Button>
      </form>
      <p className="text-center text-sm text-stone mt-6">
        <Link to="/login" className="hover:text-gold">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
