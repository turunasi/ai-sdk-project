// src/app/signup/__tests__/page.test.tsx
import { render, screen } from "@testing-library/react";
import SignUpPage from "../page";

// Mock the SignUpForm component
jest.mock("@/features/auth/components/SignUpForm", () => ({
  SignUpForm: () => <div data-testid="signup-form">Mocked SignUpForm</div>,
}));

describe("SignUpPage", () => {
  it("renders the SignUpForm component", () => {
    render(<SignUpPage />);
    expect(screen.getByTestId("signup-form")).toBeInTheDocument();
    expect(screen.getByText("Mocked SignUpForm")).toBeInTheDocument();
  });
});
