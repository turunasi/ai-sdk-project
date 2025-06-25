import NextAuth, { CredentialsSignin, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/features/database"; // Prismaクライアントをインポート
import { z } from "zod";

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

const CredentialsSchema = z.object({
  email: z
    .string()
    .email({ message: "正しいメールアドレスの形式で入力してください。" }),
  password: z.string().min(1, { message: "パスワードを入力してください。" }), // 最低1文字以上（空文字を許容しない）
});

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
        // 1. Zodスキーマで入力情報をパース（検証）する
        const parsedCredentials = CredentialsSchema.safeParse(credentials);

        // 2. バリデーションに失敗した場合はエラーをスローする
        if (!parsedCredentials.success) {
          // Zodが生成したエラーメッセージを返すことも可能
          // const errorMessage = parsedCredentials.error.errors.map(e => e.message).join('\n');
          throw new CredentialsSignin(
            "入力情報が不足しているか、形式が正しくありません。",
          );
        }

        // 3. パース済みの安全なデータを取得
        const { email, password } = parsedCredentials.data;

        // データベースでユーザーを検索（型アサーションは不要）
        const user = await prisma.user.findUnique({
          where: { email },
        });

        // ユーザーが存在しない場合でも、タイミング攻撃対策は維持
        if (!user || !user.password) {
          // ダミーのハッシュと比較することで、ユーザーの存在を推測されにくくする
          await bcrypt.compare(
            "dummy-password",
            "$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
          );
          throw new CredentialsSignin(
            "メールアドレスまたはパスワードが違います。",
          );
        }

        // パスワードを比較（型アサーションは不要）
        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (passwordsMatch) {
          // 認証成功時、パスワードを除いたユーザー情報を返す
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        }

        // パスワードが一致しない場合
        throw new CredentialsSignin(
          "メールアドレスまたはパスワードが違います。",
        );
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
