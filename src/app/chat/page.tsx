import { redirect } from "next/navigation";
import { auth } from "@/features/auth/lib/auth";
import { prisma } from "@/features/database";

export default async function NewChatPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const newConversation = await prisma.conversation.create({
    data: {
      userId: session.user.id,
      title: "New Chat", // デフォルトのタイトル
    },
    select: {
      id: true,
    },
  });

  redirect(`/chat/${newConversation.id}`);
}
