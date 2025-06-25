import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginForm } from "../LoginForm";
import { authenticate } from "@/features/auth/actions/login";

// Mock the server action
jest.mock("@/features/auth/actions/login", () => ({
  authenticate: jest.fn(),
}));

describe("LoginForm", () => {
  const mockAuthenticate = authenticate as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the login form correctly", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Log in/i })).toBeInTheDocument();
  });

  it("calls the authenticate action on submit", async () => {
    mockAuthenticate.mockResolvedValue(undefined);

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Log in/i }));

    await waitFor(() => {
      expect(mockAuthenticate).toHaveBeenCalled();
    });
  });

  it("handles failed login and displays an error message", async () => {
    const errorMessage =
      "Login failed. Please check your credentials and try again.";
    mockAuthenticate.mockImplementation(async (prevState, formData) => {
      return errorMessage;
    });

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Log in/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
