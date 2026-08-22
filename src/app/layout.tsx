import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

// CSP nonces are created per request in proxy.ts, so HTML cannot be prerendered.
export const dynamic = "force-dynamic";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Renhet Studio",
    template: "%s | Renhet Studio",
  },
  description:
    "Renhet Studio is an independent international game studio. Play our first game, Beelze Pub, free on Itch.io.",
  applicationName: "Renhet Studio",
  keywords: ["indie game studio", "independent games", "Beelze Pub", "cozy games", "game development"],
  authors: [{ name: "Renhet Studio", url: "https://www.renhetstudio.com" }],
  creator: "Renhet Studio",
  publisher: "Renhet Studio",
  metadataBase: new URL("https://www.renhetstudio.com"),
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Renhet Studio",
    description:
      "Independent international game studio. Play our first game, Beelze Pub, free on Itch.io.",
    url: "https://www.renhetstudio.com",
    siteName: "Renhet Studio",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Renhet Studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Renhet Studio",
    description:
      "Play Renhet Studio's first game, Beelze Pub, free on Itch.io.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.className}>
      <body>{children}</body>
    </html>
  );
}
