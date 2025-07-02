import { NextResponse } from "next/server";
import { auth } from "@/features/auth/lib/auth";
import { z } from "zod";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

const executeToolSchema = z.object({
  toolName: z.string(),
  args: z.record(z.unknown()), // Arguments can be of any type
});

export async function POST(req: Request) {
  // clientをtryブロックの外で宣言し、finallyで参照できるようにする
  let client: Client | undefined;
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // リクエストごとにtransportとclientをインスタンス化する
    // これにより、ホットリロードや複数リクエストでコネクションが再利用されることによるエラーを防ぐ
    const transport = new SSEClientTransport(
      new URL(process.env.MCP_SERVER_URL || "http://127.0.0.1:8000/sse"),
    );
    client = new Client({
      name: "example-client",
      version: "1.0.0",
    });

    await client.connect(transport);

    const json = await req.json();
    const { toolName, args } = executeToolSchema.parse(json);

    const result = await client.callTool({
      name: toolName,
      arguments: args,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: error.flatten() },
        { status: 400 },
      );
    }

    console.error("[API_MCP_TOOL_POST]", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    // clientが正常にインスタンス化されていれば、接続を閉じる
    if (client) {
      await client.close();
    }
  }
}
