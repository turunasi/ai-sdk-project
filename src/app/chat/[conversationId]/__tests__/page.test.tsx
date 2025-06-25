// src/app/chat/[conversationId]/__tests__/page.test.tsx
import ConversationPage from "../page";
import { auth } from "@/features/auth/lib/auth";
import { prisma } from "@/features/database";
import { notFound } from "next/navigation";
import { render, screen } from "@testing-library/react";
import { ChatPageContent } from "../ChatPageContent";

// Mock auth, prisma, and next/navigation
jest.mock("@/features/auth/lib/auth", () => ({
  auth: jest.fn(),
}));
jest.mock("@/features/database", () => ({
  prisma: {
    conversation: {
      findUnique: jest.fn(),
    },
  },
}));
jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

// Mock ChatPageContent as it's a client component and its internal logic is tested separately
jest.mock("../ChatPageContent", () => ({
  ChatPageContent: jest.fn(({ conversationId, initialMessages }) => (
    <div data-testid="chat-page-content">
      Chat Content for {conversationId}
      {initialMessages.map((msg) => (
        <p key={msg.id}>{msg.content}</p>
      ))}
    </div>
  )),
}));

// Mock MainLayout to prevent its async operations (like fetching history) from running
jest.mock("@/components/MainLayout", () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

describe("ConversationPage", () => {
  const mockAuth = auth as jest.Mock;
  const mockPrismaConversationFindUnique = prisma.conversation
    .findUnique as jest.Mock;
  const mockNotFound = notFound as jest.Mock;
  const MockChatPageContent = ChatPageContent as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    MockChatPageContent.mockClear(); // Clear mock calls for the component itself
  });

  it("should call notFound if user is not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    await expect(
      ConversationPage({ params: { conversationId: "test-id" } }),
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(mockAuth).toHaveBeenCalledTimes(1);
    expect(mockNotFound).toHaveBeenCalledTimes(1);
    expect(mockPrismaConversationFindUnique).not.toHaveBeenCalled();
    expect(MockChatPageContent).not.toHaveBeenCalled();
  });

  it("should call notFound if conversation is not found for the user", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user123" } });
    mockPrismaConversationFindUnique.mockResolvedValue(null);

    await expect(
      ConversationPage({ params: { conversationId: "non-existent-id" } }),
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(mockAuth).toHaveBeenCalledTimes(1);
    expect(mockPrismaConversationFindUnique).toHaveBeenCalledTimes(1);
    expect(mockPrismaConversationFindUnique).toHaveBeenCalledWith({
      where: { id: "non-existent-id", userId: "user123" },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
    expect(mockNotFound).toHaveBeenCalledTimes(1);
    expect(MockChatPageContent).not.toHaveBeenCalled();
  });

  it("should render ChatPageContent with initial messages if conversation is found", async () => {
    const mockConversation = {
      id: "found-conv-id",
      userId: "user123",
      title: "Test Chat",
      messages: [
        { id: "msg1", role: "user", content: "Hello" },
        { id: "msg2", role: "assistant", content: "Hi there" },
      ],
    };
    mockAuth.mockResolvedValue({ user: { id: "user123" } });
    mockPrismaConversationFindUnique.mockResolvedValue(mockConversation);

    // Render the server component
    const Page = await ConversationPage({
      params: { conversationId: "found-conv-id" },
    });
    render(Page);

    // auth() is called once in ConversationPage. MainLayout is mocked, so its auth() call is skipped.
    expect(mockAuth).toHaveBeenCalledTimes(1);
    expect(mockPrismaConversationFindUnique).toHaveBeenCalledTimes(1);
    expect(mockPrismaConversationFindUnique).toHaveBeenCalledWith({
      where: { id: "found-conv-id", userId: "user123" },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
    expect(mockNotFound).not.toHaveBeenCalled();

    // Check if ChatPageContent was rendered with correct props
    expect(MockChatPageContent).toHaveBeenCalledTimes(1);
    expect(MockChatPageContent).toHaveBeenCalledWith(
      expect.objectContaining({
        conversationId: "found-conv-id",
        initialMessages: [
          { id: "msg1", role: "user", content: "Hello" },
          { id: "msg2", role: "assistant", content: "Hi there" },
        ],
      }),
      {}, // React props object, second argument is context
    );
    expect(screen.getByTestId("chat-page-content")).toBeInTheDocument();
    expect(
      screen.getByText("Chat Content for found-conv-id"),
    ).toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("Hi there")).toBeInTheDocument();
  });
});
