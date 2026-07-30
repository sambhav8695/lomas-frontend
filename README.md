# Lomas — Frontend

A React (Vite) frontend for the `astrology-backend` Spring Boot API. Built to match the Lomas brand:
warm cream background, `Fraunces` serif display type, `Work Sans` body copy, `Space Mono` labels, and a
custom animated astrology-wheel illustration used as the recurring signature motif.

## Stack

- React 19 + Vite
- React Router 7
- Tailwind CSS v4 (via `@tailwindcss/vite`, config lives in `src/index.css`)
- Axios (with automatic access-token refresh on 401)
- Framer Motion (hero entrance animation)
- lucide-react (icons)

## Getting started

```bash
npm install
cp .env.example .env   # adjust VITE_API_BASE_URL if your backend isn't on localhost:8080
npm run dev
```

The dev server runs on **port 3000** on purpose — the backend's default CORS origin
(`CORS_ALLOWED_ORIGINS`) and OAuth2 redirect base (`FRONTEND_BASE_URL`) both default to
`http://localhost:3000`, so this lines up out of the box with `astrology-backend`'s `application.yml`
defaults. Change `server.port` in `vite.config.js` if you've changed those on the backend.

### Optional integrations (`.env`)

- `VITE_GOOGLE_PLACES_API_KEY` — enables autocomplete on birth-place fields (register, complete-birth-details,
  profile). Get a key with the **Places API (Legacy)** enabled from the Google Cloud Console. Without it, the
  field just falls back to a plain text input — nothing breaks.
- `VITE_RECAPTCHA_SITE_KEY` — your Google reCAPTCHA v2 ("I'm not a robot") site key from
  https://www.google.com/recaptcha/admin. **Without it, the captcha step is skipped entirely** — no widget,
  no "for testing purposes only" banner. Set a real key here, and the matching `RECAPTCHA_SECRET_KEY` +
  `CAPTCHA_ENABLED=true` on the backend, before deploying. The solved token is sent as an `X-Captcha-Token`
  header on `/auth/register`, `/auth/login`, `/auth/forgot-password`, and `/auth/otp/resend`, and the backend
  now verifies it server-side via Google's siteverify API (see `astrology-backend`'s own README/`.env.example`
  for the matching config).

## What's implemented

- **Marketing site**: landing page, about, blog list + search, blog detail (renders admin-authored HTML)
- **Auth**: register → email OTP verification → login; forgot/reset password; Google OAuth2 login
  (redirects to `/oauth2/redirect`, which exchanges the query-string tokens and, if this is the user's
  first OAuth login, sends them to `/complete-birth-details`)
  - Registration now also collects **gender** (male / female / non-binary / prefer not to say), matching
    the backend's `Gender` enum. It's editable afterwards from the profile page.
  - Password fields have a show/hide toggle, a live requirements checklist (length, upper/lowercase,
    number, symbol — matching the backend's `@ValidPassword` rule), and a live "passwords match" hint
    wherever a password is set or changed (register, reset-password, change-password).
  - Birth-place fields use Google Places autocomplete when `VITE_GOOGLE_PLACES_API_KEY` is set.
  - Register, login, forgot-password, and OTP-resend are all gated behind a reCAPTCHA checkbox when
    `VITE_RECAPTCHA_SITE_KEY` is configured, to cut down on spam signups / email floods.
  - Verifying your email now shows a success screen before redirecting to login, and login shows a
    banner confirming verification or a completed password reset.
- **Chat**: session sidebar (create/rename/delete) + message thread with optimistic sending, and a
  thumbs up/down on every assistant reply (see Feedback below)
- **Profile**: view/edit profile & birth details (including gender), change password (local accounts only),
  deactivate/delete account
- **Feedback**: three ways feedback gets captured, all backed by the same endpoints —
  1. A thumbs up/down under every assistant chat reply (`MessageFeedback.jsx`). Thumbs-down reveals an
     optional one-line "what went wrong" follow-up. Re-rating the same reply updates the existing rating
     rather than creating a duplicate (the backend upserts on user+message).
  2. An always-visible "Feedback" button (`FeedbackHub.jsx`, bottom-left once signed in) opening a modal
     to rate the overall experience, report a problem, suggest an idea, or just say something nice —
     available any time, not gated by cooldowns.
  3. A periodic auto-prompt: the same modal, triggered automatically (at most once per browser session)
     when `GET /feedback/prompt-status` says the user is eligible — which the backend only allows once
     they've had a real conversation (a few assistant replies) and enough time has passed since their last
     general rating (`FEEDBACK_COOLDOWN_DAYS` server-side, default 21 days). "Not now" additionally snoozes
     the auto-prompt locally for a few days (`src/lib/feedbackSnooze.js`), independent of the server cooldown.

## Not implemented (backend supports it, UI doesn't yet)

- Admin console (`/api/v1/admin/**`: user/audit-log listing, blog CRUD/publish) — every admin endpoint is
  already wrapped in `src/api/*`, so this would mostly be new pages behind a `role === "ADMIN"` guard.
- Microsoft OAuth2 login button (Google is wired up; add a second `startOAuth2Login("microsoft")` button
  wherever you'd like it).

## Project structure

```
src/
  api/            axios client + one module per backend controller
  components/     shared UI (buttons, fields, navbar, chat sidebar, the AstroWheel illustration…)
  context/        AuthContext (session state, login/logout, token refresh handling)
  pages/          one file per route
  index.css       Tailwind v4 theme tokens (colors, fonts, radii) + small global styles
```
