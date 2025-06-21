import { render, screen } from "@testing-library/react";
import ChatPage from "@/app/page";

// Mock child components
jest.mock("@/features/auth/components/UserSidebarContent", () => ({
  UserSidebarContent: () => (
    <div data-testid="user-sidebar-content">Mocked Sidebar</div>
  ),
}));

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
  it("renders the chat page with sidebar, header, and initial message", () => {
    render(<ChatPage />);

    // Check for the mocked sidebar
    expect(screen.getByTestId("user-sidebar-content")).toBeInTheDocument();

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
