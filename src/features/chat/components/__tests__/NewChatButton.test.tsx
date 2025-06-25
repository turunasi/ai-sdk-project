// src/features/chat/components/__tests__/NewChatButton.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { NewChatButton } from "../NewChatButton";
import { useRouter } from "next/navigation";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("NewChatButton", () => {
  const mockUseRouter = useRouter as jest.Mock;
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
    });
  });

  it("renders the New Chat button", () => {
    render(<NewChatButton />);
    expect(
      screen.getByRole("button", { name: /New Chat/i }),
    ).toBeInTheDocument();
  });

  it("calls router.push to /chat when clicked", () => {
    render(<NewChatButton />);
    const button = screen.getByRole("button", { name: /New Chat/i });
    fireEvent.click(button);
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/chat");
  });
});
