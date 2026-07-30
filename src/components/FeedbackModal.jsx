import { useState } from "react";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { feedbackApi } from "../api/feedback";
import { extractErrorMessage } from "../api/client";
import StarRating from "./StarRating";
import Button from "./Button";
import Notice from "./Notice";
import AstroWheel from "./AstroWheel";

const CATEGORIES = [
  { value: "GENERAL", label: "Rate your experience" },
  { value: "FEATURE_REQUEST", label: "Suggest an idea" },
  { value: "BUG", label: "Report a problem" },
  { value: "PRAISE", label: "Say something nice" },
];

export default function FeedbackModal({ open, onClose, defaultCategory = "GENERAL", chatSessionId }) {
  const location = useLocation();
  const [category, setCategory] = useState(defaultCategory);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  const needsRating = category === "GENERAL";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (needsRating && rating === 0) {
      setError("Please choose a star rating.");
      return;
    }
    if (!needsRating && !comment.trim()) {
      setError("Please add a note so we know what you mean.");
      return;
    }

    setSubmitting(true);
    try {
      await feedbackApi.submit({
        type: category,
        rating: needsRating ? rating : undefined,
        comment: comment.trim() || undefined,
        chatSessionId: chatSessionId || undefined,
        pagePath: location.pathname,
      });
      setSubmitted(true);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    setCategory(defaultCategory);
    setRating(0);
    setComment("");
    setError("");
    setSubmitted(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-ink/30 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-card border border-line bg-cream-soft p-7 relative shadow-xl">
        <button
          onClick={handleClose}
          className="absolute right-5 top-5 text-stone hover:text-ink transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <AstroWheel size={140} className="mx-auto" animate={false} />
            <h3 className="font-display text-2xl mt-4">Thank you</h3>
            <p className="text-stone mt-2">
              Your feedback goes straight to the people building Lomas — genuinely appreciated.
            </p>
            <Button onClick={handleClose} className="mt-6">
              Close
            </Button>
          </div>
        ) : (
          <>
            <span className="eyebrow">Feedback</span>
            <h3 className="font-display text-2xl mt-2 mb-5">Help us improve Lomas</h3>

            <div className="flex flex-wrap gap-2 mb-5">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCategory(c.value)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    category === c.value
                      ? "border-ink bg-ink text-cream-soft"
                      : "border-line text-stone hover:border-gold/50"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Notice type="error">{error}</Notice>

              {needsRating && (
                <div className="flex justify-center py-2">
                  <StarRating value={rating} onChange={setRating} />
                </div>
              )}

              <textarea
                className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-[15px] outline-none focus:border-gold resize-none"
                rows={4}
                maxLength={2000}
                placeholder={
                  needsRating
                    ? "Anything you'd like to add? (optional)"
                    : "Tell us what's going on…"
                }
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <div className="flex gap-3">
                <Button type="submit" loading={submitting} className="flex-1">
                  Send feedback
                </Button>
                <Button type="button" variant="secondary" onClick={handleClose}>
                  Not now
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
