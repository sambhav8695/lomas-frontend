import MessageFeedback from "./MessageFeedback";

export default function MessageBubble({ id, role, message, chatSessionId }) {
  const isUser = role === "USER";
  const isOptimistic = typeof id === "string" && id.startsWith("optimistic-");

  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-ink text-cream-soft rounded-br-md"
            : "bg-cream-soft border border-line rounded-bl-md"
        }`}
      >
        {message}
      </div>
      {!isUser && !isOptimistic && (
        <MessageFeedback chatMessageId={id} chatSessionId={chatSessionId} />
      )}
    </div>
  );
}
