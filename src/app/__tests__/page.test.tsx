import HomePage from "@/app/page";
import { redirect } from "next/navigation";

jest.mock("next/navigation", () => ({
  redirect: jest.fn((url: string) => {
    // In a test environment, redirect throws an error that can be caught.
    throw new Error(`NEXT_REDIRECT: ${url}`);
  }),
}));

describe("HomePage", () => {
  const mockRedirect = redirect as jest.Mock;

  it("should redirect to /chat", () => {
    // The HomePage component itself throws the error when redirect is called.
    expect(() => {
      HomePage();
    }).toThrow("NEXT_REDIRECT: /chat");
    expect(mockRedirect).toHaveBeenCalledWith("/chat");
  });
});
