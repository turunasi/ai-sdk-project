"use client";

import { signup } from "@/features/auth/actions/signup";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

function SignUpButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      aria-disabled={pending}
      className="w-full rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
    >
      {pending ? "Creating account..." : "Create Account"}
    </button>
  );
}

export function SignUpForm() {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(signup, initialState);

  return (
    <form action={dispatch} className="space-y-6">
      <div className="space-y-4 rounded-md">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 block w-full appearance-none rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
          {state.errors?.email && (
            <p className="mt-1 text-sm text-red-500">{state.errors.email}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="mt-1 block w-full appearance-none rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
          {state.errors?.password && (
            <p className="mt-1 text-sm text-red-500">{state.errors.password}</p>
          )}
        </div>
      </div>
      <SignUpButton />
      {state.message && (
        <p className="text-center text-sm text-red-500">{state.message}</p>
      )}
      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-blue-600 hover:underline dark:text-blue-500"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}
