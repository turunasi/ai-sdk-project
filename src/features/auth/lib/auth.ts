import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"; // bcryptjsをインポート
import { prisma } from "@/features/database"; // Prismaクライアントをインポート

/**
 * 新規ユーザーをデータベースに追加する関数
 * @param user - 追加するユーザー情報 (email, password, name?)
 * @returns 作成されたユーザーオブジェクト
 * @throws Error - 同じメールアドレスのユーザーが既に存在する場合
 */
export const addUser = async (user: {
  email: string;
  password: string;
  name?: string;
}) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: user.email },
  });
  if (existingUser) {
    throw new Error("User with this email already exists.");
  }
  return prisma.user.create({ data: user });
};

/**
 * NextAuth.jsの設定オプションです。
 * @see https://authjs.dev/reference/nextjs
 */
export const authConfig = {
  providers: [
    Credentials({
      // フォームのUIは自前で用意するため、ここでは定義不要
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    /**
     * ミドルウェアで実行され、リクエストが承認されているかどうかを検証します。
     * @see https://authjs.dev/reference/nextjs#authorized
     */
    authorized({ auth }) {
      const isLoggedIn = !!auth?.user;
      return isLoggedIn;
    },
    // `authorize`関数で返された`user`オブジェクトは、`jwt`コールバックの`user`引数として渡されます。
    // ここでトークンに含めたい情報（例: ユーザーID）を追加します。
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // `session`コールバックでは、クライアント側で利用するセッション情報にプロパティを追加します。
    async session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
