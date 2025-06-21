import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
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
