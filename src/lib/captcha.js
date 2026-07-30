/**
 * True only when a real reCAPTCHA site key has been configured (VITE_RECAPTCHA_SITE_KEY).
 * We deliberately do NOT fall back to Google's public test key for real users — that key
 * always renders a "This reCAPTCHA is for testing purposes only" banner, which looks broken
 * in production. Without a configured key, the captcha step is skipped entirely (forms treat
 * it as already satisfied) rather than showing that banner.
 */
export const CAPTCHA_ENABLED = Boolean(import.meta.env.VITE_RECAPTCHA_SITE_KEY);
