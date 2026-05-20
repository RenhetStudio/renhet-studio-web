import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Renhet Studio",
    template: "%s | Renhet Studio",
  },
  description:
    "Renhet Studio is an independent video game studio crafting atmospheric games with memorable worlds.",
  metadataBase: new URL("https://www.renhetstudio.com"),
  openGraph: {
    title: "Renhet Studio",
    description:
      "Independent video game studio crafting atmospheric games with memorable worlds.",
    url: "https://www.renhetstudio.com",
    siteName: "Renhet Studio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Renhet Studio",
    description:
      "Independent video game studio crafting atmospheric games with memorable worlds.",
  },
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