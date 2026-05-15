import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import {
  getConversationsByUserId,
  getMessagesByConversationId,
} from "@/server/repositories/message.repository";
import Navbar from "@/components/sections/Navbar";
import ConversationList from "@/components/messages/ConversationList";
import ChatWindow from "@/components/messages/ChatWindow";

interface Props {
  params: Promise<{ conversationId: string }>;
}

export default async function ConversationPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/messages");

  const { conversationId } = await params;

  const [conversations, data] = await Promise.all([
    getConversationsByUserId(session.user.id),
    getMessagesByConversationId(conversationId, session.user.id),
  ]);

  if (!data) notFound();

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 font-sf text-2xl font-light text-nordic dark:text-clear-day">
          Messages
        </h1>

        <div className="grid grid-cols-1 overflow-hidden rounded-xl border border-nordic/10 dark:border-white/10 lg:grid-cols-3">
          <ConversationList
            conversations={conversations}
            currentUserId={session.user.id}
            activeConversationId={conversationId}
          />

          <div className="border-t border-nordic/10 dark:border-white/10 lg:col-span-2 lg:border-l lg:border-t-0">
            <ChatWindow
              conversationId={conversationId}
              initialMessages={data.messages}
              currentUserId={session.user.id}
              propertyId={data.conversation.propertyId}
            />
          </div>
        </div>
      </main>
    </>
  );
}
