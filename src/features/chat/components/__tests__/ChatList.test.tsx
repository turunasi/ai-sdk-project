import { render, screen } from "@testing-library/react";
import { ChatList } from "../ChatList";
import { type Message } from "ai/react";
import "@testing-library/jest-dom";

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
});
