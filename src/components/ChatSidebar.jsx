import { useState } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";

export default function ChatSidebar({
  sessions,
  activeChatId,
  onSelect,
  onCreate,
  onRename,
  onDelete,
  creating,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  function startEdit(session) {
    setEditingId(session.id);
    setEditValue(session.title);
  }

  function submitEdit(id) {
    if (editValue.trim()) onRename(id, editValue.trim());
    setEditingId(null);
  }

  return (
    <aside className="w-full md:w-72 shrink-0 border-r border-line md:h-[calc(100vh-5rem)] flex flex-col">
      <div className="p-4">
        <button
          onClick={onCreate}
          disabled={creating}
          className="w-full flex items-center justify-center gap-2 rounded-full bg-ink text-cream-soft py-2.5 text-sm hover:bg-ink-soft transition-colors disabled:opacity-50"
        >
          <Plus size={16} /> New chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
        {sessions.length === 0 && (
          <p className="text-sm text-stone-light px-3 py-6 text-center">
            No conversations yet. Start one to meet your astrologer.
          </p>
        )}
        {sessions.map((s) => (
          <div
            key={s.id}
            className={`group flex items-center gap-1 rounded-xl px-3 py-2.5 cursor-pointer transition-colors ${
              s.id === activeChatId ? "bg-gold-soft/50" : "hover:bg-cream-soft"
            }`}
            onClick={() => editingId !== s.id && onSelect(s.id)}
          >
            {editingId === s.id ? (
              <>
                <input
                  autoFocus
                  className="flex-1 bg-paper border border-gold rounded-lg px-2 py-1 text-sm outline-none"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitEdit(s.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <button onClick={(e) => (e.stopPropagation(), submitEdit(s.id))} className="text-gold">
                  <Check size={15} />
                </button>
                <button
                  onClick={(e) => (e.stopPropagation(), setEditingId(null))}
                  className="text-stone"
                >
                  <X size={15} />
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm truncate">{s.title}</span>
                <button
                  onClick={(e) => (e.stopPropagation(), startEdit(s))}
                  className="opacity-0 group-hover:opacity-100 text-stone hover:text-ink transition-opacity"
                  aria-label="Rename chat"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={(e) => (e.stopPropagation(), onDelete(s.id))}
                  className="opacity-0 group-hover:opacity-100 text-stone hover:text-clay transition-opacity"
                  aria-label="Delete chat"
                >
                  <Trash2 size={13} />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
