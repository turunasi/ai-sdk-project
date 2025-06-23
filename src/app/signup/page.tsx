import { SignUpForm } from "@/features/auth/components/SignUpForm";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <h1 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
          Create an Account
        </h1>
        <SignUpForm />
      </div>
    </main>
  );
}
