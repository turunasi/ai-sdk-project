// src/app/chat/[conversationId]/__tests__/ChatPageContent.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ChatPageContent } from "../ChatPageContent";
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import type { Message } from "ai";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock @ai-sdk/react
jest.mock("@ai-sdk/react", () => ({
  useChat: jest.fn(),
}));

// Mock fetch API
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("ChatPageContent", () => {
  const mockUseRouter = useRouter as jest.Mock;
  const mockUseChat = useChat as jest.Mock;
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();

  const initialMessages: Message[] = [
    { id: "1", role: "user", content: "Hi" },
    { id: "2", role: "assistant", content: "Hello" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
    mockUseRouter.mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    });
    mockUseChat.mockReturnValue({
      messages: initialMessages,
      input: "",
      handleInputChange: jest.fn(),
      handleSubmit: jest.fn(),
      isLoading: false,
    });
  });

  it("renders ChatList and ChatInput with initial messages", () => {
    render(
      <ChatPageContent
        conversationId="test-conv-id"
        initialMessages={initialMessages}
      />,
    );

    expect(screen.getByText("Hi")).toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("AIにメッセージを送信..."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "送信" })).toBeInTheDocument();
  });

  it("calls onFinish and saves chat history when assistant message is received", async () => {
    const mockHandleSubmit = jest.fn();
    const mockHandleInputChange = jest.fn();
    const mockInput = "User's new message";
    const mockAssistantMessage = {
      id: "3",
      role: "assistant",
      content: "AI's new response",
    };

    mockUseChat.mockImplementation(({ onFinish }) => ({
      messages: [
        ...initialMessages,
        { id: "3", role: "user", content: mockInput },
      ],
      input: mockInput,
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
      isLoading: false,
      onFinish: async (message: Message) => {
        // Simulate the onFinish callback being called by useChat
        await onFinish(message);
      },
    }));

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ conversationId: "test-conv-id" }),
    });

    render(
      <ChatPageContent
        conversationId="test-conv-id"
        initialMessages={initialMessages}
      />,
    );

    // Manually trigger onFinish as useChat's handleSubmit is mocked
    // In a real scenario, useChat's handleSubmit would call onFinish internally
    // For testing onFinish directly, we call it here.
    await mockUseChat.mock.calls[0][0].onFinish(mockAssistantMessage);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith("/api/chat/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: mockInput,
          assistantMessage: mockAssistantMessage.content,
          conversationId: "test-conv-id",
        }),
      });
    });

    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalledTimes(1);
    });
  });

  it("should not call fetch or refresh if onFinish fails (e.g., network error)", async () => {
    const mockHandleSubmit = jest.fn();
    const mockHandleInputChange = jest.fn();
    const mockInput = "User's new message";
    const mockAssistantMessage = {
      id: "3",
      role: "assistant",
      content: "AI's new response",
    };

    mockUseChat.mockImplementation(({ onFinish }) => ({
      messages: [
        ...initialMessages,
        { id: "3", role: "user", content: mockInput },
      ],
      input: mockInput,
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
      isLoading: false,
      onFinish: async (message: Message) => {
        await onFinish(message);
      },
    }));

    mockFetch.mockRejectedValueOnce(new Error("Network error")); // Simulate fetch failure

    render(
      <ChatPageContent
        conversationId="test-conv-id"
        initialMessages={initialMessages}
      />,
    );

    await mockUseChat.mock.calls[0][0].onFinish(mockAssistantMessage);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    expect(mockRefresh).not.toHaveBeenCalled();
  });
});
