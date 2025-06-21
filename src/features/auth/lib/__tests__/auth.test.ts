import { authConfig } from "../auth";
import type { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";

describe("Auth.js Config Callbacks", () => {
  describe("authorize callback", () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const authorize = authConfig.providers.find(
      (p) => p.id === "credentials",
    )?.authorize;

    it("should return a user object for valid credentials", async () => {
      const credentials = {
        email: "user@example.com",
        password: "password123",
      };
      const user = await authorize?.(credentials, null as any);
      expect(user).toEqual({
        id: "1",
        name: "Taro Yamada",
        email: "user@example.com",
      });
    });

    it("should return null for invalid email", async () => {
      const credentials = {
        email: "wrong@example.com",
        password: "password123",
      };
      const user = await authorize?.(credentials, null as any);
      expect(user).toBeNull();
    });

    it("should return null for invalid password", async () => {
      const credentials = {
        email: "user@example.com",
        password: "wrongpassword",
      };
      const user = await authorize?.(credentials, null as any);
      expect(user).toBeNull();
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
