import { render, screen } from "@testing-library/react";
import { Providers } from "../providers";
import { SessionProvider } from "next-auth/react";

// Mock SessionProvider to check props
jest.mock("next-auth/react", () => ({
  SessionProvider: jest.fn(({ children }) => (
    <div data-testid="session-provider">{children}</div>
  )),
}));

describe("Providers", () => {
  const mockSessionProvider = SessionProvider as jest.Mock;

  beforeEach(() => {
    mockSessionProvider.mockClear();
  });

  it("renders children wrapped in SessionProvider with null session", () => {
    render(
      <Providers session={null}>
        <div>Child Component</div>
      </Providers>,
    );

    expect(screen.getByTestId("session-provider")).toBeInTheDocument();
    expect(screen.getByText("Child Component")).toBeInTheDocument();
    // Check only the props object (the first argument)
    expect(mockSessionProvider.mock.calls[0][0]).toEqual(
      expect.objectContaining({ session: null }),
    );
  });

  it("renders children wrapped in SessionProvider with a valid session", () => {
    const mockSession = { user: { name: "Test" }, expires: "1" };
    render(
      <Providers session={mockSession}>
        <div>Child Component</div>
      </Providers>,
    );

    expect(screen.getByTestId("session-provider")).toBeInTheDocument();
    expect(screen.getByText("Child Component")).toBeInTheDocument();
    // Check only the props object (the first argument)
    expect(mockSessionProvider.mock.calls[0][0]).toEqual(
      expect.objectContaining({ session: mockSession }),
    );
  });
});
