import { redirect } from "next/navigation";

// This component redirects to the main chat page.
export default function HomePage() {
  redirect("/chat");
}
