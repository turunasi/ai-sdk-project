// src/features/chat/components/__tests__/ChatHistory.test.tsx
import { render, screen } from "@testing-library/react";
import { ChatHistory } from "../ChatHistory";
import Link from "next/link"; // Mock Link
import { NewChatButton } from "../NewChatButton"; // Mock NewChatButton

// Mock next/link
jest.mock("next/link", () => ({
  __esModule: true,
  default: jest.fn(({ children, href }) => (
    <a href={href} data-testid={`link-${href}`}>
      {children}
    </a>
  )),
}));

// Mock NewChatButton
jest.mock("../NewChatButton", () => ({
  NewChatButton: () => (
    <button data-testid="new-chat-button">Mock New Chat</button>
  ),
}));

describe("ChatHistory", () => {
  it("renders NewChatButton", () => {
    render(<ChatHistory history={[]} />);
    expect(screen.getByTestId("new-chat-button")).toBeInTheDocument();
  });

  it("renders chat history links correctly", () => {
    const mockHistory = [
      { id: "1", title: "Chat 1 Title" },
      { id: "2", title: "Another Chat" },
      { id: "3", title: "Long Chat Title That Should Be Truncated" },
    ];

    render(<ChatHistory history={mockHistory} />);

    expect(screen.getByText("Chat 1 Title")).toBeInTheDocument();
    expect(screen.getByTestId("link-/chat/1")).toHaveAttribute(
      "href",
      "/chat/1",
    );

    expect(screen.getByText("Another Chat")).toBeInTheDocument();
    expect(screen.getByTestId("link-/chat/2")).toHaveAttribute(
      "href",
      "/chat/2",
    );

    expect(
      screen.getByText("Long Chat Title That Should Be Truncated"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("link-/chat/3")).toHaveAttribute(
      "href",
      "/chat/3",
    );
  });

  it("renders no chat history when history is empty", () => {
    render(<ChatHistory history={[]} />);
    // NewChatButtonは表示されるが、履歴のリンクは表示されないことを確認
    expect(screen.queryByTestId(/link-\/chat\//)).not.toBeInTheDocument();
  });
});
