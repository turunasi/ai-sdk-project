import { POST } from "../route";
import { streamText } from "ai";
import { google } from "@ai-sdk/google";

// Mock dependencies
jest.mock("ai", () => ({
  streamText: jest.fn(),
}));

jest.mock("@ai-sdk/google", () => ({
  google: jest.fn(),
}));

describe("POST /api/chat", () => {
  const mockStreamText = streamText as jest.Mock;
  const mockGoogle = google as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a data stream response on success", async () => {
    const mockMessages = [{ role: "user", content: "Hello" }];
    const mockStreamResponse = new Response("mock stream");
    const mockResult = {
      toDataStreamResponse: () => mockStreamResponse,
    };

    mockStreamText.mockResolvedValue(mockResult);
    mockGoogle.mockReturnValue("mock-google-model");

    const request = new Request("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: mockMessages }),
    });

    const response = await POST(request);

    expect(mockGoogle).toHaveBeenCalledWith("models/gemini-2.0-flash-lite");
    expect(mockStreamText).toHaveBeenCalledWith({
      model: "mock-google-model",
      messages: mockMessages,
    });
    expect(response).toBe(mockStreamResponse);
  });

  it("should return a 500 error if request body is not valid JSON", async () => {
    const request = new Request("http://localhost/api/chat", {
      method: "POST",
      body: "not json",
    });

    const response = await POST(request);
    const responseBody = await response.json();

    expect(response.status).toBe(500);
    expect(responseBody.error).toContain("Unexpected token");
  });

  it("should return a 500 error if streamText fails", async () => {
    const mockMessages = [{ role: "user", content: "Hello" }];
    const mockError = new Error("AI service error");
    mockStreamText.mockRejectedValue(mockError);

    const request = new Request("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: mockMessages }),
    });

    const response = await POST(request);
    const responseBody = await response.json();

    expect(response.status).toBe(500);
    expect(responseBody.error).toBe("AI service error");
  });

  it("should handle unknown errors", async () => {
    const mockMessages = [{ role: "user", content: "Hello" }];
    mockStreamText.mockRejectedValue("a string error"); // Not an instance of Error

    const request = new Request("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: mockMessages }),
    });

    const response = await POST(request);
    const responseBody = await response.json();

    expect(response.status).toBe(500);
    expect(responseBody.error).toBe("An unknown error occurred.");
  });
});
