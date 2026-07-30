import { forwardRef, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { CAPTCHA_ENABLED } from "../lib/captcha";

const Captcha = forwardRef(function Captcha({ onChange }, ref) {
  // No site key configured: skip rendering the widget (and the "for testing purposes
  // only" banner that comes with Google's public test key) and just tell the parent
  // form the captcha step is satisfied, so nothing else in the app has to special-case it.
  useEffect(() => {
    if (!CAPTCHA_ENABLED) onChange("captcha-not-configured");
  }, [onChange]);

  if (!CAPTCHA_ENABLED) {
    if (import.meta.env.DEV) {
      return (
        <p className="text-xs text-stone-light text-center">
          Captcha skipped in this environment — set VITE_RECAPTCHA_SITE_KEY to enable it.
        </p>
      );
    }
    return null;
  }

  return (
    <div className="flex justify-center">
      <ReCAPTCHA
        ref={ref}
        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
        onChange={onChange}
        onExpired={() => onChange(null)}
      />
    </div>
  );
});

export default Captcha;
