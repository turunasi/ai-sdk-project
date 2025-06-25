// src/app/api/chat/history/__tests__/route.test.ts
import { POST } from "../route";
import { auth } from "@/features/auth/lib/auth";
import { prisma } from "@/features/database";

// Mock auth and prisma
jest.mock("@/features/auth/lib/auth", () => ({
  auth: jest.fn(),
}));
jest.mock("@/features/database", () => ({
  prisma: {
    conversation: {
      update: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(), // Not directly used in POST, but good to mock if other tests need it
    },
  },
}));

describe("POST /api/chat/history", () => {
  const mockAuth = auth as jest.Mock;
  const mockPrismaConversationUpdate = prisma.conversation.update as jest.Mock;
  const mockPrismaConversationCreate = prisma.conversation.create as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if user is unauthorized", async () => {
    mockAuth.mockResolvedValue(null);

    const request = new Request("http://localhost/api/chat/history", {
      method: "POST",
      body: JSON.stringify({
        userMessage: "test",
        assistantMessage: "test",
        conversationId: "123",
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error).toBe("Unauthorized");
  });

  it("should update an existing conversation with new messages", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user123" } });
    mockPrismaConversationUpdate.mockResolvedValue({}); // Mock successful update

    const requestBody = {
      userMessage: "Hello user",
      assistantMessage: "Hello AI",
      conversationId: "conv123",
    };
    const request = new Request("http://localhost/api/chat/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.conversationId).toBe("conv123");
    expect(mockPrismaConversationUpdate).toHaveBeenCalledWith({
      where: { id: "conv123" },
      data: {
        messages: {
          createMany: {
            data: [
              { role: "user", content: "Hello user" },
              { role: "assistant", content: "Hello AI" },
            ],
          },
        },
      },
    });
  });

  it("should create a new conversation if no conversationId is provided", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user123" } });
    mockPrismaConversationCreate.mockResolvedValue({ id: "newConvId" }); // Mock successful creation

    const requestBody = {
      userMessage: "First message",
      assistantMessage: "AI response",
      conversationId: null, // No conversationId
    };
    const request = new Request("http://localhost/api/chat/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.conversationId).toBe("newConvId");
    expect(mockPrismaConversationCreate).toHaveBeenCalledWith({
      data: {
        userId: "user123",
        title: "First message", // Takes first 30 chars of user message
        messages: {
          create: [
            { role: "user", content: "First message" },
            { role: "assistant", content: "AI response" },
          ],
        },
      },
    });
  });

  it("should return 400 if request body is invalid", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user123" } });

    const request = new Request("http://localhost/api/chat/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userMessage: "test" }), // Missing assistantMessage
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Invalid request body");
  });

  it("should return 500 if an unexpected error occurs", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user123" } });
    mockPrismaConversationUpdate.mockRejectedValue(new Error("DB error"));

    const requestBody = {
      userMessage: "Hello user",
      assistantMessage: "Hello AI",
      conversationId: "conv123",
    };
    const request = new Request("http://localhost/api/chat/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe("Internal Server Error");
  });
});
