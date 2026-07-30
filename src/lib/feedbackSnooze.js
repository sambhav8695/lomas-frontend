const SNOOZE_KEY = "lomas_feedback_snoozed_until";
const SESSION_CHECKED_KEY = "lomas_feedback_checked_this_session";

/** "Remind me later" — don't ask again on this device for a few days, independent of the server cooldown. */
export function snoozeFeedbackPrompt(days = 3) {
  const until = Date.now() + days * 24 * 60 * 60 * 1000;
  localStorage.setItem(SNOOZE_KEY, String(until));
}

export function isFeedbackPromptSnoozed() {
  const until = Number(localStorage.getItem(SNOOZE_KEY) || 0);
  return Date.now() < until;
}

/** Avoid re-hitting /feedback/prompt-status on every route change within the same tab session. */
export function hasCheckedFeedbackPromptThisSession() {
  return sessionStorage.getItem(SESSION_CHECKED_KEY) === "true";
}

export function markFeedbackPromptCheckedThisSession() {
  sessionStorage.setItem(SESSION_CHECKED_KEY, "true");
}
