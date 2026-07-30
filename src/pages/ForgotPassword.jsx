import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Field, { inputClass } from "../components/Field";
import Button from "../components/Button";
import Notice from "../components/Notice";
import Captcha from "../components/Captcha";
import { authApi } from "../api/auth";
import { extractErrorMessage } from "../api/client";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const captchaRef = useRef(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!captchaToken) {
      setError("Please complete the captcha.");
      return;
    }

    setLoading(true);
    try {
      await authApi.forgotPassword({ email }, captchaToken);
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      setError(extractErrorMessage(err));
      captchaRef.current?.reset();
      setCaptchaToken(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-24">
      <span className="eyebrow">Password reset</span>
      <h1 className="font-display text-4xl mt-3 mb-4">Forgot your password?</h1>
      <p className="text-stone mb-8">
        Enter your email and, if an account exists, we'll send a reset code.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Notice type="error">{error}</Notice>
        <Field label="Email address">
          <input
            required
            type="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        <Captcha ref={captchaRef} onChange={setCaptchaToken} />

        <Button type="submit" loading={loading} disabled={!captchaToken} className="w-full">
          Send reset code
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
