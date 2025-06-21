import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * `useSession`や`auth`関数から返される`Session`オブジェクトの型を拡張します。
   */
  interface Session {
    user: {
      /** ユーザーID */
      id: string;
    } & DefaultSession["user"]; // `name`, `email`, `image`を継承
  }
}
