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
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex items-center justify-center min-h-screen bg-gray-50`}
      >
        <main className="w-full  bg-white  rounded-2xl shadow-lg">
          {children}
        </main>
      </body>
    </html>
  );
}
