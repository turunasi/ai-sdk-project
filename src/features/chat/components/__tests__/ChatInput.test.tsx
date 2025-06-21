import { render, screen, fireEvent } from "@testing-library/react";
import { ChatInput } from "../ChatInput";

describe("ChatInput", () => {
  const mockHandleInputChange = jest.fn();
  const mockHandleSubmit = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with initial state", () => {
    render(
      <ChatInput
        input=""
        handleInputChange={mockHandleInputChange}
        handleSubmit={mockHandleSubmit}
        isLoading={false}
      />,
    );

    const inputElement = screen.getByPlaceholderText("AIにメッセージを送信...");
    const buttonElement = screen.getByRole("button", { name: "送信" });

    expect(inputElement).toBeInTheDocument();
    expect(inputElement).not.toBeDisabled();
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toBeDisabled(); // Button should be disabled when input is empty
  });

  it("disables input and button when isLoading is true", () => {
    render(
      <ChatInput
        input=""
        handleInputChange={mockHandleInputChange}
        handleSubmit={mockHandleSubmit}
        isLoading={true}
      />,
    );

    expect(
      screen.getByPlaceholderText("AIにメッセージを送信..."),
    ).toBeDisabled();
    expect(screen.getByRole("button", { name: "送信" })).toBeDisabled();
  });

  it("enables button when input is not empty and not loading", () => {
    render(
      <ChatInput
        input="test message"
        handleInputChange={mockHandleInputChange}
        handleSubmit={mockHandleSubmit}
        isLoading={false}
      />,
    );

    const buttonElement = screen.getByRole("button", { name: "送信" });
    expect(buttonElement).not.toBeDisabled();
  });
});
