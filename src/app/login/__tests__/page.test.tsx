import { render, screen } from "@testing-library/react";
import LoginPage from "../page";

// Mock the LoginForm component
jest.mock("@/features/auth/components/LoginForm", () => ({
  LoginForm: () => <div data-testid="login-form">Mocked LoginForm</div>,
}));

describe("LoginPage", () => {
  it("renders the LoginForm component", () => {
    render(<LoginPage />);
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
    expect(screen.getByText("Mocked LoginForm")).toBeInTheDocument();
  });
});
