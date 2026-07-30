import { useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Field, { inputClass } from "../components/Field";
import Button from "../components/Button";
import Notice from "../components/Notice";
import AstroWheel from "../components/AstroWheel";
import Captcha from "../components/Captcha";
import { authApi } from "../api/auth";
import { extractErrorMessage } from "../api/client";

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const [resendOpen, setResendOpen] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState("");
  const [resendCaptchaToken, setResendCaptchaToken] = useState(null);
  const resendCaptchaRef = useRef(null);

  async function handleVerify(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.verifyEmail({ email, otp });
      setVerified(true);
      setTimeout(() => navigate("/login", { state: { verified: true } }), 1400);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setResendSuccess("");
    if (!resendCaptchaToken) {
      setError("Please complete the captcha to resend the code.");
      return;
    }
    setResending(true);
    try {
      await authApi.resendOtp({ email, purpose: "EMAIL_VERIFICATION" }, resendCaptchaToken);
      setResendSuccess("A fresh code is on its way to your inbox.");
      setResendOpen(false);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      resendCaptchaRef.current?.reset();
      setResendCaptchaToken(null);
      setResending(false);
    }
  }

  if (verified) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <AstroWheel size={180} className="mx-auto" />
        <h1 className="font-display text-3xl mt-6">Email verified</h1>
        <div className="mt-4">
          <Notice type="success">Your account is active. Taking you to sign in…</Notice>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 grid lg:grid-cols-2 gap-16 items-center">
      <div className="hidden lg:flex justify-center">
        <AstroWheel size={340} />
      </div>
      <div className="w-full max-w-md mx-auto">
        <span className="eyebrow">One more step</span>
        <h1 className="font-display text-4xl mt-3 mb-4">Verify your email</h1>
        <p className="text-stone mb-8">
          We've sent a 6-digit code to your email. Enter it below to activate your account.
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <Notice type="error">{error}</Notice>
          <Notice type="success">{resendSuccess}</Notice>
          <Field label="Email address">
            <input
              required
              type="email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field label="Verification code">
            <input
              required
              inputMode="numeric"
              maxLength={6}
              placeholder="••••••"
              className={`${inputClass} tracking-[0.5em] text-center font-label text-lg`}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />
          </Field>
          <Button type="submit" loading={loading} className="w-full">
            Verify email
          </Button>
        </form>

        <div className="text-center text-sm text-stone mt-6 space-y-4">
          {!resendOpen ? (
            <button onClick={() => setResendOpen(true)} className="hover:text-gold">
              Didn't get a code? Resend it
            </button>
          ) : (
            <div className="rounded-card border border-line bg-cream-soft p-5 text-left space-y-4">
              <p className="text-sm text-ink-soft text-center">
                Complete the captcha to resend your code.
              </p>
              <Captcha ref={resendCaptchaRef} onChange={setResendCaptchaToken} />
              <Button
                onClick={handleResend}
                loading={resending}
                disabled={!resendCaptchaToken}
                className="w-full"
              >
                Resend code
              </Button>
            </div>
          )}
          <p>
            <Link to="/login" className="hover:text-gold">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
