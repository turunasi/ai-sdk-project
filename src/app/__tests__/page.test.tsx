import { render, screen } from "@testing-library/react";
import ChatPage from "@/app/page";

// Mock the useChat hook from @ai-sdk/react
jest.mock("@ai-sdk/react", () => ({
  useChat: () => ({
    messages: [],
    input: "",
    handleInputChange: jest.fn(),
    handleSubmit: jest.fn(),
    isLoading: false,
  }),
}));

describe("ChatPage", () => {
  it("renders the chat page with header and initial message", () => {
    render(<ChatPage />);

    // Check for the header
    expect(
      screen.getByRole("heading", { name: /AI Chat/i }),
    ).toBeInTheDocument();

    // Check for the initial prompt message when there are no chat messages
    expect(screen.getByText("AIに話しかけてみましょう！")).toBeInTheDocument();

    // Check for the input field
    expect(
      screen.getByPlaceholderText("AIにメッセージを送信..."),
    ).toBeInTheDocument();
  });
});
