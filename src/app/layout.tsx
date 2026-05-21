import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Renhet Studio",
    template: "%s | Renhet Studio",
  },
  description:
    "Renhet Studio is an independent international game studio shaping handmade worlds through code, art, music, sound, design, and production.",
  metadataBase: new URL("https://www.renhetstudio.com"),
  openGraph: {
    title: "Renhet Studio",
    description:
      "Independent international game studio shaping handmade worlds through code, art, music, sound, design, and production.",
    url: "https://www.renhetstudio.com",
    siteName: "Renhet Studio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Renhet Studio",
    description:
      "Independent international game studio shaping handmade worlds through code, art, music, sound, design, and production.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geist.className}>
      <body>{children}</body>
    </html>
  );
}
