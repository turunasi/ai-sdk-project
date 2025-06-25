import { authConfig } from "../auth";
import type { JWT } from "next-auth/jwt";
import { CredentialsSignin } from "next-auth";
import type { Session, User } from "next-auth";
import { prisma } from "@/features/database";
import bcrypt from "bcryptjs";

jest.mock("@/features/database", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));
jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
}));

const mockPrismaUserFindUnique = prisma.user.findUnique as jest.Mock;
const mockBcryptCompare = bcrypt.compare as jest.Mock;

describe("Auth.js Config Callbacks", () => {
  describe("authorize callback", () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const authorize = authConfig.providers.find(
      (p) => p.id === "credentials",
    )?.authorize;

    beforeEach(() => {
      mockPrismaUserFindUnique.mockReset();
      mockBcryptCompare.mockReset();
    });

    it("should return a user object for valid credentials", async () => {
      const mockUser = {
        id: "1",
        name: "Taro Yamada",
        email: "user@example.com",
        password: "hashed_password",
      };
      mockPrismaUserFindUnique.mockResolvedValue(mockUser);
      mockBcryptCompare.mockResolvedValue(true);

      const credentials = {
        email: "user@example.com",
        password: "password123",
      };
      const user = await authorize?.(credentials, null as any);
      const { password, ...expectedUser } = mockUser;
      expect(user).toEqual(expectedUser);
    });

    it("should throw CredentialsSignin for invalid email", async () => {
      mockPrismaUserFindUnique.mockResolvedValue(null);
      const credentials = {
        email: "wrong@example.com",
        password: "password123",
      };
      await expect(authorize?.(credentials, null as any)).rejects.toThrow(
        new CredentialsSignin("メールアドレスまたはパスワードが違います。"),
      );
    });

    it("should throw CredentialsSignin for invalid password", async () => {
      const mockUser = {
        id: "1",
        email: "user@example.com",
        password: "hashed_password",
      };
      mockPrismaUserFindUnique.mockResolvedValue(mockUser);
      mockBcryptCompare.mockResolvedValue(false);
      const credentials = {
        email: "user@example.com",
        password: "wrongpassword",
      };
      await expect(authorize?.(credentials, null as any)).rejects.toThrow(
        new CredentialsSignin("メールアドレスまたはパスワードが違います。"),
      );
    });
  });

  describe("jwt callback", () => {
    const jwtCallback = authConfig.callbacks?.jwt;

    it("should add user id to the token if user object exists", async () => {
      const token: JWT = { name: "Taro Yamada", email: "user@example.com" };
      const user: User = {
        id: "1",
        name: "Taro Yamada",
        email: "user@example.com",
      };
      const result = await jwtCallback?.({ token, user });
      expect(result?.id).toBe("1");
    });

    it("should return the original token if user object does not exist", async () => {
      const token: JWT = {
        name: "Taro Yamada",
        email: "user@example.com",
        id: "1",
      };
      const result = await jwtCallback?.({ token, user: undefined });
      expect(result).toEqual(token);
    });
  });

  describe("session callback", () => {
    const sessionCallback = authConfig.callbacks?.session;

    it("should add user id from token to the session", async () => {
      const session: Session = {
        user: { name: "Taro Yamada", email: "user@example.com" },
        expires: "1",
      };
      const token: JWT = { id: "123-test-id" };
      const result = await sessionCallback?.({ session, token });
      expect(result?.user.id).toBe("123-test-id");
    });
  });

  describe("authorized callback", () => {
    const authorizedCallback = authConfig.callbacks?.authorized;

    it("should return true if auth object with user exists", () => {
      const auth = { user: { id: "1", name: "Taro" } };
      const result = authorizedCallback?.({ auth } as any);
      expect(result).toBe(true);
    });

    it("should return false if auth object is null or has no user", () => {
      expect(authorizedCallback?.({ auth: null } as any)).toBe(false);
      expect(authorizedCallback?.({ auth: {} } as any)).toBe(false);
    });
  });
});
