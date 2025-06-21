import { render, screen } from "@testing-library/react";
import RootLayout from "@/app/layout";
import { auth } from "@/features/auth/lib/auth";

// Mock the auth function from Auth.js
jest.mock("@/features/auth/lib/auth", () => ({
  auth: jest.fn(),
}));

describe("RootLayout", () => {
  const mockAuth = auth as jest.Mock;

  it("renders children correctly when user is not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const TestChild = () => <h1>Test Child</h1>;

    // RootLayout is an async Server Component, so we await its result
    const layout = await RootLayout({ children: <TestChild /> });
    render(layout);

    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });

  it("renders children correctly when user is authenticated", async () => {
    mockAuth.mockResolvedValue({
      user: { name: "Test User", email: "test@example.com" },
    });
    const TestChild = () => <h1>Test Child</h1>;

    const layout = await RootLayout({ children: <TestChild /> });
    render(layout);

    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });
});
