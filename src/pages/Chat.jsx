import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Send } from "lucide-react";
import { chatApi } from "../api/chat";
import { extractErrorMessage } from "../api/client";
import ChatSidebar from "../components/ChatSidebar";
import MessageBubble from "../components/MessageBubble";
import AstroWheel from "../components/AstroWheel";
import Notice from "../components/Notice";

export default function Chat() {
  const { chatId } = useParams();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [sending, setSending] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  const loadSessions = useCallback(async () => {
    const page = await chatApi.listChats();
    setSessions(page.content);
    return page.content;
  }, []);

  useEffect(() => {
    loadSessions().then((content) => {
      if (!chatId && content.length > 0) {
        navigate(`/chat/${content[0].id}`, { replace: true });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }
    setLoadingHistory(true);
    setError("");
    chatApi
      .getHistory(chatId)
      .then((page) => setMessages(page.content))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoadingHistory(false));
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function handleCreate() {
    setCreating(true);
    setError("");
    try {
      const session = await chatApi.createChat();
      setSessions((s) => [session, ...s]);
      navigate(`/chat/${session.id}`);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setCreating(false);
    }
  }

  async function handleRename(id, title) {
    try {
      const updated = await chatApi.renameChat(id, title);
      setSessions((s) => s.map((x) => (x.id === id ? updated : x)));
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  }

  async function handleDelete(id) {
    try {
      await chatApi.deleteChat(id);
      const remaining = sessions.filter((x) => x.id !== id);
      setSessions(remaining);
      if (id === chatId) {
        navigate(remaining.length ? `/chat/${remaining[0].id}` : "/chat", { replace: true });
      }
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;

    let targetChatId = chatId;
    setError("");

    if (!targetChatId) {
      try {
        setCreating(true);
        const session = await chatApi.createChat();
        setSessions((s) => [session, ...s]);
        targetChatId = session.id;
        navigate(`/chat/${session.id}`, { replace: true });
      } catch (err) {
        setError(extractErrorMessage(err));
        setCreating(false);
        return;
      } finally {
        setCreating(false);
      }
    }

    const optimisticUser = {
      id: `optimistic-${Date.now()}`,
      role: "USER",
      message: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((m) => [...m, optimisticUser]);
    setDraft("");
    setSending(true);

    try {
      const response = await chatApi.sendMessage(targetChatId, text);
      setMessages((m) => [
        ...m.filter((x) => x.id !== optimisticUser.id),
        response.userMessage,
        response.assistantMessage,
      ]);
      setSessions((s) => {
        const next = s.map((x) => (x.id === response.session.id ? response.session : x));
        return [response.session, ...next.filter((x) => x.id !== response.session.id)];
      });
    } catch (err) {
      setError(extractErrorMessage(err));
      setMessages((m) => m.filter((x) => x.id !== optimisticUser.id));
      setDraft(text);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl flex flex-col md:flex-row">
      <ChatSidebar
        sessions={sessions}
        activeChatId={chatId}
        onSelect={(id) => navigate(`/chat/${id}`)}
        onCreate={handleCreate}
        onRename={handleRename}
        onDelete={handleDelete}
        creating={creating}
      />

      <div className="flex-1 flex flex-col h-[calc(100vh-5rem)]">
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-4">
          {error && <Notice type="error">{error}</Notice>}

          {!chatId && !loadingHistory && (
            <div className="h-full flex flex-col items-center justify-center text-center gap-6 py-16">
              <AstroWheel size={220} />
              <div>
                <h2 className="font-display text-2xl">Ask Lomas anything</h2>
                <p className="text-stone mt-2 max-w-sm">
                  Start a new conversation about your chart, your day, or whatever's on your mind.
                </p>
              </div>
            </div>
          )}

          {loadingHistory && <p className="text-center text-stone-light text-sm">Loading conversation…</p>}

          {messages.map((m) => (
            <MessageBubble key={m.id} id={m.id} role={m.role} message={m.message} chatSessionId={chatId} />
          ))}

          {sending && (
            <div className="flex justify-start">
              <div className="bg-cream-soft border border-line rounded-2xl rounded-bl-md px-4 py-3 text-stone text-sm">
                Reading your chart…
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSend} className="border-t border-line p-4 flex gap-3 bg-cream">
          <input
            className="flex-1 rounded-full border border-line bg-paper px-5 py-3 text-[15px] outline-none focus:border-gold"
            placeholder="Ask about your day, your chart, or what's on your mind…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={8000}
          />
          <button
            type="submit"
            disabled={sending || !draft.trim()}
            className="rounded-full bg-ink text-cream-soft w-12 h-12 flex items-center justify-center hover:bg-ink-soft transition-colors disabled:opacity-50"
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
