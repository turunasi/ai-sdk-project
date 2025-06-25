import { render, screen, fireEvent } from "@testing-library/react";
import { UserSidebarContent } from "../UserSidebarContent";
import { signOut } from "next-auth/react";

// Mock next-auth/react
jest.mock("next-auth/react", () => ({
  signOut: jest.fn(),
}));

describe("UserSidebarContent", () => {
  const mockSignOut = signOut as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders user information and logout button when session exists", () => {
    const mockSession = {
      user: { name: "Taro Yamada", email: "user@example.com", id: "123" },
      expires: "some-date",
    };

    render(<UserSidebarContent session={mockSession} />);

    expect(screen.getByText("Taro Yamada")).toBeInTheDocument();
    expect(screen.getByText("user@example.com")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /ログアウト/i }),
    ).toBeInTheDocument();
  });

  it("calls signOut when the logout button is clicked", () => {
    const mockSession = {
      user: { name: "Taro Yamada", email: "user@example.com", id: "123" },
      expires: "some-date",
    };
    render(<UserSidebarContent session={mockSession} />);

    const logoutButton = screen.getByRole("button", { name: /ログアウト/i });
    fireEvent.click(logoutButton);
    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: "/login" });
  });

  it("renders null when there is no session data", () => {
    const { container } = render(<UserSidebarContent session={null} />);
    expect(container.firstChild).toBeNull();
  });
});
