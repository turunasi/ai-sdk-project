import { createDataStream, streamText } from "ai";
import { google } from "@ai-sdk/google";
import { NextResponse } from "next/server";
import { auth } from "@/features/auth/lib/auth";

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

    const { messages, data } = await req.json();
    const refContents = data?.refContents.content[0].text;
    console.log(refContents);

    const systemPrompt = `You are a faithful AI assistant that answers questions based on the provided information.
Please strictly adhere to the following rules when generating your answer.

# Rules
- You must generate your answer based **only** on the content provided in the "Reference Information" below.
- Do not include any information from your own knowledge or any assumptions.
- If the answer to the question cannot be found in the "Reference Information", you must state that "I could not find the relevant information in the provided content." without generating any speculative answer.

${
  refContents
    ? `
# Reference Information
${JSON.stringify(refContents)}`
    : ""
}`;
    const dataStream = createDataStream({
      execute: async (dataStreamWriter) => {
        try {
          if (refContents) {
            dataStreamWriter.writeMessageAnnotation({
              type: "data-ref-contents",
              id: "ref-contents-1",
              data: refContents,
            });
          }

          const result = streamText({
            model: google("models/gemini-2.0-flash-lite"),
            messages,
            system: systemPrompt,
          });

          result.mergeIntoDataStream(dataStreamWriter);
        } catch (error) {
          console.error("[API execute Error]", error);
          throw error;
        }
      },
    });

    // ストリームをレスポンスとして返す
    return new Response(dataStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Vercel-AI-Data-Stream": "v1",
      },
    });
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
