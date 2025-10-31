// app/page.js
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    // if no user logged in → redirect to login
    redirect("/login");
  }

  return (
    <main className="p-4">
      <h1>Welcome {session.user.name}</h1>
      <p>This is your home page.</p>
    </main>
  );
}
