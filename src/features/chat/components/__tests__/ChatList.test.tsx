import { render, screen } from "@testing-library/react";
import { ChatList } from "../ChatList";
import React from "react";
import { type Message } from "ai/react";

describe("ChatList", () => {
  it("renders the initial message when no messages are provided", () => {
    render(<ChatList messages={[]} />);

    expect(screen.getByText("AIに話しかけてみましょう！")).toBeInTheDocument();
  });

  it("renders multiple messages correctly", () => {
    const messages: Message[] = [
      {
        id: "1",
        role: "user",
        content: "Hello from user!",
        createdAt: new Date(),
      },
      {
        id: "2",
        role: "assistant",
        content: "Hello from AI!",
        createdAt: new Date(),
      },
      {
        id: "3",
        role: "user",
        content: "Another message.",
        createdAt: new Date(),
      },
    ];

    render(<ChatList messages={messages} />);

    expect(screen.getByText("Hello from user!")).toBeInTheDocument();
    expect(screen.getByText("Hello from AI!")).toBeInTheDocument();
    expect(screen.getByText("Another message.")).toBeInTheDocument();
  });

  it("should scroll to the bottom when new messages are added", async () => {
    const { rerender, container } = render(<ChatList messages={[]} />);

    // The container is a div, its first child is the div from ChatList
    const listElement = container.firstChild as HTMLDivElement;
    expect(listElement).not.toBeNull();

    // Initial state
    expect(listElement.scrollTop).toBe(0);

    // Define scrollHeight before rerendering
    Object.defineProperty(listElement, "scrollHeight", {
      configurable: true,
      value: 500,
    });

    const messages: Message[] = [
      { id: "1", role: "user", content: "Hello", createdAt: new Date() },
    ];
    rerender(<ChatList messages={messages} />);

    // The useEffect should have updated scrollTop to scrollHeight
    expect(listElement.scrollTop).toBe(500);
  });
});
