import { render, screen } from "@testing-library/react";
import { ChatMessage } from "../ChatMessage";
import { type Message } from "ai/react";
import "@testing-library/jest-dom";

describe("ChatMessage", () => {
  it("renders a user message correctly", () => {
    const userMessage: Message = {
      id: "1",
      role: "user",
      content: "Hello, AI!",
      createdAt: new Date(),
    };

    render(<ChatMessage message={userMessage} />);

    // Check for the user avatar/initial
    expect(screen.getByText("U")).toBeInTheDocument();
    // Check for the message content
    expect(screen.getByText("Hello, AI!")).toBeInTheDocument();
  });

  it("renders an AI message correctly", () => {
    const aiMessage: Message = {
      id: "2",
      role: "assistant",
      content: "Hello, User!",
      createdAt: new Date(),
    };

    render(<ChatMessage message={aiMessage} />);

    // Check for the AI avatar/initial
    expect(screen.getByText("AI")).toBeInTheDocument();
    // Check for the message content
    expect(screen.getByText("Hello, User!")).toBeInTheDocument();
  });

  it("renders an empty message correctly", () => {
    const emptyMessage: Message = {
      id: "4",
      role: "user",
      content: "",
      createdAt: new Date(),
    };

    render(<ChatMessage message={emptyMessage} />);

    // Check for the user avatar/initial
    expect(screen.getByText("U")).toBeInTheDocument();
    // This test mainly ensures rendering an empty message does not break the component.
  });
});
