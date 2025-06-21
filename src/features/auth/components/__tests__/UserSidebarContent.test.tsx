import { render, screen, fireEvent } from "@testing-library/react";
import { UserSidebarContent } from "../UserSidebarContent";
import { useSession, signOut } from "next-auth/react";

// Mock next-auth/react
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

describe("UserSidebarContent", () => {
  const mockUseSession = useSession as jest.Mock;
  const mockSignOut = signOut as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders user information and logout button when session exists", () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          name: "Taro Yamada",
          email: "user@example.com",
        },
      },
      status: "authenticated",
    });

    render(<UserSidebarContent />);

    expect(screen.getByText("ユーザー情報")).toBeInTheDocument();
    expect(screen.getByText("Taro Yamada")).toBeInTheDocument();
    expect(screen.getByText("user@example.com")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "ログアウト" }),
    ).toBeInTheDocument();
  });

  it("calls signOut when the logout button is clicked", () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          name: "Taro Yamada",
          email: "user@example.com",
        },
      },
      status: "authenticated",
    });

    render(<UserSidebarContent />);

    const logoutButton = screen.getByRole("button", { name: "ログアウト" });
    fireEvent.click(logoutButton);

    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: "/login" });
  });

  it("renders null when there is no session data", () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    const { container } = render(<UserSidebarContent />);
    expect(container.firstChild).toBeNull();
  });
});
