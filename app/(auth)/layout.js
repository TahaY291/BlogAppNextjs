import "../globals.css";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Authentication",
  description: "Login or Register to continue",
};

export default function AuthLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex items-center  justify-center min-h-screen bg-red-50`}
      >
        <main className="rounded-2xl bg-white min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
