"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { addUser } from "@/features/auth/lib/auth";
import { signIn } from "@/features/auth/lib/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

const SignUpSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
});

export type State = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};

export async function signup(prevState: State, formData: FormData) {
  const validatedFields = SignUpSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid fields. Failed to create account.",
    };
  }

  const { email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await addUser({
      email,
      password: hashedPassword,
    });
  } catch (error) {
    return { message: "An account with this email already exists." };
  }

  try {
    await signIn("credentials", { email, password, redirect: false });
    redirect("/chat");
  } catch (error) {
    if (error instanceof AuthError) {
      // ここでのエラーは主に認証の失敗（CredentialsSignin）を想定
      return { message: "Something went wrong. Please try again." };
    }
    throw error;
  }
}
