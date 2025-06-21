import { POST } from "../route";
import { streamText } from "ai";
import { MockLanguageModelV1 } from "ai/test";

// Mock external dependencies
jest.mock("ai", () => ({
  streamText: jest.fn(),
}));

const mockNextResponse = jest.fn((body, init) => ({
  json: () => Promise.resolve(JSON.parse(body)),
  status: init?.status,
  headers: new Headers(init?.headers),
}));

jest.mock("next/server", () => ({ NextResponse: mockNextResponse }));

describe("POST /api/chat", () => {
  const mockRequestJson = jest.fn();
  const mockRequest = {
    json: mockRequestJson,
  } as unknown as Request;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a data stream response on success", async () => {
    const mockMessages = [{ role: "user", content: "Hello" }];
    const mockToDataStreamResponse = jest.fn(() => ({
      /* mock stream response object */
    }));

    mockRequestJson.mockResolvedValueOnce({ messages: mockMessages });
    (streamText as jest.Mock).mockResolvedValueOnce({
      toDataStreamResponse: mockToDataStreamResponse,
    });

    const mockModel = new MockLanguageModelV1({});

    jest.spyOn(require("@ai-sdk/google"), "google").mockReturnValue(mockModel);

    const response = await POST(mockRequest);

    expect(mockRequestJson).toHaveBeenCalledTimes(1);
    expect(streamText).toHaveBeenCalledTimes(1);
    expect(streamText).toHaveBeenCalledWith({
      model: "mock-model",
      messages: mockMessages,
    });
    expect(mockToDataStreamResponse).toHaveBeenCalledTimes(1);
    expect(response).toEqual(mockToDataStreamResponse());
  });

  it("should return a 500 error response when req.json() fails", async () => {
    const mockError = new Error("Invalid JSON");
    mockRequestJson.mockRejectedValueOnce(mockError);

    const response = await POST(mockRequest);

    expect(mockRequestJson).toHaveBeenCalledTimes(1);
    expect(streamText).not.toHaveBeenCalled();
    expect(mockNextResponse).toHaveBeenCalledTimes(1);
    expect(mockNextResponse).toHaveBeenCalledWith(
      JSON.stringify({ error: "Invalid JSON" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
    const jsonResponse = await (response as any).json();
    expect(jsonResponse).toEqual({ error: "Invalid JSON" });
    expect((response as any).status).toBe(500);
  });

  it("should return a 500 error response when streamText() fails", async () => {
    const mockMessages = [{ role: "user", content: "Hello" }];
    const mockError = new Error("AI service error");

    mockRequestJson.mockResolvedValueOnce({ messages: mockMessages });
    (streamText as jest.Mock).mockRejectedValueOnce(mockError);

    const response = await POST(mockRequest);

    expect(mockRequestJson).toHaveBeenCalledTimes(1);
    expect(streamText).toHaveBeenCalledTimes(1);
    expect(mockNextResponse).toHaveBeenCalledTimes(1);
    expect(mockNextResponse).toHaveBeenCalledWith(
      JSON.stringify({ error: "AI service error" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
    const jsonResponse = await (response as any).json();
    expect(jsonResponse).toEqual({ error: "AI service error" });
    expect((response as any).status).toBe(500);
  });

  it("should return a 500 error response for unknown errors", async () => {
    mockRequestJson.mockResolvedValueOnce({ messages: [] });
    (streamText as jest.Mock).mockRejectedValueOnce("unknown error type"); // Non-Error object

    const response = await POST(mockRequest);

    expect(mockNextResponse).toHaveBeenCalledWith(
      JSON.stringify({ error: "An unknown error occurred." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
    const jsonResponse = await (response as any).json();
    expect(jsonResponse).toEqual({ error: "An unknown error occurred." });
    expect((response as any).status).toBe(500);
  });
});
