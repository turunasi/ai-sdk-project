import { auth } from "@/features/auth/lib/auth";

export default auth;

export const config = {
  matcher: ["/((?!api|login|_next/static|_next/image|favicon.ico).*)"],
};
