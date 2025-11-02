// app/(protected)/layout.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Providers } from "../provider";
import NavbarWrapper from "@/components/Navbar";
import FooterWrapper from "@/components/Footer";
import "quill/dist/quill.snow.css";

export default async function ProtectedLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <Providers session={session}>
      <NavbarWrapper />
      <main className="flex-grow">{children}</main>
      <FooterWrapper />
    </Providers>
  );
}
