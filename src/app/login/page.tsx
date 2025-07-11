import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <h1 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
          Welcome Back
        </h1>
        <LoginForm />
      </div>
    </main>
  );
}
