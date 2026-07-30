import { useEffect, useState } from "react";
import { MessageSquareHeart } from "lucide-react";
import { feedbackApi } from "../api/feedback";
import FeedbackModal from "./FeedbackModal";
import {
  hasCheckedFeedbackPromptThisSession,
  isFeedbackPromptSnoozed,
  markFeedbackPromptCheckedThisSession,
  snoozeFeedbackPrompt,
} from "../lib/feedbackSnooze";

/**
 * Two feedback surfaces in one place:
 *  - a small always-visible button so people can leave feedback whenever they feel like it
 *  - a quiet, periodic auto-prompt (server-gated cooldown + a local "remind me later" snooze)
 *    that surfaces the same modal without anyone having to go looking for it
 */
export default function FeedbackHub() {
  const [modalOpen, setModalOpen] = useState(false);
  const [autoPrompted, setAutoPrompted] = useState(false);

  useEffect(() => {
    if (hasCheckedFeedbackPromptThisSession() || isFeedbackPromptSnoozed()) return;

    markFeedbackPromptCheckedThisSession();
    feedbackApi
      .getPromptStatus()
      .then((status) => {
        if (status.eligible) {
          setAutoPrompted(true);
          setModalOpen(true);
        }
      })
      .catch(() => {
        // Quietly skip the auto-prompt if the check fails — never let this block the app.
      });
  }, []);

  function handleClose() {
    setModalOpen(false);
    if (autoPrompted) {
      snoozeFeedbackPrompt(3);
      setAutoPrompted(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-6 left-6 z-30 flex items-center gap-2 rounded-full bg-ink text-cream-soft pl-4 pr-5 py-3 text-sm shadow-lg hover:bg-ink-soft transition-colors"
        aria-label="Send feedback"
      >
        <MessageSquareHeart size={17} />
        Feedback
      </button>

      <FeedbackModal open={modalOpen} onClose={handleClose} defaultCategory="GENERAL" />
    </>
  );
}
