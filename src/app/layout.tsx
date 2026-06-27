import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Micro / Meso / Macro",
  description: "An interactive skill profiler for games beyond the usual genre labels.",
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
