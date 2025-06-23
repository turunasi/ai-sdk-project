"use server";

import { signIn } from "@/features/auth/lib/auth";
import { AuthError } from "next-auth";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      return "Login failed. Please check your credentials and try again.";
    }
    throw error;
  }
}
