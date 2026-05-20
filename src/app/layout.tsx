import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Renhet Studio",
  description:
    "Independent video game studio crafting atmospheric games with memorable worlds.",
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