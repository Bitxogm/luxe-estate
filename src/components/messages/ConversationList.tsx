"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

type Conversation = {
  id: string;
  property: { title: string; imageUrl: string; slug: string };
  messages: { content: string; createdAt: Date }[];
  buyer: { id: string; name: string | null; image: string | null };
  owner: { id: string; name: string | null; image: string | null };
};

interface Props {
  conversations: Conversation[];
  currentUserId: string;
  activeConversationId?: string;
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export default function ConversationList({
  conversations,
  currentUserId,
  activeConversationId,
}: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="flex flex-col divide-y divide-nordic/10 bg-white/60 dark:divide-white/10 dark:bg-white/5">
      {conversations.map((c) => {
        const other = c.buyer.id === currentUserId ? c.owner : c.buyer;
        const lastMessage = c.messages[0];
        const isActive = c.id === activeConversationId;

        return (
          <Link
            key={c.id}
            href={`/messages/${c.id}`}
            className={`flex items-start gap-3 px-4 py-4 transition-colors hover:bg-hint-green/30 dark:hover:bg-white/5 ${
              isActive ? "bg-hint-green/40 dark:bg-white/10" : ""
            }`}
          >
            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg">
              <Image
                src={c.property.imageUrl}
                alt={c.property.title}
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-semibold text-nordic dark:text-clear-day">
                  {other.name ?? "User"}
                </p>
                {lastMessage && (
                  <span className="flex-shrink-0 text-xs text-nordic/40 dark:text-white/40">
                    {mounted ? timeAgo(lastMessage.createdAt) : ""}
                  </span>
                )}
              </div>
              <p className="truncate text-xs text-nordic/50 dark:text-white/40">
                {c.property.title}
              </p>
              {lastMessage && (
                <p className="mt-0.5 truncate text-xs text-nordic-muted dark:text-clear-day/60">
                  {lastMessage.content}
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
