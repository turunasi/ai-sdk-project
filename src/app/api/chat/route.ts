import { experimental_createMCPClient, streamText } from "ai";
import { google } from "@ai-sdk/google";
import { NextResponse } from "next/server";
import { auth } from "@/features/auth/lib/auth";

// PrismaをNode.jsランタイムで利用するため、Edge Runtimeを無効化します。
// Prisma AccelerateやData Proxyを利用する場合は、この行を有効にしても構いません。
// export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const mcpClient = await experimental_createMCPClient({
      transport: {
        type: "sse",
        url: process.env.MCP_SERVER_URL || "http://127.0.0.1:8000/sse",
      },
    });

    const { messages } = await req.json();

    // Schema Discovery を使用して MCP サーバーからツール定義を取得
    const tools = await mcpClient.tools();

    const result = await streamText({
      model: google("models/gemini-2.0-flash-lite"),
      messages,
      tools,
      onFinish: () => {
        // ストリーミング応答が完了したら、必ず MCP クライアントの接続を閉じる
        mcpClient.close();
      },
    });

    return result.toDataStreamResponse();
  } catch (error: unknown) {
    console.error("[API Error]", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";

    return new NextResponse(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
