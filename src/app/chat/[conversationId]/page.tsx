import { auth } from "@/features/auth/lib/auth";
import { notFound } from "next/navigation";
import { prisma } from "@/features/database";
import type { Message } from "ai";
import { MainLayout } from "@/components/MainLayout";
import { ChatPageContent } from "./ChatPageContent";

async function getChat(conversationId: string, userId: string) {
  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
      userId: userId,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
  return conversation;
}

export default async function ConversationPage({
  params,
}: {
  params: { conversationId: string };
}) {
  const session = await auth();
  if (!session?.user?.id) {
    // ログインしていない場合は404を返すか、ログインページにリダイレクトします
    notFound();
  }

  // Ensure params is fully resolved before accessing its properties
  const resolvedParams = await Promise.resolve(params);
  const chat = await getChat(resolvedParams.conversationId, session.user.id);

  if (!chat) {
    notFound();
  }

  const initialMessages = chat.messages.map(
    (msg) => ({ id: msg.id, role: msg.role, content: msg.content }) as Message,
  );

  return (
    <MainLayout>
      <ChatPageContent
        conversationId={chat.id}
        initialMessages={initialMessages}
      />
    </MainLayout>
  );
}
