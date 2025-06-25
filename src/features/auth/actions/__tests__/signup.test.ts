// src/features/auth/actions/__tests__/signup.test.ts
import { signup } from "../signup";
import { addUser, signIn } from "@/features/auth/lib/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

// Mock dependencies
jest.mock("@/features/auth/lib/auth", () => ({
  addUser: jest.fn(),
  signIn: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("signup", () => {
  const mockAddUser = addUser as jest.Mock;
  const mockSignIn = signIn as jest.Mock;
  const mockRedirect = redirect as jest.Mock;

  const initialState = { message: null, errors: {} };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return validation errors for invalid email", async () => {
    const formData = new FormData();
    formData.append("email", "invalid-email");
    formData.append("password", "password123");

    const result = await signup(initialState, formData);

    expect(result).toEqual({
      errors: {
        email: ["Please enter a valid email address."],
      },
      message: "Invalid fields. Failed to create account.",
    });
    expect(mockAddUser).not.toHaveBeenCalled();
    expect(mockSignIn).not.toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("should return validation errors for short password", async () => {
    const formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("password", "short");

    const result = await signup(initialState, formData);

    expect(result).toEqual({
      errors: {
        password: ["Password must be at least 6 characters long."],
      },
      message: "Invalid fields. Failed to create account.",
    });
    expect(mockAddUser).not.toHaveBeenCalled();
    expect(mockSignIn).not.toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("should create user, sign in, and redirect on successful signup", async () => {
    const formData = new FormData();
    formData.append("email", "newuser@example.com");
    formData.append("password", "securepassword");

    mockAddUser.mockResolvedValue({});
    mockSignIn.mockResolvedValue(undefined);

    await signup(initialState, formData);

    expect(mockAddUser).toHaveBeenCalledTimes(1);
    expect(mockAddUser).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "newuser@example.com",
      }),
    );
    expect(mockSignIn).toHaveBeenCalledTimes(1);
    expect(mockSignIn).toHaveBeenCalledWith("credentials", {
      email: "newuser@example.com",
      password: "securepassword",
      redirect: false,
    });
    expect(mockRedirect).toHaveBeenCalledTimes(1);
    expect(mockRedirect).toHaveBeenCalledWith("/chat");
  });

  it("should return error message if email already exists", async () => {
    const formData = new FormData();
    formData.append("email", "existing@example.com");
    formData.append("password", "password123");

    mockAddUser.mockRejectedValue(
      new Error("User with this email already exists."),
    );

    const result = await signup(initialState, formData);

    expect(result).toEqual({
      message: "An account with this email already exists.",
    });
    expect(mockAddUser).toHaveBeenCalledTimes(1);
    expect(mockSignIn).not.toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("should return generic error if signIn fails after user creation", async () => {
    const formData = new FormData();
    formData.append("email", "another@example.com");
    formData.append("password", "password123");

    mockAddUser.mockResolvedValue({});
    mockSignIn.mockRejectedValue(new AuthError("CredentialsSignin"));

    const result = await signup(initialState, formData);

    expect(result).toEqual({
      message: "Something went wrong. Please try again.",
    });
    expect(mockAddUser).toHaveBeenCalledTimes(1);
    expect(mockSignIn).toHaveBeenCalledTimes(1);
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("should re-throw non-AuthError errors from signIn", async () => {
    const formData = new FormData();
    formData.append("email", "error@example.com");
    formData.append("password", "password123");

    mockAddUser.mockResolvedValue({});
    const genericError = new Error("Unexpected signIn error");
    mockSignIn.mockRejectedValue(genericError);

    await expect(signup(initialState, formData)).rejects.toThrow(
      "Unexpected signIn error",
    );
    expect(mockAddUser).toHaveBeenCalledTimes(1);
    expect(mockSignIn).toHaveBeenCalledTimes(1);
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});
