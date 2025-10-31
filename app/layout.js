// app/layout.js
import "./globals.css";

export const metadata = {
  title: "DevSphere",
  description: "Modern Auth with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
