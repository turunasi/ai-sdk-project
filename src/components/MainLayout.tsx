import { auth } from "@/features/auth/lib/auth";
import { prisma } from "@/features/database";
import { Sidebar } from "@/components/Sidebar";
import { UserSidebarContent } from "@/features/auth/components/UserSidebarContent";
import { ChatHistory } from "@/features/chat";

async function getChatHistory(userId: string) {
  const conversations = await prisma.conversation.findMany({
    where: { userId },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      title: true,
    },
  });
  return conversations;
}

interface MainLayoutProps {
  children: React.ReactNode;
}

export async function MainLayout({ children }: MainLayoutProps) {
  const session = await auth();
  const history = session?.user?.id
    ? await getChatHistory(session.user.id)
    : [];

  return (
    <div className="flex h-screen bg-white dark:bg-zinc-950">
      <Sidebar>
        <div className="flex h-full flex-col">
          <ChatHistory history={history} />
          <UserSidebarContent session={session} />
        </div>
      </Sidebar>
      {children}
    </div>
  );
}
