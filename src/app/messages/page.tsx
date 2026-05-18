import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getConversationsByUserId } from "@/server/repositories/message.repository";
import Navbar from "@/components/sections/Navbar";
import ConversationList from "@/components/messages/ConversationList";
import { MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Messages",
};

export default async function MessagesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/messages");

  const conversations = await getConversationsByUserId(session.user.id);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 font-sf text-2xl font-light text-nordic dark:text-clear-day">
          Messages
        </h1>

        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-nordic/10 bg-white/60 py-20 dark:border-white/10 dark:bg-white/5">
            <MessageCircle size={40} className="mb-4 text-nordic/20 dark:text-white/20" />
            <p className="text-sm text-nordic-muted dark:text-clear-day/60">No conversations yet</p>
            <p className="mt-1 text-xs text-nordic/40 dark:text-white/30">
              Contact a property owner to start chatting
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 overflow-hidden rounded-xl border border-nordic/10 dark:border-white/10 lg:grid-cols-3">
            <ConversationList conversations={conversations} currentUserId={session.user.id} />

            <div className="hidden border-l border-nordic/10 dark:border-white/10 lg:col-span-2 lg:flex lg:items-center lg:justify-center">
              <div className="text-center">
                <MessageCircle
                  size={40}
                  className="mx-auto mb-3 text-nordic/20 dark:text-white/20"
                />
                <p className="text-sm font-medium text-nordic/50 dark:text-white/40">
                  Select a conversation to start chatting
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
