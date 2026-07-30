import { useState } from "react";
import { useLocation } from "react-router-dom";
import { ThumbsUp, ThumbsDown, Check } from "lucide-react";
import { feedbackApi } from "../api/feedback";

export default function MessageFeedback({ chatMessageId, chatSessionId }) {
  const location = useLocation();
  const [sentiment, setSentiment] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState("");
  const [noteSent, setNoteSent] = useState(false);

  async function rate(nextSentiment) {
    if (submitting) return;
    setSubmitting(true);
    try {
      await feedbackApi.submit({
        type: "MESSAGE_RATING",
        sentiment: nextSentiment,
        chatMessageId,
        chatSessionId,
        pagePath: location.pathname,
      });
      setSentiment(nextSentiment);
      if (nextSentiment === "NOT_HELPFUL") setShowNote(true);
    } catch {
      // Rating a reply is low-stakes — fail silently rather than interrupt the conversation.
    } finally {
      setSubmitting(false);
    }
  }

  async function sendNote() {
    if (!note.trim()) return;
    setSubmitting(true);
    try {
      await feedbackApi.submit({
        type: "MESSAGE_RATING",
        sentiment: "NOT_HELPFUL",
        chatMessageId,
        chatSessionId,
        comment: note.trim(),
        pagePath: location.pathname,
      });
      setNoteSent(true);
    } catch {
      // ignore — the thumbs-down itself was already recorded
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-1.5 flex flex-col items-start gap-1.5">
      <div className="flex items-center gap-2 text-stone-light">
        <button
          onClick={() => rate("HELPFUL")}
          disabled={submitting}
          aria-label="Helpful"
          aria-pressed={sentiment === "HELPFUL"}
          className={`p-1 rounded transition-colors hover:text-gold ${
            sentiment === "HELPFUL" ? "text-gold" : ""
          }`}
        >
          <ThumbsUp size={14} fill={sentiment === "HELPFUL" ? "currentColor" : "none"} />
        </button>
        <button
          onClick={() => rate("NOT_HELPFUL")}
          disabled={submitting}
          aria-label="Not helpful"
          aria-pressed={sentiment === "NOT_HELPFUL"}
          className={`p-1 rounded transition-colors hover:text-clay ${
            sentiment === "NOT_HELPFUL" ? "text-clay" : ""
          }`}
        >
          <ThumbsDown size={14} fill={sentiment === "NOT_HELPFUL" ? "currentColor" : "none"} />
        </button>
      </div>

      {showNote && !noteSent && (
        <div className="flex items-center gap-2 w-full max-w-xs">
          <input
            autoFocus
            className="flex-1 text-xs rounded-full border border-line bg-paper px-3 py-1.5 outline-none focus:border-gold"
            placeholder="What went wrong? (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendNote()}
            maxLength={2000}
          />
          <button
            onClick={sendNote}
            disabled={submitting || !note.trim()}
            className="text-xs text-gold hover:text-clay disabled:opacity-40"
          >
            Send
          </button>
        </div>
      )}
      {noteSent && (
        <span className="flex items-center gap-1 text-xs text-gold">
          <Check size={12} /> Thanks, noted
        </span>
      )}
    </div>
  );
}
