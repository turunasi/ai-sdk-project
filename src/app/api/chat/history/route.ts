import { NextResponse } from "next/server";
import { auth } from "@/features/auth/lib/auth";
import { prisma } from "@/features/database";
import { z } from "zod";

const saveChatSchema = z.object({
  userMessage: z.string(),
  assistantMessage: z.string(),
  conversationId: z.string(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    const userId = session.user.id;

    const json = await req.json();

    const { userMessage, assistantMessage, conversationId } =
      saveChatSchema.parse(json);

    if (conversationId) {
      // 既存の会話にメッセージを追加
      await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          messages: {
            createMany: {
              data: [
                { role: "user", content: userMessage },
                {
                  role: "assistant",
                  content: assistantMessage,
                },
              ],
            },
          },
        },
      });
      return NextResponse.json({ conversationId });
    } else {
      // 新しい会話を作成
      const newConversation = await prisma.conversation.create({
        data: {
          userId,
          title: userMessage.substring(0, 30), // 最初の30文字をタイトルに
          messages: {
            create: [
              { role: "user", content: userMessage },
              {
                role: "assistant",
                content: assistantMessage,
              },
            ],
          },
        },
      });
      return NextResponse.json({ conversationId: newConversation.id });
    }
  } catch (error) {
    console.error("[SAVE CHAT ERROR]", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
      },
    );
  }
}
