"use server";

import { signIn } from "@/features/auth/lib/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { fa } from "zod/v4/locales";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  // FormDataからemailとpasswordを抽出
  const { email, password } = Object.fromEntries(formData.entries());

  try {
    await signIn("credentials", { email, password, redirect: false });
    redirect("/chat");
  } catch (error) {
    if (error instanceof AuthError) {
      return "Login failed. Please check your credentials and try again.";
    }
    throw error;
  }
}
