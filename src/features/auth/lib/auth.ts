import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

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
      async authorize(credentials) {
        // ここでデータベースなどと照合してユーザーを検証します。
        // 今回はデモ用のダミー認証ロジックです
        if (
          credentials.email === "user@example.com" &&
          credentials.password === "password123"
        ) {
          // 検証成功後、ユーザーオブジェクトを返します。
          // このオブジェクトは`jwt`コールバックの`user`引数として渡されます。
          return { id: "1", name: "Taro Yamada", email: "user@example.com" };
        }
        // 検証失敗時はnullを返します。
        return null;
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
