import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skillcheck",
  description: "Find your next game by mapping the skill pressure behind Micro, Meso, and Macro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
