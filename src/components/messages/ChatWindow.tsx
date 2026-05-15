"use client";

import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { getPusherClient } from "@/lib/pusher-client";
import { sendMessageAction } from "@/server/actions/message.action";
import { notify } from "@/lib/toast";

type MessageData = {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  createdAt: string;
};

type InitialMessage = {
  id: string;
  content: string;
  senderId: string;
  createdAt: Date;
  sender: { id: string; name: string | null; image: string | null };
};

interface Props {
  conversationId: string;
  initialMessages: InitialMessage[];
  currentUserId: string;
  propertyId: string;
}

export default function ChatWindow({
  conversationId,
  initialMessages,
  currentUserId,
  propertyId,
}: Props) {
  const [messages, setMessages] = useState<MessageData[]>(
    initialMessages.map((m) => ({
      id: m.id,
      content: m.content,
      senderId: m.senderId,
      senderName: m.sender.name ?? "User",
      createdAt: m.createdAt.toISOString(),
    }))
  );
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const pusher = getPusherClient();
    const channel = pusher.subscribe(`conversation-${conversationId}`);

    channel.bind("new-message", (data: MessageData) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === data.id)) return prev;
        return [...prev, data];
      });
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`conversation-${conversationId}`);
    };
  }, [conversationId]);

  async function handleSend() {
    const content = input.trim();
    if (!content || isSending) return;

    const optimisticId = `optimistic-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: optimisticId,
        content,
        senderId: currentUserId,
        senderName: "You",
        createdAt: new Date().toISOString(),
      },
    ]);
    setInput("");
    setIsSending(true);

    const result = await sendMessageAction(propertyId, content);
    setIsSending(false);

    if ("error" in result) {
      notify.error(result.error);
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex h-[600px] flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((msg) => {
          const isOwn = msg.senderId === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  isOwn
                    ? "bg-mosque text-white dark:bg-mosque"
                    : "bg-hint-green text-nordic dark:bg-hint-green/80 dark:text-nordic"
                }`}
              >
                <p className="leading-relaxed">{msg.content}</p>
                <p
                  className={`mt-1 text-right text-[10px] ${
                    isOwn ? "text-white/60" : "text-nordic/50"
                  }`}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-nordic/10 p-4 dark:border-white/10">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            disabled={isSending}
            className="flex-1 rounded-xl border border-nordic/20 bg-white px-4 py-2.5 text-sm text-nordic outline-none placeholder:text-nordic/40 focus:border-mosque disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-clear-day dark:placeholder:text-white/30 dark:focus:border-hint-green"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            aria-label="Send message"
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-mosque text-white transition-colors hover:bg-mosque/90 disabled:opacity-40 dark:bg-hint-green dark:text-nordic dark:hover:bg-hint-green/90"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
