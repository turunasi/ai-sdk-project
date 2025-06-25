// src/app/chat/__tests__/page.test.tsx
import NewChatPage from "../page";
import { auth } from "@/features/auth/lib/auth";
import { prisma } from "@/features/database";
import { redirect } from "next/navigation";

// Mock auth, prisma, and next/navigation
jest.mock("@/features/auth/lib/auth", () => ({
  auth: jest.fn(),
}));
jest.mock("@/features/database", () => ({
  prisma: {
    conversation: {
      create: jest.fn(),
    },
  },
}));
jest.mock("next/navigation", () => ({
  redirect: jest.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT: ${url}`);
  }),
}));

describe("NewChatPage", () => {
  const mockAuth = auth as jest.Mock;
  const mockPrismaConversationCreate = prisma.conversation.create as jest.Mock;
  const mockRedirect = redirect as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should redirect to login if user is not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    await expect(NewChatPage()).rejects.toThrow("NEXT_REDIRECT: /login");

    expect(mockAuth).toHaveBeenCalledTimes(1);
    expect(mockRedirect).toHaveBeenCalledTimes(1);
    expect(mockPrismaConversationCreate).not.toHaveBeenCalled();
  });

  it("should create a new conversation and redirect to its chat page if user is authenticated", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user123" } });
    mockPrismaConversationCreate.mockResolvedValue({ id: "newConvId" });

    // Mock Date to ensure consistent title for testing
    const mockDate = new Date("2024-05-21T10:00:00Z");
    const originalDate = global.Date;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    global.Date = jest.fn(() => mockDate);
    global.Date.toLocaleString = jest.fn(() => "2024/5/21 19:00:00"); // Example for 'ja-JP' locale

    await expect(NewChatPage()).rejects.toThrow(
      "NEXT_REDIRECT: /chat/newConvId",
    );

    expect(mockAuth).toHaveBeenCalledTimes(1);
    expect(mockPrismaConversationCreate).toHaveBeenCalledTimes(1);
    expect(mockPrismaConversationCreate).toHaveBeenCalledWith({
      data: {
        userId: "user123",
        title: "New Chat - 2024/5/21 19:00:00",
      },
      select: {
        id: true,
      },
    });
    expect(mockRedirect).toHaveBeenCalledTimes(1);

    // Restore original Date
    global.Date = originalDate;
  });
});
