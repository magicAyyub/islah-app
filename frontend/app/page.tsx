import { redirect } from "next/navigation"

export default function HomePage() {
  // Redirect to dashboard - the main entry point will be handled by middleware
  redirect("/dashboard")
}
