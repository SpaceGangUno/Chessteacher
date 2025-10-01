import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chess Teacher - Master the Game",
  description: "Interactive chess learning platform with lessons, puzzles, and analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}


