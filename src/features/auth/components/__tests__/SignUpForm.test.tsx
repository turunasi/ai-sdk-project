// src/features/auth/components/__tests__/SignUpForm.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SignUpForm } from "../SignUpForm";
import { signup } from "@/features/auth/actions/signup";

// Mock the server action
jest.mock("@/features/auth/actions/signup", () => ({
  signup: jest.fn(),
}));

describe("SignUpForm", () => {
  const mockSignup = signup as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the signup form correctly", () => {
    render(<SignUpForm />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Create Account/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Log in/i })).toBeInTheDocument();
  });

  it("displays validation errors from the server action", async () => {
    // Use mockImplementation to explicitly define the async behavior of the mocked action.
    mockSignup.mockImplementation(async (state, formData) => {
      return {
        errors: {
          email: ["Please enter a valid email address."],
          password: ["Password must be at least 6 characters long."],
        },
        message: "Invalid fields. Failed to create account.",
      };
    });

    render(<SignUpForm />);

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "invalid" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Please enter a valid email address."),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Password must be at least 6 characters long."),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Invalid fields. Failed to create account."),
      ).toBeInTheDocument();
    });
  });

  it("displays a general error message from the server action", async () => {
    mockSignup.mockResolvedValue({
      message: "An account with this email already exists.",
    });

    render(<SignUpForm />);

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "existing@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

    await waitFor(() => {
      expect(
        screen.getByText("An account with this email already exists."),
      ).toBeInTheDocument();
    });
  });

  it("shows pending state when submitting", async () => {
    mockSignup.mockReturnValue(new Promise(() => {})); // Never resolves to keep pending state

    render(<SignUpForm />);

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Creating account.../i }),
      ).toBeInTheDocument();
    });
  });
});
