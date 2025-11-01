import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Providers } from "../provider";
import NavbarWrapper from "@/components/Navbar";
import FooterWrapper from "@/components/Footer";
import { redirect } from "next/navigation";
import 'quill/dist/quill.snow.css'
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "My App",
  description: "Modern Auth with Next.js",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login"); // forces logout users to go to login
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`} suppressHydrationWarning>
         <Providers session={session}> 
          <NavbarWrapper />
          <main  className="flex-grow">{children}</main>
          <FooterWrapper />
        </Providers>
      </body>
    </html>
  );
}
