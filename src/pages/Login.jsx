import { useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AstroWheel from "../components/AstroWheel";
import Field, { inputClass } from "../components/Field";
import Button from "../components/Button";
import Notice from "../components/Notice";
import PasswordInput from "../components/PasswordInput";
import Captcha from "../components/Captcha";
import GoogleIcon from "../components/GoogleIcon";
import { useAuth } from "../context/AuthContext";
import { extractErrorMessage } from "../api/client";
import { startOAuth2Login } from "../api/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const captchaRef = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const successMessage = location.state?.verified
    ? "Your email is verified — you can sign in now."
    : location.state?.passwordReset
    ? "Your password has been reset. Sign in with your new password."
    : "";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!captchaToken) {
      setError("Please complete the captcha.");
      return;
    }

    setLoading(true);
    try {
      const auth = await login(email, password, captchaToken);
      if (auth.requiresBirthDetails) {
        navigate("/complete-birth-details");
      } else {
        navigate(location.state?.from?.pathname || "/chat");
      }
    } catch (err) {
      setError(extractErrorMessage(err));
      captchaRef.current?.reset();
      setCaptchaToken(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 grid lg:grid-cols-2 gap-16 items-center">
      <div className="hidden lg:flex justify-center">
        <AstroWheel size={380} />
      </div>
      <div className="w-full max-w-md mx-auto">
        <span className="eyebrow">Welcome back</span>
        <h1 className="font-display text-4xl mt-3 mb-8">Sign in to Lomas</h1>

        {successMessage && (
          <div className="mb-6">
            <Notice type="success">{successMessage}</Notice>
          </div>
        )}

        <button
          type="button"
          onClick={() => startOAuth2Login("google")}
          className="w-full flex items-center justify-center gap-3 rounded-xl border border-line bg-paper py-3 text-[15px] hover:border-gold/50 transition-colors mb-6"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-6 text-xs text-stone-light">
          <div className="flex-1 h-px bg-line" />
          or continue with email
          <div className="flex-1 h-px bg-line" />
        </div>

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
          <Field label="Password">
            <PasswordInput required value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          <div className="flex justify-end -mt-2">
            <Link to="/forgot-password" className="text-sm text-stone hover:text-gold">
              Forgot password?
            </Link>
          </div>

          <Captcha ref={captchaRef} onChange={setCaptchaToken} />

          <Button type="submit" loading={loading} disabled={!captchaToken} className="w-full">
            Sign in
          </Button>
        </form>

        <p className="text-center text-sm text-stone mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-ink font-medium hover:text-gold">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
