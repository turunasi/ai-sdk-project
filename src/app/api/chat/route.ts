import { streamText } from "ai";
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

    const { messages } = await req.json();

    const result = await streamText({
      model: google("models/gemini-2.0-flash-lite"),
      messages,
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
