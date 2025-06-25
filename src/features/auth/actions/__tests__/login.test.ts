// src/features/auth/actions/__tests__/login.test.ts
import { authenticate } from "../login";
import { signIn } from "@/features/auth/lib/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

// Mock signIn and redirect
jest.mock("@/features/auth/lib/auth", () => ({
  signIn: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("authenticate", () => {
  const mockSignIn = signIn as jest.Mock;
  const mockRedirect = redirect as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call signIn with credentials and redirect on success", async () => {
    const formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("password", "password123");

    mockSignIn.mockResolvedValue(undefined); // signIn doesn't return anything on success

    await authenticate(undefined, formData);

    expect(mockSignIn).toHaveBeenCalledTimes(1);
    expect(mockSignIn).toHaveBeenCalledWith("credentials", {
      email: "test@example.com",
      password: "password123",
      redirect: false,
    });
    expect(mockRedirect).toHaveBeenCalledTimes(1);
    expect(mockRedirect).toHaveBeenCalledWith("/chat");
  });

  it("should return an error message for AuthError", async () => {
    const formData = new FormData();
    formData.append("email", "wrong@example.com");
    formData.append("password", "wrongpassword");

    mockSignIn.mockRejectedValue(new AuthError("CredentialsSignin"));

    const result = await authenticate(undefined, formData);

    expect(mockSignIn).toHaveBeenCalledTimes(1);
    expect(result).toBe(
      "Login failed. Please check your credentials and try again.",
    );
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("should re-throw non-AuthError errors", async () => {
    const formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("password", "password123");

    const genericError = new Error("Something unexpected happened");
    mockSignIn.mockRejectedValue(genericError);

    await expect(authenticate(undefined, formData)).rejects.toThrow(
      "Something unexpected happened",
    );
    expect(mockSignIn).toHaveBeenCalledTimes(1);
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});
